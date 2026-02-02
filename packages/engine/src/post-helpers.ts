import type { BlogPost, BlogFrontmatter } from './types';
import { parseDateValue } from './utils/date';

const defaultFrontmatter: BlogFrontmatter = {
  title: 'Untitled',
  date: '1970-01-01',
};

const isHiddenPost = (frontmatter: BlogFrontmatter | undefined): boolean => {
  if (!frontmatter) return false;
  if (frontmatter.draft) return true;
  if (frontmatter.hidden) return true;
  if (frontmatter.publish === false) return true;
  return false;
};

const comparePosts = (a: BlogPost, b: BlogPost): number => {
  const pinA = Boolean(a.frontmatter.pin);
  const pinB = Boolean(b.frontmatter.pin);
  if (pinA !== pinB) return pinA ? -1 : 1;
  const dateA = parseDateValue(a.frontmatter.date);
  const dateB = parseDateValue(b.frontmatter.date);
  return dateB - dateA;
};

export const normalizePosts = (rawData: any[]): BlogPost[] => {
  return rawData
    .filter((page) => !isHiddenPost(page?.frontmatter))
    .map((page) => ({
      frontmatter: {
        ...defaultFrontmatter,
        ...(page?.frontmatter || {}),
      },
      excerpt: page?.excerpt,
      url: page?.url,
      html: page?.html,
    }))
    .sort(comparePosts);
};
