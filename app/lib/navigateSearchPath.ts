'use client';

/**
 * Same routing rules as {@link SearchOverlay} result selection: in-situ experience tabs,
 * same-page hash scroll on `/`, otherwise full navigation.
 */
export function navigateFromSearchPath(
  path: string,
  options?: {
    navigateInSkeumorphic?: (tabName: string) => void;
    onClose?: () => void;
  }
) {
  if (typeof window === 'undefined') return;

  const { navigateInSkeumorphic, onClose } = options ?? {};

  try {
    const url = new URL(path, window.location.href);
    if (url.pathname === '/experience') {
      const tab = url.searchParams.get('tab');
      if (tab && navigateInSkeumorphic) {
        navigateInSkeumorphic(tab);
        onClose?.();
        return;
      }
    }
  } catch {
    // fall through
  }

  onClose?.();

  try {
    const url = new URL(path, window.location.href);
    if ((url.pathname === '/' || url.pathname === '') && url.hash.length > 1) {
      const id = decodeURIComponent(url.hash.slice(1));
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
  } catch {
    // fall through
  }

  window.location.assign(path);
}
