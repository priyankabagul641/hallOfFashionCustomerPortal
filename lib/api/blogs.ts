import { apiGet, ApiResponse } from "@/lib/api-client";

export interface PublicBlog {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  tags: string[] | null;
  thumbnailUrl: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  readTime: number | null;
  featured: boolean;
  publishedAt: string;
  authorName: string;
}

export interface PublicBlogDetail extends PublicBlog {
  content: string;
  views: number;
}

export function getPublicBlogs() {
  return apiGet<{ blogs: PublicBlog[] }>("/cms/blogs/public");
}

export function getPublicBlogBySlug(slug: string) {
  return apiGet<PublicBlogDetail>(`/cms/blogs/public/${slug}`);
}

export type { ApiResponse };
