/**
 * Two-layer cache for the Last.fm / Deezer lookups behind the music card.
 *
 * In-memory first, so reopening the popup or flipping the period costs nothing
 * in the same session; localStorage behind it, so a return visit skips the
 * network entirely until the entry expires. Every storage access is guarded —
 * Safari private mode throws on setItem, and a viewer with site data blocked
 * should still get a working card, just without the persistence.
 *
 * Keys carry a version so a shape change invalidates old entries rather than
 * deserialising them into something the caller no longer understands.
 */

const VERSION = 'v1';
const PREFIX = `lfm:${VERSION}:`;

const memory = new Map<string, { value: unknown; expiresAt: number }>();

export const DAY = 24 * 60 * 60 * 1000;

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readCache<T>(key: string): T | null {
  const full = PREFIX + key;
  const now = Date.now();

  const hit = memory.get(full);
  if (hit) {
    if (hit.expiresAt > now) return hit.value as T;
    memory.delete(full);
  }

  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(full);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { value: T; expiresAt: number };
    if (!parsed || parsed.expiresAt <= now) {
      store.removeItem(full);
      return null;
    }
    // Promote into memory so repeat reads in this session skip JSON.parse.
    memory.set(full, { value: parsed.value, expiresAt: parsed.expiresAt });
    return parsed.value;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T, ttlMs: number): void {
  const full = PREFIX + key;
  const expiresAt = Date.now() + ttlMs;
  memory.set(full, { value, expiresAt });

  const store = storage();
  if (!store) return;
  try {
    store.setItem(full, JSON.stringify({ value, expiresAt }));
  } catch {
    // Quota exceeded or writes blocked: drop this generation's entries and
    // carry on from memory rather than letting the card fail.
    try {
      for (let i = store.length - 1; i >= 0; i -= 1) {
        const k = store.key(i);
        if (k && k.startsWith(PREFIX)) store.removeItem(k);
      }
      store.setItem(full, JSON.stringify({ value, expiresAt }));
    } catch {
      /* stay with the in-memory copy */
    }
  }
}
