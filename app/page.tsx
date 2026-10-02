import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { formatShortDate, getPosts } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const posts = await getPosts();

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author.name,
    url: site.url,
    image: `${site.url}/apple-icon.png`,
    jobTitle: "Founder of Kaneo",
    description: site.description,
    sameAs: [site.author.github, site.author.twitterUrl],
    worksFor: [
      { "@type": "Organization", name: "Kaneo", url: "https://kaneo.app" },
      { "@type": "Organization", name: "Tolt", url: "https://tolt.com" },
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Faculty of Computer Science and Engineering, Ss. Cyril and Methodius University",
    },
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: site.language,
    author: { "@type": "Person", name: site.author.name, url: site.url },
  };

  return (
    <div className="col page-enter">
      <JsonLd data={personLd} />
      <JsonLd data={websiteLd} />

      <header className="hero">
        <h1 className="hero-name">Andrej Acevski</h1>
      </header>

      <p>
        I build{" "}
        <a href="https://kaneo.app" target="_blank" rel="noreferrer">
          Kaneo
        </a>
        , an open source project management platform for teams who want
        something fast, simple, and their own. Host it yourself for free or use
        Kaneo Cloud. I started it at the end of 2024, and it has grown to more
        than 9,000 stars and 100 contributors on{" "}
        <a
          href="https://github.com/usekaneo/kaneo"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </p>

      <p>
        By day I’m a product engineer at{" "}
        <a href="https://tolt.com" target="_blank" rel="noreferrer">
          Tolt
        </a>
        , working across the stack on the affiliate and referral platform for
        SaaS.
      </p>

      <p>
        I write Go and TypeScript, keep my weekends full of side projects, and
        care about tools that get out of the way. I write here when I learn
        something worth passing on.
      </p>

      <div
        className="section-title"
        style={{ marginTop: "2rem", marginBottom: "0.5rem" }}
      >
        Writing
      </div>
      <ul className="writing-list">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`}>{p.title}</Link>
            <span className="date">{formatShortDate(p.date)}</span>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: "1rem" }}>
        Elsewhere: see what I’m <Link href="/reading">reading</Link>, find me
        on{" "}
        <a
          href="https://github.com/andrejsshell"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>{" "}
        and{" "}
        <a href="https://x.com/andrejsshell" target="_blank" rel="noreferrer">
          Twitter
        </a>
        , or <a href="mailto:hello@andrej.sh">say hi</a>.
      </p>
    </div>
  );
}
