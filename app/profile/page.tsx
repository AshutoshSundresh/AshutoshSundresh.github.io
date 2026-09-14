import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildProfileLines } from "@/app/lib/profileDocument";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Ashutosh Sundresh — Profile for LLMs",
  description:
    "The same profile served at /llms.txt, rendered as HTML for tools that only parse text/html.",
  alternates: {
    canonical: "https://ashutoshsundresh.com/profile",
    types: { "text/plain": "https://ashutoshsundresh.com/llms.txt" },
  },
};

/**
 * The generator emits a fixed, known set of line shapes, so a small parser
 * beats pulling in a Markdown dependency. Handles `**bold**` and `[text](url)`.
 */
function renderInline(text: string, key: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let i = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(
        <a
          key={`${key}-${i}`}
          href={match[2]}
          className="text-blue-600 underline underline-offset-2 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {match[1]}
        </a>
      );
    } else {
      nodes.push(
        <strong key={`${key}-${i}`} className="font-semibold text-gray-900 dark:text-gray-100">
          {match[3]}
        </strong>
      );
    }
    last = match.index + match[0].length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderBlocks(lines: string[]): ReactNode[] {
  const out: ReactNode[] = [];
  let items: { text: string; nested: boolean }[] = [];

  const flush = () => {
    if (!items.length) return;
    const key = `ul-${out.length}`;
    out.push(
      <ul key={key} className="my-3 space-y-1.5">
        {items.map((item, i) => (
          <li
            key={`${key}-${i}`}
            className={`text-[0.95rem] leading-relaxed text-gray-700 dark:text-gray-300 ${
              item.nested ? "ml-6 list-[circle] list-outside" : "ml-4 list-disc list-outside"
            }`}
          >
            {renderInline(item.text, `${key}-${i}`)}
          </li>
        ))}
      </ul>
    );
    items = [];
  };

  lines.forEach((line, idx) => {
    if (!line.trim()) {
      flush();
      return;
    }
    if (line.startsWith("### ")) {
      flush();
      out.push(
        <h3 key={idx} className="mt-7 text-[1.05rem] font-semibold text-gray-900 dark:text-gray-100">
          {renderInline(line.slice(4), `h3-${idx}`)}
        </h3>
      );
      return;
    }
    if (line.startsWith("## ")) {
      flush();
      out.push(
        <h2
          key={idx}
          className="mt-10 border-b border-black/[0.08] pb-2 text-[1.3rem] font-semibold text-gray-900 dark:border-white/[0.09] dark:text-gray-100"
        >
          {renderInline(line.slice(3), `h2-${idx}`)}
        </h2>
      );
      return;
    }
    if (line.startsWith("# ")) {
      flush();
      out.push(
        <h1 key={idx} className="text-[2rem] font-bold text-gray-900 dark:text-gray-100">
          {renderInline(line.slice(2), `h1-${idx}`)}
        </h1>
      );
      return;
    }
    if (line.startsWith("> ")) {
      flush();
      out.push(
        <blockquote
          key={idx}
          className="my-4 border-l-2 border-blue-500/60 pl-4 text-[1rem] leading-relaxed text-gray-600 dark:text-gray-400"
        >
          {renderInline(line.slice(2), `bq-${idx}`)}
        </blockquote>
      );
      return;
    }
    if (line.startsWith("  - ")) {
      items.push({ text: line.slice(4), nested: true });
      return;
    }
    if (line.startsWith("- ")) {
      items.push({ text: line.slice(2), nested: false });
      return;
    }
    flush();
    out.push(
      <p key={idx} className="my-3 text-[0.95rem] leading-relaxed text-gray-700 dark:text-gray-300">
        {renderInline(line, `p-${idx}`)}
      </p>
    );
  });

  flush();
  return out;
}

/**
 * HTML twin of /llms.txt. Many crawlers and agent browsers run an HTML
 * extractor over whatever they fetch and return nothing for `text/plain`,
 * so the same content is served here as markup. Both render from
 * buildProfileLines(), so they cannot drift apart.
 *
 * Deliberately NOT at /llms: `output: "export"` writes a page's RSC payload
 * to out/<route>.txt, so a page at /llms emits out/llms.txt and silently
 * overwrites the route handler that serves the real plaintext profile.
 */
export default function LlmsPage() {
  const lines = buildProfileLines();

  // The bottom padding clears the globally fixed nav dock, which would
  // otherwise sit on top of the last few lines.
  return (
    <main className="min-h-screen bg-white px-5 pt-12 pb-36 text-gray-800 dark:bg-[#111214] dark:text-gray-200">
      <article className="mx-auto w-full max-w-3xl">
        {renderBlocks(lines)}
        <hr className="my-10 border-black/[0.08] dark:border-white/[0.09]" />
        <p className="text-[0.85rem] text-gray-500 dark:text-gray-500">
          The same content is available as plain text at{" "}
          <a
            href="/llms.txt"
            className="text-blue-600 underline underline-offset-2 dark:text-blue-400"
          >
            /llms.txt
          </a>
          .
        </p>
      </article>
    </main>
  );
}
