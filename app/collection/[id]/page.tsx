// Server component wrapper — id is a real collection UUID, passed through
// as-is. No static params: collections are admin-created and dynamic.
import CollectionClient from './CollectionClient';

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  return <CollectionClient params={params} />;
}
