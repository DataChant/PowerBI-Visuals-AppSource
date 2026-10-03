import { useEffect, type RefObject } from 'react';

/**
 * While `active`, the rest of the page is inert: it cannot take focus and is
 * not read out, as the page behind a modal dialog. Only the elements this hook
 * made inert are released afterwards, so a dialog opened over another leaves
 * the first one's page inert when it closes.
 */
export function useInert(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    const made: Element[] = [];
    for (let node: Element = el; node.parentElement && node !== document.body; node = node.parentElement) {
      for (const sibling of Array.from(node.parentElement.children)) {
        if (sibling === node || sibling.hasAttribute('inert')) continue;
        sibling.setAttribute('inert', '');
        made.push(sibling);
      }
    }
    return () => {
      for (const sibling of made) sibling.removeAttribute('inert');
    };
  }, [ref, active]);
}
