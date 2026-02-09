import { createCategoriesLoader } from '@velonor/engine/loader';
import type { CategoriesIndex } from '@velonor/engine/loader';

// VitePress injects `data` at build/dev time; this is for TS typing.
export const data = null as unknown as CategoriesIndex;

export default createCategoriesLoader('posts/**/*.md');
