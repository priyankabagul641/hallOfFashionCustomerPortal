// On-device "sticker" virtual try-on: cuts the garment out of a product photo
// (MediaPipe body segmentation, clothes category) and warps it onto a
// customer photo using shoulder/hip pose landmarks. Runs entirely in the
// browser — nothing here ever leaves the device.
//
// Also the shared home for lazy-loading MediaPipe models (WASM fileset,
// segmenter, pose landmarker, image embedder) — lib/try-on/image-search.ts
// reuses the segmenter and embedder loaders from here rather than
// duplicating the CDN/model wiring.
import type { Embedding, ImageSegmenter, NormalizedLandmark, PoseLandmarker, ImageEmbedder } from '@mediapipe/tasks-vision';

export class TryOnError extends Error {}

export const CLOTHES_CATEGORY = 4;
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;

const SEGMENTER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite';
const POSE_MODEL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';
const EMBEDDER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/latest/mobilenet_v3_small.tflite';
// ponytail: pinned to match the "@mediapipe/tasks-vision" version in
// package.json (avoids a JSON-import round trip just to read it back) — bump
// both together.
const TASKS_VISION_VERSION = '1.0.1';

// ponytail: GPU delegate is tried first (fast) and CPU is the fallback for
// browsers/sandboxes without WebGL2 — no further delegate tuning for a trial.
async function createWithDelegateFallback<T>(create: (delegate: 'GPU' | 'CPU') => Promise<T>): Promise<T> {
  try {
    return await create('GPU');
  } catch {
    return create('CPU');
  }
}

