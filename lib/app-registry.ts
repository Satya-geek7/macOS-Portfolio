/* ============================================================================
 *  app-registry.ts — metadata for every "application" on the desktop.
 *  Pure data (no JSX) so it can be imported from anywhere without cycles.
 *  The id -> component mapping lives in components/apps/AppSurface.tsx.
 * ==========================================================================*/

import { projects } from "./portfolio.config";

export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "terminal"
  | "contact"
  | "resume"
  | "notes"
  | "settings";

export type IconKey =
  | "user"
  | "folder"
  | "sparkles"
  | "terminal"
  | "mail"
  | "doc"
  | "note"
  | "gear"
  | "github"
  | "linkedin"
  | "globe";

export type AppDef = {
  id: AppId;
  /** Shown in the window title bar and the menu bar when focused. */
  title: string;
  /** Shown under the desktop icon (can be shorter). */
  label: string;
  icon: IconKey;
  /** Icon tile gradient: [from, to]. */
  gradient: [string, string];
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  onDesktop: boolean;
  inDock: boolean;
  /** Extra terms Spotlight should match on. */
  keywords: string[];
  /** Decorative menu-bar titles shown while this app is focused. */
  menus: string[];
};

export const apps: AppDef[] = [
  {
    id: "about",
    title: "About Me",
    label: "About Me",
    icon: "user",
    gradient: ["#6aa8ff", "#3b6fe0"],
    width: 760,
    height: 540,
    minWidth: 420,
    minHeight: 340,
    onDesktop: true,
    inDock: true,
    keywords: ["bio", "who", "intro", "profile", "me"],
    menus: ["File", "Edit", "View", "Window", "Help"],
  },
  {
    id: "projects",
    title: "Projects",
    label: "Projects",
    icon: "folder",
    gradient: ["#63c8ff", "#2b8ce8"],
    width: 900,
    height: 580,
    minWidth: 560,
    minHeight: 380,
    onDesktop: true,
    inDock: true,
    keywords: ["work", "portfolio", "case studies", "builds", "repos"],
    menus: ["File", "Edit", "View", "Go", "Window", "Help"],
  },
  {
    id: "skills",
    title: "Skills",
    label: "Skills",
    icon: "sparkles",
    gradient: ["#b07cff", "#7a3fe0"],
    width: 720,
    height: 560,
    minWidth: 440,
    minHeight: 360,
    onDesktop: true,
    inDock: true,
    keywords: ["stack", "tech", "languages", "tools", "abilities"],
    menus: ["File", "View", "Window", "Help"],
  },
  {
    id: "terminal",
    title: "Terminal",
    label: "Terminal",
    icon: "terminal",
    gradient: ["#2f3238", "#14161a"],
    width: 720,
    height: 460,
    minWidth: 420,
    minHeight: 260,
    onDesktop: true,
    inDock: true,
    keywords: ["shell", "cli", "bash", "console", "commands"],
    menus: ["Shell", "Edit", "View", "Window", "Help"],
  },
  {
    id: "resume",
    title: "Resume.pdf",
    label: "Resume",
    icon: "doc",
    gradient: ["#ff7a7a", "#e0453f"],
    width: 780,
    height: 620,
    minWidth: 460,
    minHeight: 380,
    onDesktop: true,
    inDock: true,
    keywords: ["cv", "experience", "pdf", "career", "history"],
    menus: ["File", "Edit", "View", "Window", "Help"],
  },
  {
    id: "notes",
    title: "Journal",
    label: "Journal",
    icon: "note",
    gradient: ["#ffd166", "#f0a33c"],
    width: 820,
    height: 540,
    minWidth: 520,
    minHeight: 340,
    onDesktop: true,
    inDock: true,
    keywords: ["writing", "blog", "posts", "essays", "notes"],
    menus: ["File", "Edit", "View", "Window", "Help"],
  },
  {
    id: "contact",
    title: "Contact",
    label: "Contact Me",
    icon: "mail",
    gradient: ["#4ee0b0", "#17a97f"],
    width: 660,
    height: 540,
    minWidth: 420,
    minHeight: 380,
    onDesktop: true,
    inDock: true,
    keywords: ["email", "hire", "reach", "message", "get in touch"],
    menus: ["File", "Edit", "Window", "Help"],
  },
  {
    id: "settings",
    title: "System Settings",
    label: "Settings",
    icon: "gear",
    gradient: ["#9aa4b2", "#5d6875"],
    width: 700,
    height: 520,
    minWidth: 460,
    minHeight: 380,
    onDesktop: true,
    inDock: true,
    keywords: ["wallpaper", "theme", "appearance", "preferences", "dark mode"],
    menus: ["File", "Edit", "View", "Window", "Help"],
  },
];

