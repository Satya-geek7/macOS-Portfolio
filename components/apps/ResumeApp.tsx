"use client";

import Icon from "../Icon";
import {
  certifications,
  education,
  experience,
  profile,
  skillGroups,
  socials,
} from "@/lib/portfolio.config";

export default function ResumeApp() {
  return (
    <div className="pane">
      <div className="resume-toolbar">
        <span>1 of 1 page</span>
        <div style={{ flex: 1 }} />
        <button className="btn" style={{ height: 26 }} onClick={() => window.print()}>
          <Icon name="doc" size={14} />
          Print or save as PDF
        </button>
      </div>

      <div className="resume-stage scroll-area">
        <article className="resume-sheet">
          <header>
            <h1 className="resume-name">{profile.name}</h1>
            <div style={{ fontSize: 13, color: "#40454e", marginTop: 3 }}>{profile.role}</div>
            <div className="resume-contact">
              <span>{profile.email}</span>
              <span>{profile.location}</span>
              {socials
                .filter((s) => s.icon !== "mail")
                .map((s) => (
                  <span key={s.label}>{s.href.replace(/^https?:\/\//, "")}</span>
                ))}
            </div>
          </header>

          <div className="resume-rule" />

          <section className="resume-section">
            <h2 className="resume-h">Summary</h2>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "#34383f" }}>{profile.bio[0]}</p>
          </section>

          <section className="resume-section">
            <h2 className="resume-h">Experience</h2>
            {experience.map((job) => (
              <div className="resume-job" key={job.company}>
                <div className="resume-job-top">
                  <div>
                    <div className="resume-job-role">{job.role}</div>
                    <div className="resume-job-co">{job.company}</div>
                  </div>
                  <div className="resume-job-when">
                    {job.period}
                    <br />
                    {job.location}
                  </div>
                </div>
                <ul className="resume-bullets">
                  {job.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="resume-section">
            <h2 className="resume-h">Skills</h2>
            {skillGroups.map((g) => (
              <div className="resume-skill-line" key={g.name}>
                <strong>{g.name}:</strong> {g.skills.map((s) => s.name).join(", ")}
              </div>
            ))}
          </section>

          <section className="resume-section">
            <h2 className="resume-h">Education</h2>
            {education.map((e) => (
              <div className="resume-job" key={e.school}>
                <div className="resume-job-top">
                  <div>
                    <div className="resume-job-role">{e.degree}</div>
                    <div className="resume-job-co">{e.school}</div>
                  </div>
                  <div className="resume-job-when">{e.period}</div>
                </div>
                {e.note && (
                  <div style={{ fontSize: 12, color: "#5c626c", marginTop: 4 }}>{e.note}</div>
                )}
              </div>
            ))}
          </section>

          {certifications.length > 0 && (
            <section className="resume-section">
              <h2 className="resume-h">Certifications</h2>
              <ul className="resume-bullets">
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
