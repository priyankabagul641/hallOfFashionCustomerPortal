import { getAllProducts } from '@/lib/api/products';
import ProductDetailClient from './ProductDetailClient';

// Static export (output: 'export') requires every dynamic path known at
// build time — fetch the live product list from the backend so each active
// product gets a pre-rendered page. New products only appear after the next
// build/deploy.
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((product) => ({ id: product.id }));
  } catch {
    return [];
  }
}

export default function ProductPage() {
  return <ProductDetailClient />;
}
