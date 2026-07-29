// Server component wrapper — generateStaticParams must be a server export.
import CollectionClient from './CollectionClient';

// All valid collection slugs used throughout the codebase (numeric IDs from
// CollectionsGrid, named slugs from Navbar/Footer/banners). Any slug not listed
// here will fall back to the FALLBACK config inside CollectionClient.
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: 'sherwanis' },
    { id: 'indo-western' },
    { id: 'kurtas' },
    { id: 'blazers' },
    { id: 'waistcoat' },
    { id: 'festive' },
    { id: 'groom' },
    { id: 'accessories' },
  ];
}

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  return <CollectionClient params={params} />;
}
