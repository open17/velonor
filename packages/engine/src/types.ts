export interface BlogFrontmatter {
  title?: string;
  date?: string | Date;
  tags?: string[];
  category?: string;
  author?: string;
  desc?: string;
  cover?: string;
  pin?: boolean;
  draft?: boolean;
  hidden?: boolean;
  publish?: boolean;
  [key: string]: any;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  excerpt?: string;
  url: string;
  html?: string;
}
