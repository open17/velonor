import { createContentLoader } from 'vitepress';
import { normalizePosts } from '../post-helpers';
import type { BlogPost } from '../types';

export interface TagsIndex {
  tagsMap: Record<string, number>;
  tagArray: [string, number][];
  uniqueTagCount: number;
  totalPosts: number;
}

export const createTagsLoader = (pattern = 'posts/**/*.md') =>
  createContentLoader(pattern, {
    includeSrc: false,
    render: false,
    excerpt: true,
    transform(rawData) {
      const posts = normalizePosts(rawData) as BlogPost[];
      const tagsMap: Record<string, number> = { '': posts.length };
      posts.forEach((post) => {
        const tags = post.frontmatter.tags as string[] | undefined;
        if (!tags) return;
        tags.forEach((tag) => {
          tagsMap[tag] = (tagsMap[tag] || 0) + 1;
        });
      });

      const tagArray = Object.entries(tagsMap).sort(
        (a, b) => (b[1] as number) - (a[1] as number)
      ) as [string, number][];

      const uniqueTagCount = Object.keys(tagsMap).filter(Boolean).length;
      const totalPosts = tagsMap[''] || posts.length;

      return { tagsMap, tagArray, uniqueTagCount, totalPosts } as TagsIndex;
    },
  });