// WasmFileset isn't an exported type from the package, so its shape is
// inferred from this loader rather than named directly.
async function loadFileset() {
  const { FilesetResolver } = await import('@mediapipe/tasks-vision');
  return FilesetResolver.forVisionTasks(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`);
}
type Fileset = Awaited<ReturnType<typeof loadFileset>>;

let filesetPromise: Promise<Fileset> | null = null;
async function getFileset(): Promise<Fileset> {
  if (!filesetPromise) {
    filesetPromise = loadFileset().catch((err) => {
      filesetPromise = null;
      throw err;
    });
  }
  return filesetPromise;
}

let segmenterPromise: Promise<ImageSegmenter> | null = null;
export async function getSegmenter(): Promise<ImageSegmenter> {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const { ImageSegmenter } = await import('@mediapipe/tasks-vision');
      const fileset = await getFileset();
      return createWithDelegateFallback((delegate) =>
        ImageSegmenter.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: SEGMENTER_MODEL, delegate },
          runningMode: 'IMAGE',
          outputCategoryMask: true,
          outputConfidenceMasks: false,
        })
      );
    })().catch((err) => {
      segmenterPromise = null;
      throw err;
    });
  }
  return segmenterPromise;
}

let posePromise: Promise<PoseLandmarker> | null = null;
async function getPoseLandmarker(): Promise<PoseLandmarker> {
  if (!posePromise) {
    posePromise = (async () => {
      const { PoseLandmarker } = await import('@mediapipe/tasks-vision');
      const fileset = await getFileset();
      return createWithDelegateFallback((delegate) =>
        PoseLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: POSE_MODEL, delegate },
          runningMode: 'IMAGE',
          numPoses: 1,
        })
      );
    })().catch((err) => {
      posePromise = null;
      throw err;
    });
  }
  return posePromise;
}

let embedderPromise: Promise<ImageEmbedder> | null = null;
export async function getImageEmbedder(): Promise<ImageEmbedder> {
  if (!embedderPromise) {
    embedderPromise = (async () => {
      const { ImageEmbedder } = await import('@mediapipe/tasks-vision');
      const fileset = await getFileset();
      return createWithDelegateFallback((delegate) =>
        ImageEmbedder.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: EMBEDDER_MODEL, delegate },
          runningMode: 'IMAGE',
          l2Normalize: true,
          quantize: false,
        })
      );
    })().catch((err) => {
      embedderPromise = null;
      throw err;
    });
  }
  return embedderPromise;
}

export async function cosineSimilarity(a: Embedding, b: Embedding): Promise<number> {
  const { ImageEmbedder } = await import('@mediapipe/tasks-vision');
  return ImageEmbedder.cosineSimilarity(a, b);
}

// Loads the try-on models ahead of time so the wait happens while the
// customer is still picking their photo/product rather than after "generate".
export function preloadTryOnModels() {
  void getSegmenter();
  void getPoseLandmarker();
}

// Loads the image-search models ahead of time — deliberately not the pose
// landmarker, which search never uses.
export function preloadImageSearchModels() {
  void getSegmenter();
  void getImageEmbedder();
}

// Product photos come from S3 (or the backend's disk-storage fallback host)
// with no CORS headers, which taints a canvas drawn from them directly —
// route through our same-origin proxy instead. See the host allow-list
// (derived from the same API base URL) and content-type checks in
// app/api/try-on/proxy-image/route.ts.
export function proxiedProductImageUrl(src: string): string {
  return `/api/try-on/proxy-image?url=${encodeURIComponent(src)}`;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new TryOnError('Could not load that image.'));
    img.src = src;
  });
}

// Downscales to `maxEdge` on the long side and re-encodes as JPEG so the
// photo is cheap to run through pose detection and cheap to keep in
// localStorage.
export async function resizeImageFile(file: File, maxEdge = 1024): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new TryOnError('Could not read that file.'));
    reader.readAsDataURL(file);
  });

  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new TryOnError('Canvas is not supported in this browser.');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

// Runs body segmentation and returns the raw category mask (one category
// index per pixel — see CLOTHES_CATEGORY) plus its own pixel dimensions.
// Shared by the try-on garment cutout and the image-search clothes crop.
async function segmentClothesMask(
  img: HTMLImageElement
): Promise<{ maskData: Uint8Array; maskWidth: number; maskHeight: number } | null> {
  const segmenter = await getSegmenter();
  const segmentation = segmenter.segment(img);
  const categoryMask = segmentation.categoryMask;
  if (!categoryMask) {
    segmentation.close();
    return null;
  }
  const maskWidth = categoryMask.width;
  const maskHeight = categoryMask.height;
  const maskData = categoryMask.getAsUint8Array();
  categoryMask.close();
  segmentation.close();
  return { maskData, maskWidth, maskHeight };
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ClothesRegion {
  // Cropped to the clothes bounding box, background pixels neutralized to
  // white — a clean input for the embedder (no distracting face/background).
  canvas: HTMLCanvasElement;
  color: RGB;
}

// Segments `img`, crops to the clothes bounding box, and computes the
// average colour over clothes pixels only. Returns null when there's no
// confident clothes region (product still-life, flat-lay, etc.) — callers
// fall back to using the whole image.
export async function extractClothesRegion(img: HTMLImageElement): Promise<ClothesRegion | null> {
  const mask = await segmentClothesMask(img);
  if (!mask) return null;
  const { maskData, maskWidth, maskHeight } = mask;

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = maskWidth;
  srcCanvas.height = maskHeight;
  const srcCtx = srcCanvas.getContext('2d');
  if (!srcCtx) return null;
  srcCtx.drawImage(img, 0, 0, maskWidth, maskHeight);
  const imageData = srcCtx.getImageData(0, 0, maskWidth, maskHeight);

  let minX = maskWidth;
  let minY = maskHeight;
  let maxX = 0;
  let maxY = 0;
  let count = 0;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;

  for (let y = 0; y < maskHeight; y++) {
    for (let x = 0; x < maskWidth; x++) {
      const i = y * maskWidth + x;
      const p = i * 4;
      if (maskData[i] === CLOTHES_CATEGORY) {
        rSum += imageData.data[p];
        gSum += imageData.data[p + 1];
        bSum += imageData.data[p + 2];
        count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      } else {
        imageData.data[p] = 255;
        imageData.data[p + 1] = 255;
        imageData.data[p + 2] = 255;
        imageData.data[p + 3] = 255;
      }
    }
  }

  if (count < maskWidth * maskHeight * 0.01) return null;
  srcCtx.putImageData(imageData, 0, 0);

  const cropWidth = Math.max(1, maxX - minX + 1);
  const cropHeight = Math.max(1, maxY - minY + 1);
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;
  const cropCtx = cropCanvas.getContext('2d');
  if (!cropCtx) return null;
  cropCtx.drawImage(srcCanvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  return {
    canvas: cropCanvas,
    color: { r: Math.round(rSum / count), g: Math.round(gSum / count), b: Math.round(bSum / count) },
  };
}

type Point = { x: number; y: number };

function point(landmark: NormalizedLandmark, width: number, height: number): Point {
  return { x: landmark.x * width, y: landmark.y * height };
}
function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// MediaPipe still returns 33 landmarks with a rough guess even when the
// shoulders/hips are outside the frame (e.g. a headshot) — visibility is the
// only signal that guess is unreliable, so a full torso must clear this bar
// rather than just "landmarks exist" before we trust it enough to align on.
const MIN_TORSO_VISIBILITY = 0.5;
function hasConfidentTorso(landmarks: NormalizedLandmark[]): boolean {
  return [LEFT_SHOULDER, RIGHT_SHOULDER, LEFT_HIP, RIGHT_HIP].every(
    (i) => (landmarks[i]?.visibility ?? 0) >= MIN_TORSO_VISIBILITY
  );
}

// Shoulder/hip frame used to align the garment: landmarks are normalized to
// [0,1] by MediaPipe regardless of the source image's actual resolution, so
// passing in the pixel dimensions of *whatever canvas the garment will be
// drawn from* gives coordinates that are already in that canvas's space.
function torsoFrame(landmarks: NormalizedLandmark[], width: number, height: number) {
  const leftShoulder = point(landmarks[LEFT_SHOULDER], width, height);
  const rightShoulder = point(landmarks[RIGHT_SHOULDER], width, height);
  const leftHip = point(landmarks[LEFT_HIP], width, height);
  const rightHip = point(landmarks[RIGHT_HIP], width, height);
  const shoulderMid = midpoint(leftShoulder, rightShoulder);
  const hipMid = midpoint(leftHip, rightHip);
  return {
    shoulderMid,
    shoulderWidth: distance(leftShoulder, rightShoulder),
    torsoHeight: distance(shoulderMid, hipMid),
    angle: Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x),
  };
}

export async function renderTryOn(customerImg: HTMLImageElement, productImg: HTMLImageElement): Promise<HTMLCanvasElement> {
  const pose = await getPoseLandmarker();

  const customerLandmarks = pose.detect(customerImg).landmarks[0];
  if (!customerLandmarks || !hasConfidentTorso(customerLandmarks)) {
    throw new TryOnError("We couldn't detect a person in your photo. Use a full-body, front-facing photo.");
  }

  const productLandmarks = pose.detect(productImg).landmarks[0];
  if (!productLandmarks || !hasConfidentTorso(productLandmarks)) {
    throw new TryOnError("This product can't be previewed — no pose detected in the product photo.");
  }

  const mask = await segmentClothesMask(productImg);
  if (!mask) {
    throw new TryOnError("This product can't be previewed — no clothing detected in the product photo.");
  }
  const { maskData, maskWidth, maskHeight } = mask;

  const garmentCanvas = document.createElement('canvas');
  garmentCanvas.width = maskWidth;
  garmentCanvas.height = maskHeight;
  const garmentCtx = garmentCanvas.getContext('2d');
  if (!garmentCtx) throw new TryOnError('Canvas is not supported in this browser.');
  garmentCtx.drawImage(productImg, 0, 0, maskWidth, maskHeight);

  const garmentImage = garmentCtx.getImageData(0, 0, maskWidth, maskHeight);
  let clothesPixels = 0;
  for (let i = 0; i < maskData.length; i++) {
    if (maskData[i] === CLOTHES_CATEGORY) {
      clothesPixels++;
    } else {
      garmentImage.data[i * 4 + 3] = 0;
    }
  }

  if (clothesPixels < maskWidth * maskHeight * 0.01) {
    throw new TryOnError("This product can't be previewed — no clothing detected in the product photo.");
  }
  garmentCtx.putImageData(garmentImage, 0, 0);

  const productFrame = torsoFrame(productLandmarks, maskWidth, maskHeight);
  const customerFrame = torsoFrame(customerLandmarks, customerImg.naturalWidth, customerImg.naturalHeight);

  if (
    productFrame.shoulderWidth < 1 ||
    customerFrame.shoulderWidth < 1 ||
    productFrame.torsoHeight < 1 ||
    customerFrame.torsoHeight < 1
  ) {
    throw new TryOnError('Could not measure body proportions clearly. Try a clearer, front-facing photo.');
  }

  const scaleX = customerFrame.shoulderWidth / productFrame.shoulderWidth;
  const scaleY = customerFrame.torsoHeight / productFrame.torsoHeight;
  const angle = customerFrame.angle - productFrame.angle;

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = customerImg.naturalWidth;
  outputCanvas.height = customerImg.naturalHeight;
  const outputCtx = outputCanvas.getContext('2d');
  if (!outputCtx) throw new TryOnError('Canvas is not supported in this browser.');

  outputCtx.drawImage(customerImg, 0, 0);
  outputCtx.save();
  outputCtx.translate(customerFrame.shoulderMid.x, customerFrame.shoulderMid.y);
  outputCtx.rotate(angle);
  outputCtx.scale(scaleX, scaleY);
  outputCtx.translate(-productFrame.shoulderMid.x, -productFrame.shoulderMid.y);
  outputCtx.drawImage(garmentCanvas, 0, 0);
  outputCtx.restore();

  return outputCanvas;
}
