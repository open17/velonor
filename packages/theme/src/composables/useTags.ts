import { createTagsStore } from '@velonor/engine/client';
// typed by src/types/posts-data.d.ts
import { data as posts } from '../posts.data.js';

export const useTags = createTagsStore(posts);

