"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/portfolio.config";

const STAGES = [
  "Loading kernel modules",
  "Mounting /Users/portfolio",
  "Starting window server",
  "Restoring session",
  "Ready",
];

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        // Uneven steps read more like real hardware than a linear ramp.
        return Math.min(100, p + 4 + Math.random() * 11);
      });
    }, 130);

    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const hold = window.setTimeout(() => setLeaving(true), 320);
    const exit = window.setTimeout(onDone, 880);
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(exit);
    };
  }, [progress, onDone]);

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length))];

  return (
    <div className={`boot${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite">
      <div className="boot-logo">
        <Mark />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div className="boot-bar">
          <div className="boot-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="boot-status">{stage}</div>
      </div>

      <button className="boot-skip" onClick={onDone}>
        Skip
      </button>
    </div>
  );
}

/** A custom monogram mark — deliberately not a borrowed platform logo. */
function Mark() {
  return (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" aria-label={profile.name}>
      <rect
        x="4"
        y="4"
        width="66"
        height="66"
        rx="19"
        stroke="currentColor"
        strokeWidth="2.4"
        opacity="0.5"
      />
      <path
        d="M22 50V26l15 17 15-17v24"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="37" cy="58" r="2.4" fill="currentColor" />
    </svg>
  );
}
