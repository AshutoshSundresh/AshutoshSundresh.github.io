"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useAppOverlayState from '../hooks/useAppOverlayState';
import type { SkeumorphicDataRoot, SearchRecord } from '../types';
import { Search, X } from 'lucide-react';
import skeuData from '../data/skeumorphicData.json';
import useSearchIndex from '../hooks/useSearchIndex';
import useDebouncedValue from '../hooks/useDebouncedValue';

function highlight(text: string, query: string, acronymMappings?: Map<string, string[]>): string {
  if (!query) return text;
  
  let result = text;
  const lower = query.toLowerCase();
  
  // First, highlight acronym matches if they exist
  if (acronymMappings && acronymMappings.has(lower)) {
    const phrases = acronymMappings.get(lower) || [];
    for (const phrase of phrases) {
      const escaped = phrase.replace(/[.*+?^${}()|[\\\]]/g, '\\$&');
      const re = new RegExp(`(${escaped})`, 'ig');
      result = result.replace(re, '<mark>$1</mark>');
    }
  }
  
  // Then highlight direct matches
  const escaped = query.replace(/[.*+?^${}()|[\\\]]/g, '\\$&');
  const re = new RegExp(`(${escaped})`, 'ig');
  result = result.replace(re, '<mark>$1</mark>');
  
  return result;
}

function scoreRecord(rec: SearchRecord, q: string): number {
  const lower = q.toLowerCase();
  const inTitlePos = rec.titleLower.indexOf(lower);
  const inTextPos = rec.textLower.indexOf(lower);
  
  // Check for acronym matches
  const acronymMatch = rec.acronymMappings.has(lower);
  
  if (inTitlePos === -1 && inTextPos === -1 && !acronymMatch) return -Infinity;
  
  // Heavily deprioritize courses
  const isCourse = rec.titleLower.startsWith('course —');
  const coursePenalty = isCourse ? 2000 : 0;
  
  let score = 0;
  if (inTitlePos !== -1) score += 800 - inTitlePos;
  if (inTextPos !== -1) score += 600 - inTextPos;
  if (rec.textLower.startsWith(lower)) score += 150;
  if (rec.titleLower.startsWith(lower)) score += 200;
  
  // Boost score significantly for acronym matches
  if (acronymMatch) score += 750;
  
  return score - coursePenalty;
}

