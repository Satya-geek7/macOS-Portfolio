"use client";

import { useCallback, type ReactNode } from "react";
import Icon from "./Icon";
import { MENUBAR_HEIGHT, useDesktop, type WinState } from "@/lib/desktop-context";
import { getApp } from "@/lib/app-registry";

export default function Window({
  win,
  children,
  titlebarExtra,
}: {
  win: WinState;
  children: ReactNode;
  titlebarExtra?: ReactNode;
}) {
  const { activeId, focusWindow, closeWindow, minimizeWindow, toggleMaximize, setGeom } =
    useDesktop();

  const def = getApp(win.id);
  const isActive = activeId === win.id;

  /* ------------------------------------------------------------------ drag */
  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      // Ignore drags that begin on a control inside the title bar.
      if ((e.target as HTMLElement).closest("button")) return;
      if (win.maximized) return;
      if (e.button !== 0) return;

      focusWindow(win.id);

      const startX = e.clientX;
      const startY = e.clientY;
      const originX = win.x;
      const originY = win.y;

      const move = (ev: PointerEvent) => {
        const nextX = originX + (ev.clientX - startX);
        const nextY = originY + (ev.clientY - startY);
        setGeom(win.id, {
          // Keep a grabbable strip on screen in every direction.
          x: Math.min(Math.max(nextX, -win.w + 130), window.innerWidth - 130),
          y: Math.min(Math.max(nextY, MENUBAR_HEIGHT + 2), window.innerHeight - 60),
        });
      };

      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        // Without pointercancel, a drag that ends outside the browser window
        // would leave body.is-dragging on and the whole page unclickable.
        window.removeEventListener("pointercancel", up);
        document.body.classList.remove("is-dragging");
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
      document.body.classList.add("is-dragging");
    },
    [win.id, win.x, win.y, win.w, win.maximized, focusWindow, setGeom]
  );

  /* ---------------------------------------------------------------- resize */
  const startResize = useCallback(
    (e: React.PointerEvent, axis: "both" | "x" | "y") => {
      e.stopPropagation();
      if (win.maximized) return;

      focusWindow(win.id);

      const startX = e.clientX;
      const startY = e.clientY;
      const originW = win.w;
      const originH = win.h;

      const move = (ev: PointerEvent) => {
        const patch: { w?: number; h?: number } = {};
        if (axis !== "y") {
          patch.w = Math.max(
            def.minWidth,
            Math.min(originW + (ev.clientX - startX), window.innerWidth - win.x - 6)
          );
        }
        if (axis !== "x") {
          patch.h = Math.max(
            def.minHeight,
            Math.min(originH + (ev.clientY - startY), window.innerHeight - win.y - 6)
          );
        }
        setGeom(win.id, patch);
      };

      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        document.body.classList.remove("is-resizing");
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
      document.body.classList.add("is-resizing");
    },
    [win.id, win.w, win.h, win.x, win.y, win.maximized, def.minWidth, def.minHeight, focusWindow, setGeom]
  );

  return (
    <section
      className={`window${isActive ? " is-active" : ""}${win.minimized ? " is-minimized" : ""}`}
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
      }}
      onPointerDown={() => !isActive && focusWindow(win.id)}
      aria-label={def.title}
      aria-hidden={win.minimized}
    >
      <header className="titlebar" onPointerDown={startDrag} onDoubleClick={() => toggleMaximize(win.id)}>
        <div className="traffic">
          <button
            className="tl tl-close"
            onClick={() => closeWindow(win.id)}
            aria-label={`Close ${def.title}`}
          >
            <Icon name="close" size={8} />
          </button>
          <button
            className="tl tl-min"
            onClick={() => minimizeWindow(win.id)}
            aria-label={`Minimize ${def.title}`}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <rect x="0.6" y="3.2" width="6.8" height="1.6" rx="0.8" fill="currentColor" />
            </svg>
          </button>
          <button
            className="tl tl-max"
            onClick={() => toggleMaximize(win.id)}
            aria-label={win.maximized ? `Restore ${def.title}` : `Zoom ${def.title}`}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <path d="M1 4.4V1h3.4M7 3.6V7H3.6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
        </div>

        <h2 className="window-title">{def.title}</h2>

        <div className="titlebar-actions">{titlebarExtra}</div>
      </header>

      <div className="window-body">{children}</div>

      {!win.maximized && (
        <>
          <div className="resize-edge-r" onPointerDown={(e) => startResize(e, "x")} />
          <div className="resize-edge-b" onPointerDown={(e) => startResize(e, "y")} />
          <div
            className="resize-handle"
            onPointerDown={(e) => startResize(e, "both")}
            role="separator"
            aria-label={`Resize ${def.title}`}
          />
        </>
      )}
    </section>
  );
}
