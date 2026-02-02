import { createContentLoader } from 'vitepress';
import { normalizePosts } from '../post-helpers';
import { parseDateValue } from '../utils/date';
import type { BlogPost } from '../types';

export interface ArchiveMonthGroup {
  month: number;
  monthName: string;
  posts: BlogPost[];
}

export interface ArchiveYearGroup {
  year: number;
  months: ArchiveMonthGroup[];
  total: number;
}

export interface ArchiveIndex {
  yearGroups: ArchiveYearGroup[];
  totalPosts: number;
}

export const createArchiveLoader = (pattern = 'posts/**/*.md') =>
  createContentLoader(pattern, {
    includeSrc: false,
    render: false,
    excerpt: true,
    transform(rawData) {
      const posts = normalizePosts(rawData) as BlogPost[];
      const sortedPosts = [...posts].sort(
        (a, b) => parseDateValue(b.frontmatter.date) - parseDateValue(a.frontmatter.date)
      );

      const yearMap = new Map<number, Map<number, ArchiveMonthGroup>>();
      sortedPosts.forEach((post) => {
        const time = parseDateValue(post.frontmatter.date);
        const date = new Date(time || 0);
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthName = date.toLocaleString('default', { month: 'long' });

        if (!yearMap.has(year)) yearMap.set(year, new Map());
        const monthMap = yearMap.get(year)!;
        if (!monthMap.has(month)) {
          monthMap.set(month, { month, monthName, posts: [] });
        }
        monthMap.get(month)!.posts.push(post);
      });

      const yearGroups: ArchiveYearGroup[] = Array.from(yearMap.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([year, monthMap]) => {
          const months = Array.from(monthMap.values()).sort((a, b) => b.month - a.month);
          const total = months.reduce((sum, m) => sum + m.posts.length, 0);
          return { year, months, total };
        });

      return { yearGroups, totalPosts: sortedPosts.length } as ArchiveIndex;
    },
  });
