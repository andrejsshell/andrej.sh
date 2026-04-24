import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ReadingLayout } from "@/components/sidenote";
import { formatLongDate, getPostSlugs, readingStats } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

type PostModule = {
  default: React.ComponentType;
  metadata: { title: string; date: string; summary?: string };
};

async function loadPost(slug: string) {
  try {
    return (await import(`@/content/posts/${slug}.mdx`)) as PostModule;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mod = await loadPost(slug);
  if (!mod) return { title: "Not found" };

  const url = `/posts/${slug}`;
  return {
    title: mod.metadata.title,
    description: mod.metadata.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: mod.metadata.title,
      description: mod.metadata.summary,
      url,
      publishedTime: new Date(mod.metadata.date).toISOString(),
      authors: [site.author.name],
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: mod.metadata.title,
      description: mod.metadata.summary,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = await loadPost(slug);
  if (!mod) notFound();

  const { default: MDX, metadata } = mod;
  const { readingMinutes } = await readingStats(slug);
  const url = `${site.url}/posts/${slug}`;
  const publishedIso = new Date(metadata.date).toISOString();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: metadata.title,
    description: metadata.summary,
    datePublished: publishedIso,
    dateModified: publishedIso,
    image: `${url}/opengraph-image`,
    author: {
      "@type": "Person",
      name: site.author.name,
      url: site.url,
    },
    publisher: {
      "@type": "Person",
      name: site.author.name,
      url: site.url,
    },
    inLanguage: site.language,
    url,
    wordCount: (await readingStats(slug)).wordCount,
  };

  return (
    <div className="page-enter">
      <JsonLd data={articleLd} />
      <ReadingLayout>
        <h1 className="post-title">{metadata.title}</h1>
        <div className="post-meta">
          {formatLongDate(metadata.date)} · {site.author.name} ·{" "}
          {readingMinutes} min read
        </div>
        <MDX />
      </ReadingLayout>
    </div>
  );
}
