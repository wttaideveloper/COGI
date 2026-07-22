import { fetchFromStrapi } from '@/services/strapi'
import { fallbackBlogPosts } from '@/data/fallback'
import type { BlogPost } from '@/types'

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await fetchFromStrapi<{ data: BlogPost[] }>('/news-articles', {
    sort: 'publishedAt:desc',
  })
  return data?.data ?? fallbackBlogPosts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const data = await fetchFromStrapi<{ data: BlogPost[] }>('/news-articles', {
    'filters[slug][$eq]': slug,
  })
  if (data?.data?.[0]) return data.data[0]
  return fallbackBlogPosts.find((p) => p.slug === slug)
}
