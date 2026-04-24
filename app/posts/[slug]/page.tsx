import { notFound } from "next/navigation";
import { ReadingLayout } from "@/components/sidenote";
import { formatLongDate, getPostSlugs } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

type PostModule = {
  default: React.ComponentType;
  metadata: { title: string; date: string; summary?: string };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const mod = (await import(`@/content/posts/${slug}.mdx`)) as PostModule;
    return {
      title: `${mod.metadata.title} — andrej.sh`,
      description: mod.metadata.summary,
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let MDX: React.ComponentType;
  let metadata: PostModule["metadata"];
  try {
    const mod = (await import(`@/content/posts/${slug}.mdx`)) as PostModule;
    MDX = mod.default;
    metadata = mod.metadata;
  } catch {
    notFound();
  }

  return (
    <div className="page-enter">
      <ReadingLayout>
        <h1 className="post-title">{metadata.title}</h1>
        <div className="post-meta">
          {formatLongDate(metadata.date)} · Andrej Acevski
        </div>
        <MDX />
      </ReadingLayout>
    </div>
  );
}
