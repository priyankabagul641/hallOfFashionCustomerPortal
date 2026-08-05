import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns `src` if it is safe to pass to next/image (root-relative path or
 * absolute http(s) URL), otherwise falls back to `/placeholder.jpg`.
 * Guards against malformed backend-supplied image values (e.g. "wintwer").
 */
export function safeImageSrc(
  src: string | null | undefined,
  fallback = '/placeholder.jpg',
): string {
  if (!src) return fallback
  if (src.startsWith('/')) return src
  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:' ? src : fallback
  } catch {
    return fallback
  }
}
