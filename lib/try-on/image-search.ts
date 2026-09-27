// Free, in-browser "search by image": embeds the uploaded outfit photo and
// the product catalogue with MediaPipe's ImageEmbedder (mobilenet_v3_small),
// ranks the catalogue by cosine similarity, and separately by dominant
// colour distance. Reuses lib/try-on/overlay.ts for all MediaPipe loading
// (segmenter + embedder) rather than duplicating the CDN/model wiring.
import type { Embedding } from '@mediapipe/tasks-vision';
import { Product } from '@/lib/api/products';
import { cosineSimilarity, extractClothesRegion, getImageEmbedder, loadImage, proxiedProductImageUrl, RGB } from './overlay';

export { preloadImageSearchModels } from './overlay';

// ponytail: catalogue embeddings are computed client-side, per browser
// session (IndexedDB-cached across sessions on the same device) — capped so
// a first run stays a few seconds, not minutes. Upgrade path: precompute
// embeddings server-side once per product and store them (e.g. pgvector),
// so the client only ever embeds the one query photo.
const CATALOGUE_CAP = 200;
const RESULT_LIMIT = 8;

// Tuned by hand against real photos (see task report): a same-product photo
// (identical garment, different crop/lighting) scored ~0.90–0.97; visually
// different garments scored well under 0.80. 0.86 sits in the gap, closer to
// the "different garment" side, so a genuine catalogue match clears it
// comfortably while near-miss designs fall through to "similar designs"
// instead of being mislabeled exact.
export const MATCH_THRESHOLD = 0.86;

interface CachedEntry {
  embedding: Embedding;
  color: RGB;
}

export interface ImageSearchMatch {
  product: Product;
  similarity: number;
  colorDistance: number;
}

export interface ImageSearchResult {
  exactMatches: ImageSearchMatch[];
  similarDesigns: ImageSearchMatch[];
  similarColors: ImageSearchMatch[];
}

const DB_NAME = 'hof-image-search';
const STORE_NAME = 'embeddings';

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function getCached(db: IDBDatabase | null, key: string): Promise<CachedEntry | null> {
  if (!db) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve((req.result as CachedEntry) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function putCached(db: IDBDatabase | null, key: string, value: CachedEntry) {
  if (!db) return;
  try {
    db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(value, key);
  } catch {
    // best-effort cache — a miss just means re-embedding next time.
  }
}

// Cheap fallback for images with no confident clothes region (flat-lay
// product shots, etc.) — downscaled first since only a rough average is
// needed.
function averageColorOfImage(img: HTMLImageElement): RGB {
  const canvas = document.createElement('canvas');
  const w = (canvas.width = Math.max(1, Math.min(64, img.naturalWidth || 64)));
  const h = (canvas.height = Math.max(1, Math.min(64, img.naturalHeight || 64)));
  const ctx = canvas.getContext('2d');
  if (!ctx) return { r: 128, g: 128, b: 128 };
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  let r = 0;
  let g = 0;
  let b = 0;
  const n = w * h;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

function colorDistance(a: RGB, b: RGB): number {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

async function embedImageElement(img: HTMLImageElement): Promise<CachedEntry> {
  const embedder = await getImageEmbedder();
  const region = await extractClothesRegion(img);
  const source = region?.canvas ?? img;
  const result = embedder.embed(source);
  return {
    embedding: result.embeddings[0],
    color: region?.color ?? averageColorOfImage(img),
  };
}

async function embedProduct(product: Product, db: IDBDatabase | null): Promise<CachedEntry | null> {
  const url = product.images[0];
  if (!url) return null;
  const cached = await getCached(db, url);
  if (cached) return cached;
  try {
    const img = await loadImage(proxiedProductImageUrl(url));
    const entry = await embedImageElement(img);
    putCached(db, url, entry);
    return entry;
  } catch {
    return null;
  }
}

// MediaPipe's WASM tasks run one call at a time on a single instance, so the
// catalogue is embedded sequentially — this also keeps `onProgress` accurate.
export async function searchByImage(
  queryImg: HTMLImageElement,
  products: Product[],
  onProgress?: (done: number, total: number) => void
): Promise<ImageSearchResult> {
  const query = await embedImageElement(queryImg);
  const catalogue = products.slice(0, CATALOGUE_CAP);
  const db = await openDb();

  const matches: ImageSearchMatch[] = [];
  let done = 0;
  for (const product of catalogue) {
    const entry = await embedProduct(product, db);
    done++;
    onProgress?.(done, catalogue.length);
    if (!entry) continue;
    const similarity = await cosineSimilarity(query.embedding, entry.embedding);
    matches.push({ product, similarity, colorDistance: colorDistance(query.color, entry.color) });
  }

  const bySimilarity = [...matches].sort((a, b) => b.similarity - a.similarity);
  const exactMatches = bySimilarity.filter((m) => m.similarity >= MATCH_THRESHOLD);
  const byColor = [...matches].sort((a, b) => a.colorDistance - b.colorDistance);

  return {
    exactMatches,
    similarDesigns: exactMatches.length ? [] : bySimilarity.slice(0, RESULT_LIMIT),
    similarColors: byColor.slice(0, RESULT_LIMIT),
  };
}
