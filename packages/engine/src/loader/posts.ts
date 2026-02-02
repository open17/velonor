import { createContentLoader } from 'vitepress';
import { normalizePosts } from '../post-helpers';

export const createPostsLoader = (pattern = 'posts/**/*.md') =>
  createContentLoader(pattern, {
    includeSrc: false,
    render: false,
    excerpt: true,
    transform(rawData) {
      return normalizePosts(rawData);
    },
  });
