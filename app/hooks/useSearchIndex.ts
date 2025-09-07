'use client';

import { useEffect, useState } from 'react';
import type { SearchRecord, SkeumorphicDataRoot, EducationGrade } from '../types';
import skeuData from '../data/skeumorphicData.json';

let INDEX_CACHE: SearchRecord[] | null = null;

function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

function getClosestAnchorId(element: Element | null): string | null {
  let el: Element | null = element;
  while (el) {
    const id = (el as HTMLElement).id;
    if (id) return id;
    el = el.parentElement;
  }
  return null;
}

function extractTitleFor(element: Element, doc: Document): string {
  let el: Element | null = element;
  while (el) {
    const ds = (el as HTMLElement).dataset;
    const attr = ds?.searchTitle;
    if (typeof attr === 'string' && attr.trim().length > 0) return attr.trim();
    el = el.parentElement;
  }
  const heading = element.closest('section, article, main, div')?.querySelector('h1, h2, h3, h4');
  if (heading && heading.textContent) return heading.textContent.trim();
  return doc.title || 'Section';
}

function buildIndexFromDocument(doc: Document, basePath: string): SearchRecord[] {
  const records: SearchRecord[] = [];
  let counter = 0;
  const allTitled = Array.from(doc.querySelectorAll('[data-search-title]')) as HTMLElement[];
  const titledBlocks = allTitled.filter(el => !el.querySelector('[data-search-title]'));
  for (const block of titledBlocks) {
    const title = (block.dataset.searchTitle || '').trim() || 'Section';
    const text = normalizeWhitespace(block.textContent || '');
    if (text.length < 3) continue;
    const anchor = getClosestAnchorId(block);
    const path = anchor ? `${basePath}#${anchor}` : basePath;
    records.push({
      id: `${basePath}-ttl-${counter++}`,
      path,
      title,
      text: text.slice(0, 260),
      textLower: text.toLowerCase(),
      titleLower: title.toLowerCase(),
    });
  }
  const nodes = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, figcaption, summary, blockquote, a'));
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;
    if (node.closest('nav, footer, header, script, style')) continue;
    if (node.closest('[data-search-title]')) continue;
    if (node.tagName === 'A') {
      const blockAncestor = node.closest('p, li, blockquote, summary, figcaption, h1, h2, h3, h4, h5, h6');
      if (blockAncestor && blockAncestor !== node) {
        const parentText = normalizeWhitespace(blockAncestor.textContent || '');
        const childText = normalizeWhitespace(node.textContent || '');
        if (parentText.length > childText.length + 10) continue;
      }
    }
    const raw = node.textContent || '';
    const text = normalizeWhitespace(raw);
    if (text.length < 3) continue;
    const title = extractTitleFor(node, doc);
    const anchor = getClosestAnchorId(node);
    const path = anchor ? `${basePath}#${anchor}` : basePath;
    records.push({
      id: `${basePath}-${counter++}`,
      path,
      title,
      text: text.slice(0, 220),
      textLower: text.toLowerCase(),
      titleLower: title.toLowerCase(),
    });
  }
  return records;
}

async function fetchAndParse(path: string): Promise<Document | null> {
  try {
    const res = await fetch(path, { cache: 'force-cache' });
    const html = await res.text();
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  } catch {
    return null;
  }
}

