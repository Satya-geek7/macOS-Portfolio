"use client";

import Icon from "../Icon";
import { useDesktop } from "@/lib/desktop-context";
import { profile, socials } from "@/lib/portfolio.config";

export default function AboutApp() {
  const { openApp, openUrl } = useDesktop();

  return (
    <div className="pane">
      <div className="pane-scroll scroll-area">
        <div className="about-hero">
          <div className="avatar-lg">{profile.initials}</div>
          <div style={{ minWidth: 0 }}>
            <h1 className="h-lg">{profile.name}</h1>
            <div className="about-role">{profile.role}</div>
            {profile.available && (
              <span className="status-pill">
                <span className="status-dot" />
                {profile.availabilityNote}
              </span>
            )}
          </div>
        </div>

        <div className="divider" />

        <div className="prose">
          {profile.bio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="divider" />

        <div className="fact-grid">
          {profile.facts.map((f) => (
            <div className="fact" key={f.label}>
              <div className="fact-label">{f.label}</div>
              <div className="fact-value">{f.value}</div>
            </div>
          ))}
        </div>

        <div className="divider" />

        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Currently
        </div>
        <ul className="marker-list">
          {profile.currently.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>

        <div className="divider" />

        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => openApp("projects")}>
            <Icon name="folder" size={15} />
            See my work
          </button>
          <button className="btn" onClick={() => openApp("resume")}>
            <Icon name="doc" size={15} />
            Read my resume
          </button>
          {socials
            .filter((s) => s.icon === "github" || s.icon === "linkedin")
            .map((s) => (
              <button key={s.label} className="btn" onClick={() => openUrl(s.href)}>
                <Icon name={s.icon === "github" ? "github" : "linkedin"} size={15} />
                {s.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