export default function SearchOverlay({ open, onClose, navigateInSkeumorphic }: { open: boolean; onClose: () => void; navigateInSkeumorphic?: (tabName: string) => void }) {
  const [query, setQuery] = useState('');
  const { loading, records } = useSearchIndex(open);
  const [results, setResults] = useState<SearchRecord[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debouncedQuery = useDebouncedValue(query, 120);
  const { setSearchActive } = useAppOverlayState();

  // Derive recommended tabs from JSON presence, in canonical order
  const recommendedTabs = useMemo(() => {
    const dataRoot = skeuData as unknown as SkeumorphicDataRoot;
    const items: Array<{ key: string; title: string }> = [];
    if (Array.isArray(dataRoot.experienceData) && dataRoot.experienceData.length)
      items.push({ key: 'experience', title: 'Experience' });
    if (Array.isArray(dataRoot.awardsData) && dataRoot.awardsData.length)
      items.push({ key: 'awards', title: 'Awards' });
    if (Array.isArray(dataRoot.educationData) && dataRoot.educationData.length)
      items.push({ key: 'education', title: 'Education' });
    if (Array.isArray(dataRoot.projects) && dataRoot.projects.length)
      items.push({ key: 'projects', title: 'Projects' });
    if (Array.isArray(dataRoot.publications) && dataRoot.publications.length)
      items.push({ key: 'publications', title: 'Publications' });
    if (Array.isArray(dataRoot.activitiesData) && dataRoot.activitiesData.length)
      items.push({ key: 'activities', title: 'Activities' });
    return items;
  }, []);

  // Keep focus behavior consistent across pages
  useEffect(() => {
    if (open && !loading) setTimeout(() => inputRef.current?.focus(), 0);
    if (setSearchActive) setSearchActive(open);
  }, [open, loading, setSearchActive]);

  // Focus when opening
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(t);
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  // Search against built index
  useEffect(() => {
    if (!records) return;
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    const lower = debouncedQuery.toLowerCase();
    const escapedLower = lower.replace(/[.*+?^${}()|[\\\]]/g, '\\$&');
    const wordBoundary = new RegExp(`(^|\\b)${escapedLower}(\\b|$)`);
    const groups = { exactWord: [] as SearchRecord[], exactPrefix: [] as SearchRecord[], other: [] as SearchRecord[] };
    const scored = records
      .map((r) => ({ r, s: scoreRecord(r, lower) }))
      .filter((x) => x.s !== -Infinity);

    for (const { r } of scored) {
      const inTitleWord = wordBoundary.test(r.titleLower);
      const inTextWord = wordBoundary.test(r.textLower);
      const titleStarts = r.titleLower.startsWith(lower);
      const textStarts = r.textLower.startsWith(lower);
      const acronymMatch = r.acronymMappings.has(lower);
      
      if (inTitleWord || inTextWord || acronymMatch) groups.exactWord.push(r);
      else if (titleStarts || textStarts) groups.exactPrefix.push(r);
      else groups.other.push(r);
    }

    const byScoreDesc = (a: SearchRecord, b: SearchRecord) => scoreRecord(b, lower) - scoreRecord(a, lower);
    const merged = [
      ...groups.exactWord.sort(byScoreDesc),
      ...groups.exactPrefix.sort(byScoreDesc),
      ...groups.other.sort(byScoreDesc),
    ].slice(0, 20);
    setResults(merged);
  }, [debouncedQuery, records]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  const handleSelect = useCallback(
    (path: string) => {
      // If result targets the skeumorphic page and we have an in-component navigator, switch tabs without reload
      try {
        const url = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'https://local');
        if (url.pathname === '/experience') {
          const tab = url.searchParams.get('tab');
          if (tab && navigateInSkeumorphic) {
            navigateInSkeumorphic(tab);
            onClose();
            return;
          }
        }
      } catch {
        // ignore URL parse errors and fall through to default
      }

      onClose();
      // Same-page hash navigation for smoother UX
      const [pathname, hash] = path.split('#');
      if (pathname === '/') {
        if (hash) {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        }
      }
      window.location.href = path;
    },
    [onClose, navigateInSkeumorphic]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-8 md:pt-24 bg-black/30 dark:bg-black/70 backdrop-blur-lg" onClick={onClose}>
      <div
        className="w-full max-w-2xl px-4"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={`rounded-2xl bg-white/80 dark:bg-dark-secondary backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:ring-dark-border-primary ${loading ? 'opacity-60' : ''}`}>
          <div className="flex items-center gap-2 px-4 py-3">
            <Search className="h-5 w-5 text-gray-500 dark:text-dark-tertiary" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search..."
              disabled={loading}
              aria-disabled={loading}
              className={`w-full bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-dark-tertiary text-gray-900 dark:text-dark-primary text-base ${loading ? 'cursor-not-allowed' : ''}`}
            />
            <button
              aria-label={query ? 'Clear search' : 'Close search'}
              onClick={() => {
                if (query) {
                  setQuery('');
                  inputRef.current?.focus();
                } else {
                  onClose();
                }
              }}
              className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-dark-secondary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {query && results.length > 0 && (
          <div className="mt-3 rounded-2xl bg-white/80 dark:bg-dark-secondary backdrop-blur-xl shadow-xl ring-1 ring-black/5 dark:ring-dark-border-primary overflow-hidden">
            <ul className="max-h-[60vh] overflow-auto">
              {results.map((r) => (
                <li key={r.id} className="border-b border-black/5 dark:border-dark-border-secondary last:border-0">
                  <button
                    onClick={() => handleSelect(r.path)}
                    className="w-full text-left px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <div className="text-sm text-gray-600 dark:text-dark-tertiary line-clamp-1">{r.title}</div>
                    <div
                      className="text-gray-900 dark:text-dark-primary text-base"
                      dangerouslySetInnerHTML={{ __html: highlight(r.text, query, r.acronymMappings) }}
                    />
                    <div className="text-xs text-gray-500 dark:text-dark-tertiary mt-1">{r.path}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <div className="mt-3 rounded-2xl bg-white/80 dark:bg-dark-secondary backdrop-blur-xl shadow-xl ring-1 ring-black/5 dark:ring-dark-border-primary px-4 py-6 text-gray-600 dark:text-dark-secondary">
            No results.
          </div>
        )}

        {!query && !loading && (
          <div className="mt-2 rounded-2xl bg-white/70 dark:bg-dark-secondary dark:opacity-70 backdrop-blur-xl shadow-xl ring-1 ring-black/5 dark:ring-dark-border-primary overflow-hidden">
            <div className="px-4 py-3 text-xs text-gray-500 dark:text-dark-tertiary">Recommended</div>
            <div className="grid grid-cols-1 gap-0.5 p-1">
              {recommendedTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleSelect(`/experience?tab=${t.key}`)}
                  className="text-left px-3 py-1 rounded-lg text-gray-600 dark:text-dark-secondary hover:text-gray-900 dark:hover:text-dark-primary hover:bg-black/5 dark:hover:bg-white/5 text-sm"
                >
                  {t.title}
                </button>
              ))}
            </div>
            <div className="pb-1"></div>
          </div>
        )}
      </div>
    </div>
  );
}


