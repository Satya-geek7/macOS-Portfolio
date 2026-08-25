"use client";

/* ============================================================================
 *  desktop-context.tsx — the whole operating system, such as it is.
 *  Owns: boot phase, theme, wallpaper, the window manager, Spotlight state.
 * ==========================================================================*/

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getApp, type AppId } from "./app-registry";
import { wallpapers, type Wallpaper } from "./portfolio.config";

export const MENUBAR_HEIGHT = 28;
export const DOCK_RESERVE = 104;

export type Theme = "light" | "dark";
export type Phase = "boot" | "lock" | "desktop";

export type WinState = {
  id: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  restore: { x: number; y: number; w: number; h: number } | null;
  /** Record inside the app to select on open (e.g. a project id). */
  focusId?: string;
  /** Bumped on every re-open so apps can re-run entry animations. */
  nonce: number;
};

export type Geom = Partial<Pick<WinState, "x" | "y" | "w" | "h">>;

type DesktopValue = {
  mounted: boolean;

  phase: Phase;
  boot: () => void;
  lock: () => void;
  unlock: () => void;

  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;

  wallpaper: Wallpaper;
  setWallpaper: (id: string) => void;
  availableWallpapers: Wallpaper[];

  windows: WinState[];
  activeId: AppId | null;
  openApp: (id: AppId, focusId?: string) => void;
  closeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  setGeom: (id: AppId, geom: Geom) => void;
  closeAll: () => void;

  spotlightOpen: boolean;
  setSpotlightOpen: (open: boolean) => void;

  openUrl: (href: string) => void;
};

const DesktopContext = createContext<DesktopValue | null>(null);

const STORAGE = {
  theme: "portfolio.theme",
  wallLight: "portfolio.wallpaper.light",
  wallDark: "portfolio.wallpaper.dark",
  unlocked: "portfolio.unlocked",
};

const DEFAULT_WALL: Record<Theme, string> = { light: "seaside", dark: "midnight" };

