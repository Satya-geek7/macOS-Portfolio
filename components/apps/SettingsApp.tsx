"use client";

import Icon from "../Icon";
import { useDesktop } from "@/lib/desktop-context";
import { wallpapers } from "@/lib/portfolio.config";

const SHORTCUTS: [string, string[]][] = [
  ["Open Spotlight", ["⌘", "K"]],
  ["Close window", ["⌘", "W"]],
  ["Minimize window", ["⌘", "M"]],
  ["Clear terminal", ["⌘", "L"]],
  ["Open desktop icon", ["↵"]],
  ["Zoom window", ["dbl-click title"]],
];

export default function SettingsApp() {
  const { theme, setTheme, wallpaper, setWallpaper, boot, lock, closeAll } = useDesktop();

  const forTheme = wallpapers.filter((w) => w.mode === theme);

  return (
    <div className="pane">
      <div className="pane-scroll scroll-area">
        <h1 className="h-lg">Appearance</h1>

        <section className="set-section">
          <div className="set-row">
            <div className="set-row-text">
              <div className="h-sm">Theme</div>
              <div className="set-row-sub">
                Remembered in this browser. Each theme keeps its own wallpaper.
              </div>
            </div>
            <div className="seg">
              <button
                className={theme === "light" ? "is-on" : ""}
                onClick={() => setTheme("light")}
              >
                <Icon name="sun" size={14} />
                Light
              </button>
              <button className={theme === "dark" ? "is-on" : ""} onClick={() => setTheme("dark")}>
                <Icon name="moon" size={14} />
                Dark
              </button>
            </div>
          </div>
        </section>

        <section className="set-section">
          <div className="h-sm">Wallpaper</div>
          <div className="set-row-sub">
            {forTheme.length} options for {theme} mode. All rendered in CSS — no image files.
          </div>

          <div className="wall-grid">
            {forTheme.map((w) => (
              <button
                key={w.id}
                className={`wall-card${w.id === wallpaper.id ? " is-active" : ""}`}
                onClick={() => setWallpaper(w.id)}
                aria-label={`Use ${w.name} wallpaper`}
                aria-pressed={w.id === wallpaper.id}
              >
                <span className="wall-swatch" style={{ background: w.css }} />
                <span className="wall-name">{w.name}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="divider" />

        <section className="set-section">
          <div className="h-sm">Keyboard shortcuts</div>
          <div className="shortcut-grid">
            {SHORTCUTS.map(([label, keys]) => (
              <div className="shortcut-line" key={label}>
                <span>{label}</span>
                <span className="shortcut-keys">
                  {keys.map((k) => (
                    <span className="kbd" key={k}>
                      {k}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        <section className="set-section">
          <div className="h-sm">Session</div>
          <div className="set-row-sub" style={{ marginBottom: 12 }}>
            Nothing here touches a server. State lives in this tab only.
          </div>
          <div className="btn-row">
            <button className="btn" onClick={closeAll}>
              Close all windows
            </button>
            <button className="btn" onClick={lock}>
              Lock screen
            </button>
            <button className="btn" onClick={boot}>
              Replay boot sequence
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
