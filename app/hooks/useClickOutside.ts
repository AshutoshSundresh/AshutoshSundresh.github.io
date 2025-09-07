import { useEffect } from 'react';

type MaybeArray<T> = T | T[];

export default function useClickOutside(
  refs: MaybeArray<React.RefObject<HTMLElement | null>>,
  handler: (event: MouseEvent) => void
) {
  useEffect(() => {
    const refArray = Array.isArray(refs) ? refs : [refs];

    const listener = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedInside = refArray.some((r) => {
        const el = r.current;
        return el ? el.contains(target) : false;
      });

      if (!clickedInside) handler(event);
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [refs, handler]);
}


