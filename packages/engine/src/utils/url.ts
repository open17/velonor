const isClient = typeof window !== 'undefined';

export const getQueryParam = (key: string): string | null => {
  if (!isClient) return null;
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
};

export const setQueryParam = (
  key: string,
  value: string | null,
  options?: { replace?: boolean }
): void => {
  if (!isClient) return;
  const url = new URL(window.location.href);
  if (value === null || value === '') {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  const replace = options?.replace ?? true;
  if (replace) {
    window.history.replaceState(null, '', url.toString());
  } else {
    window.history.pushState(null, '', url.toString());
  }
};
