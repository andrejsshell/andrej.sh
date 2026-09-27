"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Book } from "@/app/data";

export type ShelfBook = Book & { status: "current" | "finished" };

/** Stable per-title size so the shelf doesn't look machine-stamped. */
function sizeFor(title: string) {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) | 0;
  h = Math.abs(h);
  const height = 300 + (h % 60); // 300–359px
  const thickness = 48 + ((h >> 5) % 22); // 48–69px
  return { height, thickness, width: Math.round(height * 0.68) };
}

const surname = (author: string) =>
  author.split(",")[0].trim().split(/\s+/).pop() ?? author;

export function Bookshelf({ books }: { books: ShelfBook[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [nudge, setNudge] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) => (i === null ? i : (i + dir + books.length) % books.length)),
    [books.length],
  );

  // Esc puts the book back, arrows pull out its neighbour.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else return;
      e.preventDefault();
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, step]);

  /** Keep the pulled-out cover inside the shelf's scroll box. */
  useLayoutEffect(() => {
    if (open === null) return;
    const place = () => {
      const scroll = scrollRef.current;
      const slot = slotRefs.current[open];
      if (!scroll || !slot) return;
      const sc = scroll.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      // the cover comes forward, so it reads a little wider than it is
      const cover = (sizeFor(books[open].title).width * 1.14) / 2;
      const mid = s.left + s.width / 2;
      const dx =
        Math.max(0, sc.left + 8 - (mid - cover)) -
        Math.max(0, mid + cover - (sc.right - 8));
      setNudge(dx);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, books]);

  const book = open === null ? null : books[open];

  return (
    <div
      ref={rootRef}
      className="bookshelf"
      data-open={open === null ? undefined : ""}
    >
      <div ref={scrollRef} className="bookshelf-scroll">
        <div className="bookshelf-row">
          {books.map((b, i) => {
            const { height, thickness, width } = sizeFor(b.title);
            const isOpen = open === i;
            return (
              <button
                key={b.title}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                type="button"
                className="sb"
                aria-expanded={isOpen}
                aria-controls="bookshelf-card"
                aria-label={`${b.title} by ${b.author}`}
                onClick={() => setOpen(isOpen ? null : i)}
                style={
                  {
                    "--h": `${height}px`,
                    "--t": `${thickness}px`,
                    "--w": `${width}px`,
                    "--cover": b.cover.bg,
                    "--cover-fg": b.cover.fg ?? "#f5efdc",
                    "--dx": isOpen ? `${nudge}px` : "0px",
                  } as React.CSSProperties
                }
              >
                <span className="sb-pull">
                  <span className="sb-book" aria-hidden="true">
                    <span className="face spine">
                      <span className="spine-rule" />
                      <span className="spine-title">{b.spineTitle ?? b.title}</span>
                      <span className="spine-author">{surname(b.author)}</span>
                    </span>
                    <span className="face front">
                      <span className="hinge" />
                      <span className="front-inner">
                        <span className="title">{b.title}</span>
                        <span className="author">{b.author}</span>
                      </span>
                      <span className="gloss" />
                    </span>
                    <span className="face back" />
                    <span className="face top" />
                    <span className="face fore" />
                    {b.status === "current" && <span className="ribbon" />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="bookshelf-card"
        className="bookshelf-card"
        hidden={!book}
        aria-live="polite"
      >
        {book && (
          <>
            <button
              type="button"
              className="bookshelf-close"
              aria-label="Put the book back"
              onClick={() => setOpen(null)}
            >
              ×
            </button>
            <div className="bookshelf-status">
              {book.status === "current" ? "Currently reading" : "Finished"}
            </div>
            <div className="bookshelf-title">{book.title}</div>
            <div className="bookshelf-author">{book.author}</div>
            <div className="bookshelf-foot">
              {open! + 1} / {books.length} · esc to close · ← → to browse
            </div>
          </>
        )}
      </div>
    </div>
  );
}
