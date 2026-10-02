import { useEffect, useRef, useState } from 'react';

/**
 * True while a panel that scrolls inside itself still holds rows below the
 * last one in view. It is measured again after every render, because a list
 * can change its rows without changing its own size.
 */
export function useMoreBelow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const measure = () =>
      setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 1);
    // An observer reports once as soon as it starts watching.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener('scroll', measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', measure);
    };
  });

  return [ref, more] as const;
}
