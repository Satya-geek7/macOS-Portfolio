"use client";

import { skillGroups } from "@/lib/portfolio.config";

export default function SkillsApp({ nonce }: { nonce: number }) {
  return (
    <div className="pane">
      <div className="pane-scroll scroll-area">
        <h1 className="h-lg">Skills</h1>
        <p style={{ color: "var(--text-2)", fontSize: 14, marginTop: 5 }}>
          Self-assessed, and deliberately not all at 100%. The gaps are the honest part.
        </p>

        <div className="divider" />

        {skillGroups.map((group, gi) => (
          <section className="skill-group" key={group.name}>
            <h2 className="h-md">{group.name}</h2>
            <div className="skill-blurb">{group.blurb}</div>

            <div className="skill-list">
              {group.skills.map((skill, si) => (
                <div key={`${nonce}-${skill.name}`}>
                  <div className="skill-row-top">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-pct">{skill.level}</span>
                  </div>
                  <div className="skill-track">
                    <div
                      className="skill-fill"
                      style={{
                        width: `${skill.level}%`,
                        animationDelay: `${gi * 90 + si * 55}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
