import { promises as fs } from "node:fs";
import path from "node:path";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
};

type ImportedMdx = {
  default: React.ComponentType;
  metadata: Omit<PostMeta, "slug">;
};

export async function getPostSlugs(): Promise<string[]> {
  const abs = path.join(process.cwd(), "content", "posts");
  const files = await fs.readdir(abs);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();
  const loaded = await Promise.all(
    slugs.map(async (slug) => {
      const mod = (await import(
        `@/content/posts/${slug}.mdx`
      )) as ImportedMdx;
      return { slug, ...mod.metadata } satisfies PostMeta;
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
