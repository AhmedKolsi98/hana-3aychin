import { useEffect, useState } from 'react';

/** First path segment of a route: '/health/sun-uv-animals' → 'health'. */
const sectionOf = (r: string) => r.split('/')[1] ?? '';

/** Minimal hash router: every route stays reachable from / on static hosts. */
export function useHashRoute(): string {
  const read = () => {
    const h = window.location.hash.replace(/^#/, '');
    return h.startsWith('/') ? h : '/';
  };
  const [route, setRoute] = useState<string>(read);
  useEffect(() => {
    const on = () => {
      const next = read();
      setRoute((prev) => {
        // Scroll to top only when the page itself changes — article-anchor
        // navigation inside the same section keeps its own scroll target.
        if (sectionOf(prev) !== sectionOf(next)) {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }
        return next;
      });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function navigate(to: string) {
  window.location.hash = to;
}
