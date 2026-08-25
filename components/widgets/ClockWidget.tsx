"use client";

import Icon from "../Icon";
import { useNow } from "@/lib/use-now";
import { profile } from "@/lib/portfolio.config";

export default function ClockWidget() {
  const now = useNow(1000);

  const h = now ? now.getHours() % 12 : 0;
  const m = now ? now.getMinutes() : 0;
  const s = now ? now.getSeconds() : 0;

  const hourAngle = (h + m / 60) * 30;
  const minuteAngle = (m + s / 60) * 6;
  const secondAngle = s * 6;

  return (
    <div className="widget clock-widget">
      <svg className="clock-face" width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
        <circle cx="66" cy="66" r="63" fill="var(--surface-solid)" opacity="0.55" />
        <circle cx="66" cy="66" r="63" fill="none" stroke="var(--border-soft)" strokeWidth="1" />

        {Array.from({ length: 60 }).map((_, i) => {
          const major = i % 5 === 0;
          const angle = (i * 6 * Math.PI) / 180;
          const outer = 58;
          const inner = major ? 50 : 55;
          return (
            <line
              key={i}
              x1={66 + Math.sin(angle) * inner}
              y1={66 - Math.cos(angle) * inner}
              x2={66 + Math.sin(angle) * outer}
              y2={66 - Math.cos(angle) * outer}
              stroke="var(--text-3)"
              strokeWidth={major ? 1.8 : 0.7}
              strokeLinecap="round"
              opacity={major ? 0.85 : 0.42}
            />
          );
        })}

        <g transform={`rotate(${hourAngle} 66 66)`}>
          <line
            x1="66"
            y1="72"
            x2="66"
            y2="34"
            stroke="var(--text)"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
        </g>
        <g transform={`rotate(${minuteAngle} 66 66)`}>
          <line
            x1="66"
            y1="74"
            x2="66"
            y2="20"
            stroke="var(--text)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>
        <g
          transform={`rotate(${secondAngle} 66 66)`}
          style={{ transition: s === 0 ? "none" : "transform 180ms cubic-bezier(.4,2.2,.5,1)" }}
        >
          <line x1="66" y1="80" x2="66" y2="16" stroke="#f26522" strokeWidth="1.3" strokeLinecap="round" />
        </g>

        <circle cx="66" cy="66" r="3.4" fill="#f26522" />
        <circle cx="66" cy="66" r="1.3" fill="var(--surface-solid)" />
      </svg>

      <div className="clock-caption">
        {now
          ? now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })
          : "—"}
      </div>
      <div className="clock-zone">
        <Icon name="globe" size={10} /> {profile.timezone}
      </div>
    </div>
  );
}
