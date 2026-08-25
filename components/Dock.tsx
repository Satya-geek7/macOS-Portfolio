"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useDesktop } from "@/lib/desktop-context";
import { apps, shortcuts } from "@/lib/app-registry";

/** Cursor-distance magnification, the way the real dock does it. */
const BASE = 52;
const BASE_NARROW = 42;
const NARROW_QUERY = "(max-width: 760px)";
const MAX_SCALE = 1.62;
const FALLOFF = 105;

export default function Dock() {
  const { windows, openApp, focusWindow, openUrl, activeId } = useDesktop();
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [centers, setCenters] = useState<number[]>([]);
  const [narrow, setNarrow] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  const dockApps = apps.filter((a) => a.inDock);
  const base = narrow ? BASE_NARROW : BASE;

  // Tile size lives in JS, so the narrow breakpoint has to be watched here too
  // — globals.css shrinks the dock's own height to match at the same width.
  useLayoutEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /**
   * Tile centres are sampled while the dock is at rest, never during render.
   * Measuring mid-hover would feed the magnification back into itself — every
   * tile that grows shifts its neighbours along the flex row — and reading
   * layout from a render body is unsafe under StrictMode anyway.
   */
  useLayoutEffect(() => {
    const measure = () => {
      const el = dockRef.current;
      if (!el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(".dock-item"));
      setCenters(
        items.map((item) => {
          const rect = item.getBoundingClientRect();
          return rect.left + rect.width / 2;
        })
      );
    };

    if (mouseX === null) measure();

    const onResize = () => {
      if (mouseX === null) measure();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mouseX, narrow]);

  const scaleFor = (i: number) => {
    if (mouseX === null || i >= centers.length) return 1;
    const dist = Math.abs(mouseX - centers[i]);
    if (dist > FALLOFF) return 1;
    // Cosine falloff gives a smoother shoulder than a linear ramp.
    const t = dist / FALLOFF;
    return 1 + (MAX_SCALE - 1) * (Math.cos(t * Math.PI) + 1) * 0.5;
  };

  return (
    <div className="dock-wrap">
      <div
        className="dock"
        ref={dockRef}
        onPointerMove={(e) => setMouseX(e.clientX)}
        onPointerLeave={() => {
          setMouseX(null);
          setHovered(null);
        }}
      >
        {dockApps.map((app, i) => {
          const win = windows.find((w) => w.id === app.id);
          return (
            <DockItem
              key={app.id}
              label={app.title}
              gradient={app.gradient}
              icon={app.icon}
              running={Boolean(win)}
              active={activeId === app.id}
              hovered={hovered === app.id}
              setHovered={() => setHovered(app.id)}
              scale={scaleFor(i)}
              base={base}
              onClick={() => {
                if (win && !win.minimized && activeId === app.id) {
                  focusWindow(app.id);
                } else {
                  openApp(app.id);
                }
              }}
            />
          );
        })}

        <div className="dock-sep" />

        {shortcuts.map((s, i) => (
          <DockItem
            key={s.id}
            label={s.label}
            gradient={s.gradient}
            icon={s.icon}
            running={false}
            active={false}
            hovered={hovered === s.id}
            setHovered={() => setHovered(s.id)}
            scale={scaleFor(dockApps.length + i)}
            base={base}
            onClick={() => openUrl(s.href)}
          />
        ))}
      </div>
    </div>
  );
}

function DockItem({
  label,
  gradient,
  icon,
  running,
  active,
  hovered,
  setHovered,
  scale,
  base,
  onClick,
}: {
  label: string;
  gradient: [string, string];
  icon: Parameters<typeof Icon>[0]["name"];
  running: boolean;
  active: boolean;
  hovered: boolean;
  setHovered: () => void;
  scale: number;
  base: number;
  onClick: () => void;
}) {
  const size = Math.round(base * scale);

  return (
    <button
      className="dock-item"
      style={{ transform: `translateY(${-(size - base) * 0.34}px)` }}
      onPointerEnter={setHovered}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {hovered && <span className="dock-tooltip">{label}</span>}

      <span
        className="dock-tile"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.25),
          background: `linear-gradient(150deg, ${gradient[0]}, ${gradient[1]})`,
        }}
      >
        <Icon name={icon} size={Math.round(size * 0.5)} />
      </span>

      {running && <span className="dock-dot" style={{ opacity: active ? 0.9 : 0.55 }} />}
    </button>
  );
}