function safeGet(store: "local" | "session", key: string): string | null {
  try {
    const s = store === "local" ? window.localStorage : window.sessionStorage;
    return s.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(store: "local" | "session", key: string, value: string) {
  try {
    const s = store === "local" ? window.localStorage : window.sessionStorage;
    s.setItem(key, value);
  } catch {
    /* private browsing, quota, or a hostile iframe — never fatal */
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("boot");
  const [theme, setThemeState] = useState<Theme>("light");
  const [wallIds, setWallIds] = useState<Record<Theme, string>>(DEFAULT_WALL);
  const [windows, setWindows] = useState<WinState[]>([]);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  /**
   * The z-order counter is a ref, not state: state updater functions must stay
   * pure, and StrictMode double-invokes them in development. Deriving the next
   * z outside the updater keeps every updater pure and idempotent.
   *
   * It starts above the desktop furniture (icons sit at 10, the widget column
   * at 20) so that even the first window opened paints over both.
   */
  const zRef = useRef(30);

  /* ------------------------------------------------- hydrate from storage - */
  useEffect(() => {
    const storedTheme = safeGet("local", STORAGE.theme);
    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeState(storedTheme);
    } else if (typeof window !== "undefined" && window.matchMedia) {
      setThemeState(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }

    const light = safeGet("local", STORAGE.wallLight);
    const dark = safeGet("local", STORAGE.wallDark);
    setWallIds({
      light: wallpapers.some((w) => w.id === light) ? (light as string) : DEFAULT_WALL.light,
      dark: wallpapers.some((w) => w.id === dark) ? (dark as string) : DEFAULT_WALL.dark,
    });

    // Skip the boot animation if this tab has already been through it.
    if (safeGet("session", STORAGE.unlocked) === "1") setPhase("desktop");

    setMounted(true);
  }, []);

  /* ------------------------------------------------------ reflect the theme */
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.theme = theme;
  }, [theme, mounted]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    safeSet("local", STORAGE.theme, t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      safeSet("local", STORAGE.theme, next);
      return next;
    });
  }, []);

  /* -------------------------------------------------------------- wallpaper */
  const availableWallpapers = useMemo(
    () => wallpapers.filter((w) => w.mode === theme),
    [theme]
  );

  const wallpaper = useMemo<Wallpaper>(() => {
    const wanted = wallIds[theme];
    const match =
      wallpapers.find((w) => w.id === wanted && w.mode === theme) ??
      wallpapers.find((w) => w.mode === theme) ??
      wallpapers.at(0);

    // If someone empties the wallpaper list in the config, fall back to the
    // per-theme CSS variable rather than crashing the shell.
    return match ?? { id: "default", name: "Default", mode: theme, css: "var(--wall-default)" };
  }, [wallIds, theme]);

  const setWallpaper = useCallback(
    (id: string) => {
      const found = wallpapers.find((w) => w.id === id);
      if (!found) return;
      setWallIds((prev) => ({ ...prev, [found.mode]: id }));
      safeSet("local", found.mode === "light" ? STORAGE.wallLight : STORAGE.wallDark, id);
      if (found.mode !== theme) setTheme(found.mode);
    },
    [theme, setTheme]
  );

  /* ------------------------------------------------------------ boot phases */
  const boot = useCallback(() => {
    setWindows([]);
    setPhase("boot");
    safeSet("session", STORAGE.unlocked, "0");
  }, []);

  const lock = useCallback(() => {
    setPhase("lock");
    setSpotlightOpen(false);
    safeSet("session", STORAGE.unlocked, "0");
  }, []);

  const unlock = useCallback(() => {
    setPhase("desktop");
    safeSet("session", STORAGE.unlocked, "1");
  }, []);

  /* -------------------------------------------------------- window manager */
  const activeId = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    return visible.reduce((top, w) => (w.z > top.z ? w : top), visible[0]).id;
  }, [windows]);

  const focusWindow = useCallback((id: AppId) => {
    zRef.current += 1;
    const nextZ = zRef.current;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, z: nextZ, minimized: false } : w))
    );
  }, []);

  const openApp = useCallback((id: AppId, focusId?: string) => {
    const def = getApp(id);
    if (!def) return;

    zRef.current += 1;
    const nextZ = zRef.current;

    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        return prev.map((w) =>
          w.id === id
            ? {
                ...w,
                z: nextZ,
                minimized: false,
                focusId: focusId ?? w.focusId,
                nonce: focusId && focusId !== w.focusId ? w.nonce + 1 : w.nonce,
              }
            : w
        );
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // The app's stated minimum is a preference, not a guarantee: on a narrow
      // phone it has to yield, or the window opens wider than the screen and
      // its resize grips end up outside the viewport with no way to grab them.
      const fitW = Math.min(vw, Math.max(260, vw - 24));
      const fitH = Math.min(vh, Math.max(300, vh - MENUBAR_HEIGHT - 16));

      const w = Math.min(def.width, Math.max(def.minWidth, vw - 80), fitW);
      const h = Math.min(
        def.height,
        Math.max(def.minHeight, vh - MENUBAR_HEIGHT - DOCK_RESERVE),
        fitH
      );

      // Cascade each new window down and to the right of the last one.
      const step = prev.length % 6;
      const baseX = Math.round((vw - w) / 2) - 60 + step * 30;
      const baseY = MENUBAR_HEIGHT + 26 + step * 26;

      const x = clamp(baseX, 12, Math.max(12, vw - w - 12));
      const y = clamp(
        baseY,
        MENUBAR_HEIGHT + 8,
        Math.max(MENUBAR_HEIGHT + 8, vh - DOCK_RESERVE - 80)
      );

      return [
        ...prev,
        {
          id,
          x,
          y,
          w,
          h,
          z: nextZ,
          minimized: false,
          maximized: false,
          restore: null,
          focusId,
          nonce: 1,
        },
      ];
    });
  }, []);

  const closeWindow = useCallback((id: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const closeAll = useCallback(() => setWindows([]), []);

  const minimizeWindow = useCallback((id: AppId) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const toggleMaximize = useCallback((id: AppId) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized && w.restore) {
          return { ...w, ...w.restore, maximized: false, restore: null };
        }
        return {
          ...w,
          restore: { x: w.x, y: w.y, w: w.w, h: w.h },
          x: 8,
          y: MENUBAR_HEIGHT + 6,
          w: vw - 16,
          h: vh - MENUBAR_HEIGHT - DOCK_RESERVE + 10,
          maximized: true,
        };
      })
    );
  }, []);

  const setGeom = useCallback((id: AppId, geom: Geom) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...geom } : w)));
  }, []);

  /* ------------------------------------------------------------- keyboard  */
  useEffect(() => {
    if (!mounted) return;

    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (phase === "desktop") setSpotlightOpen((v) => !v);
        return;
      }

      if (meta && e.key === " ") {
        e.preventDefault();
        if (phase === "desktop") setSpotlightOpen((v) => !v);
        return;
      }

      if (e.key === "Escape" && spotlightOpen) {
        setSpotlightOpen(false);
        return;
      }

      if (meta && (e.key === "w" || e.key === "W") && phase === "desktop" && activeId) {
        e.preventDefault();
        closeWindow(activeId);
        return;
      }

      if (meta && (e.key === "m" || e.key === "M") && phase === "desktop" && activeId) {
        e.preventDefault();
        minimizeWindow(activeId);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, phase, spotlightOpen, activeId, closeWindow, minimizeWindow]);

  /* --------------------------------------- keep windows inside the viewport */
  useEffect(() => {
    if (!mounted) return;

    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setWindows((prev) =>
        prev.map((w) => {
          if (w.maximized) {
            return { ...w, x: 8, y: MENUBAR_HEIGHT + 6, w: vw - 16, h: vh - MENUBAR_HEIGHT - DOCK_RESERVE + 10 };
          }
          const width = Math.min(w.w, vw - 24);
          const height = Math.min(w.h, vh - MENUBAR_HEIGHT - 24);
          return {
            ...w,
            w: width,
            h: height,
            x: clamp(w.x, -width + 120, Math.max(12, vw - 120)),
            y: clamp(w.y, MENUBAR_HEIGHT + 4, Math.max(MENUBAR_HEIGHT + 4, vh - 80)),
          };
        })
      );
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mounted]);

  const openUrl = useCallback((href: string) => {
    if (href.startsWith("mailto:")) {
      window.location.href = href;
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  }, []);

  const value: DesktopValue = {
    mounted,
    phase,
    boot,
    lock,
    unlock,
    theme,
    setTheme,
    toggleTheme,
    wallpaper,
    setWallpaper,
    availableWallpapers,
    windows,
    activeId,
    openApp,
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    setGeom,
    closeAll,
    spotlightOpen,
    setSpotlightOpen,
    openUrl,
  };

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
}

export function useDesktop(): DesktopValue {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used inside <DesktopProvider>");
  return ctx;
}
