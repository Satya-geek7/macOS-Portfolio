"use client";

import { DesktopProvider, useDesktop } from "@/lib/desktop-context";
import BootScreen from "./BootScreen";
import LockScreen from "./LockScreen";
import MenuBar from "./MenuBar";
import DesktopIcons from "./DesktopIcons";
import Dock from "./Dock";
import Spotlight from "./Spotlight";
import Window from "./Window";
import AppSurface from "./apps/AppSurface";
import ClockWidget from "./widgets/ClockWidget";
import WeatherWidget from "./widgets/WeatherWidget";
import CalendarWidget from "./widgets/CalendarWidget";
import MusicWidget from "./widgets/MusicWidget";

export default function Desktop() {
  return (
    <DesktopProvider>
      <Shell />
    </DesktopProvider>
  );
}

function Shell() {
  const { mounted, phase, unlock, wallpaper, windows } = useDesktop();

  // Before hydration finishes, paint only the wallpaper. This keeps the server
  // and client markup identical; the CSS fallback already matches the stored
  // theme because layout.tsx sets data-theme before first paint.
  if (!mounted) {
    return (
      <div className="shell">
        <div className="wallpaper" />
      </div>
    );
  }

  return (
    <div className="shell">
      <div className="wallpaper" style={{ background: wallpaper.css }} />

      {phase === "desktop" && (
        <>
          <MenuBar />
          <DesktopIcons />

          <aside className="widget-stack" aria-label="Desktop widgets">
            <ClockWidget />
            <WeatherWidget />
            <CalendarWidget />
            <MusicWidget />
          </aside>

          {windows.map((win) => (
            <Window key={win.id} win={win}>
              <AppSurface win={win} />
            </Window>
          ))}

          <Dock />
          <Spotlight />
        </>
      )}

      {phase === "lock" && <LockScreen onUnlock={unlock} />}
      {phase === "boot" && <BootAndLock />}
    </div>
  );
}

/** Boot runs, then hands off to the lock screen. */
function BootAndLock() {
  const { lock } = useDesktop();
  return <BootScreen onDone={lock} />;
}
