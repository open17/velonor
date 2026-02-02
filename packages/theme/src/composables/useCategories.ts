import { createCategoriesStore } from 'vitepress-velonor/client';
// typed by src/types/posts-data.d.ts
import { data as posts } from '../posts.data.js';

export const useCategories = createCategoriesStore(posts);
