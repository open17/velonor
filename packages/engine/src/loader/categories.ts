import { createContentLoader } from 'vitepress';
import { normalizePosts } from '../post-helpers';
import type { BlogPost } from '../types';

export interface CategoriesIndex {
  categoriesMap: Record<string, number>;
  categoryArray: [string, number][];
  uniqueCategoryCount: number;
  totalPosts: number;
}

const extractCategoryFromUrl = (url: string, otherLabel: string): string => {
  const match = url.match(/^\/posts\/([^/]+)\//);
  if (match && match[1]) return match[1];
  if (url.startsWith('/posts/') && /^\/posts\/[^/]+(\.html)?$/.test(url)) {
    return otherLabel;
  }
  return '';
};

export const createCategoriesLoader = (
  pattern = 'posts/**/*.md',
  options?: { otherLabel?: string }
) =>
  createContentLoader(pattern, {
    includeSrc: false,
    render: false,
    excerpt: true,
    transform(rawData) {
      const otherLabel = options?.otherLabel || 'Other';
      const posts = normalizePosts(rawData) as BlogPost[];
      const categoriesMap: Record<string, number> = { '': posts.length };

      posts.forEach((post) => {
        const fmCategory = post.frontmatter?.category as string | undefined;
        const category = fmCategory || extractCategoryFromUrl(post.url, otherLabel);
        if (category) {
          categoriesMap[category] = (categoriesMap[category] || 0) + 1;
        }
      });

      const categoryArray = Object.entries(categoriesMap).sort((a, b) => {
        if (a[0] === '') return -1;
        if (b[0] === '') return 1;
        return (b[1] as number) - (a[1] as number);
      }) as [string, number][];

      const uniqueCategoryCount = Object.keys(categoriesMap).filter(Boolean).length;
      const totalPosts = categoriesMap[''] || posts.length;

      return {
        categoriesMap,
        categoryArray,
        uniqueCategoryCount,
        totalPosts,
      } as CategoriesIndex;
    },
  });
