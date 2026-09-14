"use client";

import { useRef } from "react";
import type { Book } from "@/app/data";

/** Stable per-title thickness so the shelf doesn't look machine-stamped. */
function depthFor(title: string) {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) | 0;
  return 26 + (Math.abs(h) % 16); // 26–41px
}

/** Resting pose: turned so the spine reads, tipped down so the head shows. */
const REST_Y = 27;
const REST_X = -7;
const RANGE_Y = 30;
const RANGE_X = 12;

export function Book3D({ book }: { book: Book }) {
  const ref = useRef<HTMLDivElement>(null);
  const fg = book.cover.fg ?? "#f5efdc";
  const depth = depthFor(book.title);

  const setAngles = (ry: number, rx: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--rx", `${rx}deg`);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    // The cursor acts as the viewpoint: left of the book opens the spine,
    // above it tips the head into view.
    setAngles(REST_Y - px * RANGE_Y, REST_X + py * RANGE_X);
  };

  const onPointerLeave = () => setAngles(REST_Y, REST_X);

  return (
    <div
      className="book-stage"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="book-shadow" />
      <div
        ref={ref}
        className="book-3d"
        aria-hidden="true"
        style={
          {
            "--depth": `${depth}px`,
            "--cover": book.cover.bg,
            "--cover-fg": fg,
          } as React.CSSProperties
        }
      >
        <div className="face front">
          <div className="hinge" />
          <div className="front-inner">
            <div className="title">{book.title}</div>
            <div className="author">{book.author}</div>
          </div>
          <div className="gloss" />
        </div>
        <div className="face spine">
          <span className="spine-text">{book.spineTitle ?? book.title}</span>
        </div>
        <div className="face back" />
        <div className="face pages" />
        <div className="face edge-top" />
        <div className="face edge-bottom" />
      </div>
    </div>
  );
}
