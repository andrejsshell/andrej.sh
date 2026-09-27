import type { Metadata } from "next";
import { reading } from "@/app/data";
import { Bookshelf, type ShelfBook } from "@/components/bookshelf";

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

export default function ReadingPage() {
  const books: ShelfBook[] = [
    ...reading.current.map((b) => ({ ...b, status: "current" as const })),
    ...reading.finished.map((b) => ({ ...b, status: "finished" as const })),
  ];
  return (
    <div className="col page-enter" style={{ maxWidth: 720 }}>
      <h1 className="hero-name">Reading</h1>
      <p className="muted">
        What I’m reading now, and the ones I’ve finished. The ribboned spines
        are still in progress.
      </p>
      <Bookshelf books={books} />
    </div>
  );
}
