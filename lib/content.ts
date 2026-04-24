import { promises as fs } from "node:fs";
import path from "node:path";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  wordCount: number;
  readingMinutes: number;
};

type ImportedMdx = {
  default: React.ComponentType;
  metadata: { title: string; date: string; summary?: string };
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(POSTS_DIR);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

async function readRaw(slug: string) {
  return fs.readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf-8");
}

function stripMdx(raw: string) {
  return raw
    .replace(/^export const metadata[\s\S]*?^};\s*$/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>~`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function readingStats(slug: string) {
  const raw = await readRaw(slug);
  const text = stripMdx(raw);
  const wordCount = text ? text.split(/\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.round(wordCount / 220));
  return { wordCount, readingMinutes };
}

export async function getPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();
  const loaded = await Promise.all(
    slugs.map(async (slug) => {
      const mod = (await import(
        `@/content/posts/${slug}.mdx`
      )) as ImportedMdx;
      const stats = await readingStats(slug);
      return {
        slug,
        title: mod.metadata.title,
        date: mod.metadata.date,
        summary: mod.metadata.summary,
        ...stats,
      } satisfies PostMeta;
    }),
  );
  return loaded.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function formatShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatLongDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
