import { createArchiveLoader } from '@velonor/engine/loader';
import type { ArchiveIndex } from '@velonor/engine/loader';

// VitePress injects `data` at build/dev time; this is for TS typing.
export const data = null as unknown as ArchiveIndex;

export default createArchiveLoader('posts/**/*.md');
