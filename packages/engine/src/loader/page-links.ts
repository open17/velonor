import { createContentLoader } from 'vitepress';

export interface PageLinks {
  tags?: string;
  categories?: string;
  archive?: string;
  blog?: string;
}

export const createPageLinksLoader = (patterns: string[] = ['**/*.md']) =>
  createContentLoader(patterns, {
    includeSrc: false,
    transform(pages) {
      const links: PageLinks = {};
      for (const page of pages) {
        const layout = (page.frontmatter as any)?.layout;
        if (!links.blog && layout === 'blog') links.blog = page.url;
        if (!links.tags && layout === 'tags') links.tags = page.url;
        if (!links.categories && layout === 'categories') links.categories = page.url;
        if (!links.archive && layout === 'archive') links.archive = page.url;
      }
      return links;
    },
  });
