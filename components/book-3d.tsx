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

const clamp = (n: number) => Math.min(0.5, Math.max(-0.5, n));

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

  const rest = () => setAngles(REST_Y, REST_X);

  /**
   * Aim the book at the pointer, which acts as a viewpoint: left of the book
   * opens the spine, above it tips the head into view. Touch pointers are
   * implicitly captured on pointerdown, so a finger can travel well outside
   * the element — clamp rather than let the angles run away.
   */
  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = clamp((e.clientX - r.left) / r.width - 0.5); // -0.5 … 0.5
    const py = clamp((e.clientY - r.top) / r.height - 0.5);
    setAngles(REST_Y - px * RANGE_Y, REST_X + py * RANGE_X);
  };

  // Touch never fires pointermove without contact, so a tap would otherwise
  // read as dead. Aiming on pointerdown makes a single tap respond too.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") track(e);
  };

  // pointerleave is unreliable for touch, and the browser sends pointercancel
  // when it claims the gesture for a vertical scroll.
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") rest();
  };

  return (
    <div
      className="book-stage"
      onPointerMove={track}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={rest}
      onPointerLeave={rest}
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
