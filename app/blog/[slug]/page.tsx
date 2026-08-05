// Server component wrapper — slug identifies a published blog post.
// No static params: blogs are admin-created and dynamic.
import BlogClient from './BlogClient';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogClient params={params} />;
}
