export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_PAGE_GROUP_SIZE = 5;
export const MAX_DISPLAYED_TAGS = 20;

export const LOCALIZED_STRINGS = {

  'zh-CN': {
    prev: '上一页',
    next: '下一页',
    all: '全部',
    posts: '文章',
    tags: '标签',
    category: '分类',
    other: '其他',
    archive: '归档',
    more: '更多',
    backToBlog: '博客首页',
    details: '详情',
    activity: '更新状态',
    switchToNormalPage: '切换到普通页面',
    switchToPostPage: '切换到文章页面',
  },
  en: {
    prev: 'Prev',
    next: 'Next',
    all: 'All',
    posts: 'POSTS',
    tags: 'TAGS',
    category: 'Category',
    other: 'Other',
    archive: 'Archive',
    more: 'More',
    backToBlog: 'Back to Blog',
    details: 'Details',
    activity: 'Activity',
    switchToNormalPage: 'Switch to Normal Page',
    switchToPostPage: 'Switch to Post Page',
  },
} as const;

export type SupportedLanguage = keyof typeof LOCALIZED_STRINGS;

const normalizeLang = (lang?: string): SupportedLanguage => {
  if (!lang) return 'en';
  const lower = lang.toLowerCase();
  if (lower.startsWith('zh')) return 'zh-CN';
  if (lower.startsWith('en')) return 'en';
  return 'en';
};

export function getLocalizedString(
  key: keyof typeof LOCALIZED_STRINGS['en'],
  lang?: string
): string {
  const language = normalizeLang(lang);
  return LOCALIZED_STRINGS[language]?.[key] || LOCALIZED_STRINGS.en[key];
}
