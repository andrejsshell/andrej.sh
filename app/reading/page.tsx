import type { Metadata } from "next";
import { reading, type Book } from "@/app/data";
import { Book3D } from "@/components/book-3d";

export const metadata: Metadata = {
  title: "Reading",
  description: "Books I’m currently reading, and a shelf of the ones I’ve finished.",
  alternates: { canonical: "/reading" },
  openGraph: {
    title: "Reading",
    url: "/reading",
    type: "website",
  },
};

function BookCard({ book }: { book: Book }) {
  return (
    <div className="book">
      <Book3D book={book} />
      <div className="book-meta">
        <span className="t">{book.title}</span>
        <span className="a">{book.author}</span>
      </div>
    </div>
  );
}

export default function ReadingPage() {
  const { current, finished } = reading;
  return (
    <div className="col page-enter" style={{ maxWidth: 720 }}>
      <h1 className="hero-name">Reading</h1>

      {current.length > 0 && (
        <>
          <div className="shelf-section-title">Currently reading</div>
          <div className="shelf">
            {current.map((b) => (
              <BookCard key={b.title} book={b} />
            ))}
          </div>
        </>
      )}

      {finished.length > 0 && (
        <>
          <div className="shelf-section-title">Finished</div>
          <div className="shelf">
            {finished.map((b) => (
              <BookCard key={b.title} book={b} />
            ))}
          </div>
        </>
      )}

      <p className="muted small" style={{ marginTop: "3rem" }}>
        I also dumped a year of Kindle highlights into a dashboard.{" "}
        <a href="/posts/kindle-reading-stats-dashboard">The writeup is here</a>.
      </p>
    </div>
  );
}