export const appMap: Record<AppId, AppDef> = apps.reduce((acc, app) => {
  acc[app.id] = app;
  return acc;
}, {} as Record<AppId, AppDef>);

export function getApp(id: AppId): AppDef {
  return appMap[id];
}

/** Desktop shortcuts that just open a URL instead of a window. */
export type Shortcut = {
  id: string;
  label: string;
  href: string;
  icon: IconKey;
  gradient: [string, string];
};

export const shortcuts: Shortcut[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com",
    icon: "github",
    gradient: ["#3a3f47", "#181b20"],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "linkedin",
    gradient: ["#3f96e8", "#0a66c2"],
  },
];

/* ----------------------------------------------------------- spotlight ---- */

export type SpotlightItem = {
  key: string;
  title: string;
  subtitle: string;
  kind: "Application" | "Project" | "Shortcut" | "Action";
  icon: IconKey;
  gradient: [string, string];
  /** Either open an app window, optionally deep-linking to a record, or open a URL. */
  target: { type: "app"; id: AppId; focusId?: string } | { type: "url"; href: string } | { type: "action"; action: "theme" | "lock" };
  haystack: string;
};

export function buildSpotlightIndex(): SpotlightItem[] {
  const items: SpotlightItem[] = [];

  for (const app of apps) {
    items.push({
      key: `app:${app.id}`,
      title: app.title,
      subtitle: "Application",
      kind: "Application",
      icon: app.icon,
      gradient: app.gradient,
      target: { type: "app", id: app.id },
      haystack: [app.title, app.label, ...app.keywords].join(" ").toLowerCase(),
    });
  }

  for (const p of projects) {
    items.push({
      key: `project:${p.id}`,
      title: p.name,
      subtitle: `${p.tagline} · ${p.year}`,
      kind: "Project",
      icon: "folder",
      gradient: [p.accent, p.accent],
      target: { type: "app", id: "projects", focusId: p.id },
      haystack: [p.name, p.tagline, p.role, p.description, ...p.stack].join(" ").toLowerCase(),
    });
  }

  for (const s of shortcuts) {
    items.push({
      key: `shortcut:${s.id}`,
      title: s.label,
      subtitle: s.href.replace(/^https?:\/\//, ""),
      kind: "Shortcut",
      icon: s.icon,
      gradient: s.gradient,
      target: { type: "url", href: s.href },
      haystack: `${s.label} ${s.href}`.toLowerCase(),
    });
  }

  items.push({
    key: "action:theme",
    title: "Toggle Appearance",
    subtitle: "Switch between light and dark",
    kind: "Action",
    icon: "gear",
    gradient: ["#9aa4b2", "#5d6875"],
    target: { type: "action", action: "theme" },
    haystack: "toggle appearance theme dark light mode switch",
  });

  items.push({
    key: "action:lock",
    title: "Lock Screen",
    subtitle: "Return to the login screen",
    kind: "Action",
    icon: "user",
    gradient: ["#6aa8ff", "#3b6fe0"],
    target: { type: "action", action: "lock" },
    haystack: "lock screen logout sign out login",
  });

  return items;
}
