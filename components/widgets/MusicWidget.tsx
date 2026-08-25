"use client";

import { useEffect, useState } from "react";
import Icon from "../Icon";
import { playlist } from "@/lib/portfolio.config";

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicWidget() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const track: (typeof playlist)[number] | undefined = playlist[index];
  const length = track?.length ?? 0;

  useEffect(() => {
    if (!playing || length === 0) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [playing, length]);

  // Rolling over to the next track lives in its own effect on purpose: calling
  // setIndex from inside the setElapsed updater would make that updater impure,
  // and StrictMode double-invokes updaters in development — which would skip a
  // track at every boundary.
  useEffect(() => {
    if (length === 0 || elapsed < length) return;
    setElapsed(0);
    setIndex((i) => (i + 1) % playlist.length);
  }, [elapsed, length]);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + playlist.length) % playlist.length);
    setElapsed(0);
  };

  if (!track) return null;

  const pct = length > 0 ? Math.min(100, (elapsed / length) * 100) : 0;

  return (
    <div className="widget music-widget">
      <div className="widget-head music-head">
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#1db954",
            display: "inline-block",
          }}
        />
        Now Playing
      </div>

      <div className="music-row">
        <div className="music-art">
          <Icon name="play" size={16} />
        </div>
        <div className="music-meta">
          <div className="music-title">{track.title}</div>
          <div className="music-artist">{track.artist}</div>
        </div>
      </div>

      <div className="music-progress">
        <div className="music-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="music-times">
        <span>{fmt(elapsed)}</span>
        <span>-{fmt(Math.max(0, length - elapsed))}</span>
      </div>

      <div className="music-controls">
        <button onClick={() => go(-1)} aria-label="Previous track">
          <Icon name="prev" size={15} />
        </button>
        <button
          className="music-play"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
        >
          <Icon name={playing ? "pause" : "play"} size={14} />
        </button>
        <button onClick={() => go(1)} aria-label="Next track">
          <Icon name="next" size={15} />
        </button>
      </div>
    </div>
  );
}
