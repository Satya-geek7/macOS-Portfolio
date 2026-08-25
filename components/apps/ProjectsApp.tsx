"use client";

import { useEffect, useState } from "react";
import Icon from "../Icon";
import { useDesktop } from "@/lib/desktop-context";
import { projects } from "@/lib/portfolio.config";

export default function ProjectsApp({ focusId }: { focusId?: string }) {
  const { openUrl } = useDesktop();
  const [selected, setSelected] = useState(focusId ?? projects[0]?.id);

  // Follow deep links from Spotlight or the terminal's `project <id>`.
  useEffect(() => {
    if (focusId) setSelected(focusId);
  }, [focusId]);

  const project = projects.find((p) => p.id === selected) ?? projects.at(0);

  if (!project) {
    return (
      <div className="pane">
        <div className="pane-scroll scroll-area">
          <div className="prose">
            <p>No projects yet. Add one to the projects array in lib/portfolio.config.ts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="sidebar scroll-area" aria-label="Project list">
        <div className="sidebar-heading">
          {projects.length} Projects
        </div>
        {projects.map((p) => (
          <button
            key={p.id}
            className={`sidebar-row${p.id === project.id ? " is-active" : ""}`}
            onClick={() => setSelected(p.id)}
          >
            <span className="sidebar-dot" style={{ background: p.accent }} />
            <span className="sidebar-text">
              <span className="sidebar-name">{p.name}</span>
              <span className="sidebar-sub">
                {p.year} · {p.status}
              </span>
            </span>
          </button>
        ))}
      </nav>

      <div className="pane">
        <div
          className="pane-scroll scroll-area"
          style={{ "--proj-accent": project.accent } as React.CSSProperties}
        >
          <div className="proj-head">
            <div style={{ minWidth: 0 }}>
              <h1 className="h-lg">{project.name}</h1>
              <p style={{ color: "var(--text-2)", fontSize: 14.5, marginTop: 4 }}>
                {project.tagline}
              </p>
              <div className="meta-row">
                <span>
                  <strong>Role</strong> {project.role}
                </span>
                <span>
                  <strong>Year</strong> {project.year}
                </span>
              </div>
            </div>
            <span
              className={`status-tag status-${project.status.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {project.status}
            </span>
          </div>

          <div className="proj-accent-bar" style={{ background: project.accent }} />

          <div className="prose">
            <p>{project.description}</p>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 9 }}>
              Built with
            </div>
            <div className="chip-row">
              {project.stack.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 11 }}>
              What mattered
            </div>
            <ul className="hl-list">
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          {project.links.length > 0 && (
            <>
              <div className="divider" />
              <div className="btn-row">
                {project.links.map((l) => (
                  <button key={l.label} className="btn" onClick={() => openUrl(l.href)}>
                    {l.label}
                    <Icon name="arrow-up-right" size={14} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
