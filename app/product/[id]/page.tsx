// Server component wrapper — required so that generateStaticParams (a server-only
// export) can co-exist with the 'use client' ProductDetailClient component.
import { products } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

// Tells Next.js which /product/[id] paths to pre-render at build time.
// Every product in the static data array becomes a separate HTML file.
export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

// The actual UI is handled entirely in the client component via useParams().
export default function ProductPage() {
  return <ProductDetailClient />;
}
