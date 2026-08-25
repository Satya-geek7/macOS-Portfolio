"use client";

import { useEffect, useState } from "react";
import Icon from "../Icon";
import { useNow } from "@/lib/use-now";

const DOW = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarWidget() {
  const now = useNow(60_000);
  const [offset, setOffset] = useState(0);
  const [today, setToday] = useState<{ y: number; m: number; d: number } | null>(null);

  useEffect(() => {
    if (!now) return;
    setToday({ y: now.getFullYear(), m: now.getMonth(), d: now.getDate() });
  }, [now]);

  if (!today) {
    return (
      <div className="widget">
        <div className="cal-head">
          <span className="cal-month">—</span>
        </div>
        <div className="cal-grid" style={{ minHeight: 150 }} />
      </div>
    );
  }

  const view = new Date(today.y, today.m + offset, 1);
  const year = view.getFullYear();
  const month = view.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  type Cell = { day: number; muted: boolean; isToday: boolean };
  const cells: Cell[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, muted: true, isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      muted: false,
      isToday: d === today.d && month === today.m && year === today.y,
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - daysInMonth - firstDay + 1, muted: true, isToday: false });
  }

  return (
    <div className="widget">
      <div className="cal-head">
        <span className="cal-month">
          {view.toLocaleDateString([], { month: "long" })}
          {offset !== 0 && ` ${year}`}
        </span>
        <div className="cal-nav">
          <button onClick={() => setOffset((o) => o - 1)} aria-label="Previous month">
            <Icon name="chevron" size={12} className="cal-flip" />
          </button>
          <button onClick={() => setOffset(0)} aria-label="Today" title="Today">
            <span style={{ fontSize: 10, fontWeight: 700 }}>•</span>
          </button>
          <button onClick={() => setOffset((o) => o + 1)} aria-label="Next month">
            <Icon name="chevron" size={12} />
          </button>
        </div>
      </div>

      <div className="cal-grid">
        {DOW.map((d, i) => (
          <div key={i} className="cal-dow">
            {d}
          </div>
        ))}
        {cells.map((c, i) => (
          <div
            key={i}
            className={`cal-cell${c.muted ? " is-muted" : ""}${c.isToday ? " is-today" : ""}`}
          >
            {c.day}
          </div>
        ))}
      </div>
    </div>
  );
}