function buildIndexFromSkeumorphic(): SearchRecord[] {
  const records: SearchRecord[] = [];
  let counter = 0;
  try {
    const tabs: Record<string, string> = {
      projects: '/experience?tab=projects',
      education: '/experience?tab=education',
      experience: '/experience?tab=experience',
      awards: '/experience?tab=awards',
      publications: '/experience?tab=publications',
      activities: '/experience?tab=activities',
    };
    const dataRoot = skeuData as unknown as SkeumorphicDataRoot;
    if (Array.isArray(dataRoot.projects)) {
      for (const p of dataRoot.projects) {
        const title = `Project — ${p.name}`;
        const text = normalizeWhitespace([p.caption, p.description].filter(Boolean).join(' '));
        records.push({ id: `skeu-p-${counter++}`, path: tabs.projects, title, text: text.slice(0, 260), textLower: text.toLowerCase(), titleLower: title.toLowerCase() });
      }
    }
    if (Array.isArray(dataRoot.educationData)) {
      for (const e of dataRoot.educationData) {
        const title = `Education — ${e.institution || ''} ${e.degree || ''}`.trim();
        const details: string[] = [];
        if (e.details?.coursework) details.push(...e.details.coursework);
        if (e.details?.achievements) details.push(...e.details.achievements);
        if (e.details?.subjects) details.push(...e.details.subjects);
        if (e.details?.grades) details.push(...e.details.grades.map((g: EducationGrade) => `${g.grade}: ${g.score}`));
        const core = [e.period, e.school, e.location, ...details].filter(Boolean).join(' ');
        const text = normalizeWhitespace(core);
        records.push({ id: `skeu-e-${counter++}`, path: tabs.education, title, text: text.slice(0, 260), textLower: text.toLowerCase(), titleLower: title.toLowerCase() });
      }
    }
    if (Array.isArray(dataRoot.experienceData)) {
      for (const x of dataRoot.experienceData) {
        const title = `Experience — ${x.company} • ${x.position}`;
        const text = normalizeWhitespace([x.location, x.period, ...(x.description || [])].filter(Boolean).join(' '));
        records.push({ id: `skeu-x-${counter++}`, path: tabs.experience, title, text: text.slice(0, 260), textLower: text.toLowerCase(), titleLower: title.toLowerCase() });
      }
    }
    if (Array.isArray(dataRoot.awardsData)) {
      for (const cat of dataRoot.awardsData) {
        for (const a of cat.awards || []) {
          const title = `Award — ${a.title}`;
          const text = normalizeWhitespace([cat.category, a.subtitle, a.year, a.description, a.highlight, a.stats].filter(Boolean).join(' '));
          records.push({ id: `skeu-a-${counter++}`, path: tabs.awards, title, text: text.slice(0, 260), textLower: text.toLowerCase(), titleLower: title.toLowerCase() });
        }
      }
    }
    if (Array.isArray(dataRoot.publications)) {
      for (const p of dataRoot.publications) {
        const title = `Publication — ${p.title}`;
        const text = normalizeWhitespace([p.subtitle, p.journal, p.abstract, (p.authors || []).join(', ')].filter(Boolean).join(' '));
        records.push({ id: `skeu-pub-${counter++}`, path: tabs.publications, title, text: text.slice(0, 260), textLower: text.toLowerCase(), titleLower: title.toLowerCase() });
      }
    }
    if (Array.isArray(dataRoot.activitiesData)) {
      for (const act of dataRoot.activitiesData) {
        const title = `Activity — ${act.title}`;
        const text = normalizeWhitespace([act.period, act.description, ...(act.highlights || []).map(String)].filter(Boolean).join(' '));
        records.push({ id: `skeu-act-${counter++}`, path: tabs.activities, title, text: text.slice(0, 260), textLower: text.toLowerCase(), titleLower: title.toLowerCase() });
      }
    }
  } catch {}
  return records;
}

export default function useSearchIndex(open: boolean) {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<SearchRecord[] | null>(null);

  useEffect(() => {
    if (!open) return;
    if (records) return;
    if (INDEX_CACHE) {
      setRecords(INDEX_CACHE);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const index: SearchRecord[] = [];
      index.push(...buildIndexFromSkeumorphic());
      const homeDoc = await fetchAndParse('/');
      if (homeDoc) index.push(...buildIndexFromDocument(homeDoc, '/'));
      const hrefs = new Set<string>();
      (homeDoc || document).querySelectorAll('a[href^="/"]').forEach((a) => {
        const href = (a as HTMLAnchorElement).getAttribute('href') || '/';
        const clean = href.split('#')[0];
        if (clean && clean !== '/' && !clean.startsWith('/api') && clean !== '/experience') hrefs.add(clean);
      });
      const unique = Array.from(hrefs).slice(0, 6);
      const docs = await Promise.all(unique.map((p) => fetchAndParse(p)));
      docs.forEach((doc, i) => { if (doc) index.push(...buildIndexFromDocument(doc, unique[i])); });
      if (!cancelled) {
        INDEX_CACHE = index;
        setRecords(index);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, records]);

  return { loading, records };
}


