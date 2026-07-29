// Server component wrapper — generateStaticParams must be a server export.
import { tailors } from '@/data/tailors';
import TailorDetailClient from './TailorDetailClient';

// Pre-renders a static HTML page for every tailor in the data array.
export function generateStaticParams() {
  return tailors.map((tailor) => ({ id: tailor.id }));
}

export default function TailorPage({ params }: { params: Promise<{ id: string }> }) {
  return <TailorDetailClient params={params} />;
}
