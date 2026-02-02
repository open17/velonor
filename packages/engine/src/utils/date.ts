export const parseDateValue = (value: unknown): number => {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  const time = Date.parse(String(value));
  return Number.isNaN(time) ? 0 : time;
};

export const formatDate = (value: unknown, locale?: string): string => {
  if (!value) return '';
  const date = new Date(value as any);
  if (Number.isNaN(date.getTime())) return String(value);
  const safeLocale = locale || 'en-US';
  return date.toLocaleDateString(safeLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
