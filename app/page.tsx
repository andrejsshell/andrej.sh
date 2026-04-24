import Link from "next/link";
import { formatShortDate, getPosts } from "@/lib/content";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="col page-enter">
      <header className="hero">
        <h1 className="hero-name">Andrej Acevski</h1>
      </header>

      <p>
        I’m a product engineer at{" "}
        <a href="https://tolt.com" target="_blank" rel="noreferrer">
          Tolt
        </a>
        , the affiliate, referral, and partnership platform for SaaS. I work
        across the stack, shipping the tools our customers use to grow.
      </p>

      <p>
        On the side I build{" "}
        <a href="https://kaneo.app" target="_blank" rel="noreferrer">
          Kaneo
        </a>
        , an open source, self-hosted project management platform. The idea is
        simple: all you need, nothing you don’t. No tracking, no bloat.
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
        Elsewhere: see what I’m <Link href="/projects">building</Link>, or what
        I’m <Link href="/reading">reading</Link>. Find me on{" "}
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
