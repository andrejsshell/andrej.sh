import Link from "next/link";
import { formatShortDate, getPosts } from "@/lib/content";

export default async function NotFound() {
  const posts = await getPosts();

  return (
    <div className="col page-enter">
      <header className="hero">
        <div className="eyebrow">404</div>
        <h1 className="hero-name">Not found</h1>
      </header>

      <p>
        There’s nothing at this address. The page may have moved, or it may
        never have been here at all.
      </p>

      {posts.length > 0 && (
        <>
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
        </>
      )}

      <p style={{ marginTop: "1rem" }}>
        Otherwise: back to the <Link href="/">home page</Link>, or see what I’m{" "}
        <Link href="/reading">reading</Link>.
      </p>
    </div>
  );
}
