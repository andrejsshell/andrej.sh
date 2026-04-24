"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Entry = { n: number; body: ReactNode };

type Ctx = {
  register: (entry: Entry) => void;
  unregister: (n: number) => void;
};

const SidenoteContext = createContext<Ctx | null>(null);

export function ReadingLayout({ children }: { children: ReactNode }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const marginRef = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  const register = (entry: Entry) => {
    setEntries((prev) => {
      const i = prev.findIndex((e) => e.n === entry.n);
      if (i === -1) return [...prev, entry].sort((a, b) => a.n - b.n);
      const copy = prev.slice();
      copy[i] = entry;
      return copy;
    });
  };

  const unregister = (n: number) => {
    setEntries((prev) => prev.filter((e) => e.n !== n));
  };

  useLayoutEffect(() => {
    function position() {
      const body = bodyRef.current;
      const margin = marginRef.current;
      if (!body || !margin) return;
      if (window.innerWidth <= 900) return;
      const anchors = body.querySelectorAll<HTMLElement>("[data-sn-anchor]");
      const bodyTop = body.getBoundingClientRect().top;
      const marginTop = margin.getBoundingClientRect().top;
      const delta = bodyTop - marginTop;
      let lastBottom = -Infinity;
      anchors.forEach((a) => {
        const n = a.getAttribute("data-sn-anchor");
        const note = margin.querySelector<HTMLElement>(`[data-sn-note="${n}"]`);
        if (!note) return;
        const rect = a.getBoundingClientRect();
        let top = rect.top - bodyTop + delta - 4;
        if (top < lastBottom + 16) top = lastBottom + 16;
        note.style.top = `${top}px`;
        lastBottom = top + note.offsetHeight;
      });
    }
    position();
    const ro = new ResizeObserver(position);
    if (bodyRef.current) ro.observe(bodyRef.current);
    window.addEventListener("resize", position);
    const t = setTimeout(position, 120);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", position);
      clearTimeout(t);
    };
  }, [entries]);

  return (
    <SidenoteContext.Provider value={{ register, unregister }}>
      <div className="post reading">
        <div className="body" ref={bodyRef}>
          {children}
        </div>
        <aside className="margin" ref={marginRef}>
          {entries.map((entry) => (
            <div
              key={entry.n}
              className="sidenote"
              data-sn-note={String(entry.n)}
            >
              <span className="num">{entry.n}</span> {entry.body}
            </div>
          ))}
        </aside>
      </div>
    </SidenoteContext.Provider>
  );
}

export function Sidenote({ n, children }: { n: number; children: ReactNode }) {
  const ctx = useContext(SidenoteContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.register({ n, body: children });
    return () => ctx.unregister(n);
  }, [ctx, n, children]);

  return (
    <>
      <span
        className="sidenote-ref"
        data-sn-anchor={String(n)}
        aria-label={`footnote ${n}`}
      >
        {n}
      </span>
      <span className="sidenote-inline">
        <sup>{n}</sup> {children}
      </span>
    </>
  );
}
