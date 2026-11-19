/**
 * Hook that points Cmd/Ctrl+F at the site's own search instead of the
 * browser's find-in-page. Find-in-page only ever matched the tab currently
 * rendered, so it missed most of the site; the search index covers all of it.
 *
 * Listens in the capture phase so it wins over any component-level keydown
 * handler (the terminal's, for instance). While the overlay is already open
 * the event is swallowed rather than re-opened, so the native find bar never
 * appears over it and focus stays in the search input.
 *
 * Escape closes the overlay, and the browser's Edit > Find menu item still
 * reaches native find for anyone who wants it.
 */

import { useEffect } from 'react';

export function useSearchHotkey(onOpen: () => void, isOpen = false) {
  useEffect(() => {
    const handleHotkey = (e: KeyboardEvent) => {
      if (e.key !== 'f' && e.key !== 'F') return;
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;

      e.preventDefault();
      if (!isOpen) onOpen();
    };

    document.addEventListener('keydown', handleHotkey, true);
    return () => document.removeEventListener('keydown', handleHotkey, true);
  }, [onOpen, isOpen]);
}
