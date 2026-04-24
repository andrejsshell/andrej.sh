import type { Metadata } from "next";
import { projects, workHistory } from "@/app/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Open source projects and work history by Andrej Acevski — Kaneo, Tolt, and more.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects",
    url: "/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <div className="col page-enter">
      <h1 className="hero-name">Projects</h1>
      <p className="muted">
        Things I’ve built or am building. Most are open source.
      </p>

      <div className="section-title" style={{ marginTop: "2.5rem" }}>
        Open source
      </div>
      <div>
        {projects.map((p) => (
          <div className="project-item" key={p.name}>
            <div className="project-head">
              <div className="project-name">
                {p.href && p.href !== "#" ? (
                  <a href={p.href} target="_blank" rel="noreferrer">
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}
              </div>
              <div className="project-meta">{p.meta}</div>
            </div>
            <div className="project-desc">{p.desc}</div>
          </div>
        ))}
      </div>

      <div className="section-title" style={{ marginTop: "3rem" }}>
        Work
      </div>
      <div>
        {workHistory.map((w) => (
          <div className="project-item" key={w.company + w.period}>
            <div className="project-head">
              <div className="project-name">
                {w.role} ·{" "}
                <span className="muted" style={{ fontWeight: 400 }}>
                  {w.company}
                </span>
              </div>
              <div className="project-meta">{w.period}</div>
            </div>
            <div className="project-desc">{w.desc}</div>
          </div>
        ))}
      </div>

      <p className="muted small" style={{ marginTop: "3rem" }}>
        Looking to collaborate on something?{" "}
        <a href="mailto:hello@andrej.sh">hello@andrej.sh</a>.
      </p>
    </div>
  );
}
