import { createTagsLoader } from '@velonor/engine/loader';
import type { TagsIndex } from '@velonor/engine/loader';

// VitePress injects `data` at build/dev time; this is for TS typing.
export const data = null as unknown as TagsIndex;

export default createTagsLoader('posts/**/*.md');
