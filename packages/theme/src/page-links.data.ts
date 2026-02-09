import { createPageLinksLoader } from '@velonor/engine/loader';
import type { PageLinks } from '@velonor/engine/loader';

// VitePress injects `data` at build/dev time; this is for TS typing.
export const data = null as unknown as PageLinks;

export default createPageLinksLoader(['**/*.md']);
