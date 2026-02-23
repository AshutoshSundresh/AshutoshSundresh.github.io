/**
 * Blur placeholders for Next.js Image (placeholder="blur") for LQIP optimization.
 * Precomputed from actual images via scripts/generate-blur-placeholders.js.
 */
import blurPlaceholders from '../data/blurPlaceholders.json';

const BLUR_MAP: Record<string, string> = blurPlaceholders as Record<string, string>;

/** Fallback when no precomputed blur exists (e.g. remote images). */
export const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAM';

/** Returns precomputed blur data URL for the image src, or fallback. */
export function getBlurDataURL(src: string): string {
  return BLUR_MAP[src] ?? BLUR_DATA_URL;
}
