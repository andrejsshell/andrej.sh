import { ImageResponse } from "next/og";
import { getPostSlugs } from "@/lib/content";
import { loadOgFonts, ogColors, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "andrej.sh";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

type PostModule = {
  metadata: { title: string; date: string; summary?: string };
};

export default async function PostOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { metadata } = (await import(
    `@/content/posts/${slug}.mdx`
  )) as PostModule;
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
          padding: "96px",
          background: ogColors.bg,
          color: ogColors.ink,
          fontFamily: "STIX",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: "-0.015em",
            maxWidth: 1000,
          }}
        >
          {metadata.title}
        </div>
        {metadata.summary && (
          <div
            style={{
              fontSize: 32,
              fontStyle: "italic",
              color: ogColors.muted,
              lineHeight: 1.35,
              maxWidth: 960,
            }}
          >
            {metadata.summary}
          </div>
        )}
      </div>
    ),
    { ...size, fonts },
  );
}
