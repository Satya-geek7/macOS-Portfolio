"use client";

import { useState, type ReactNode } from "react";
import Icon from "./Icon";
import { useDesktop } from "@/lib/desktop-context";
import { useNow } from "@/lib/use-now";
import { getApp } from "@/lib/app-registry";
import { profile } from "@/lib/portfolio.config";

type Row =
  | { kind: "item"; label: string; shortcut?: string; onSelect?: () => void; disabled?: boolean }
  | { kind: "sep" }
  | { kind: "heading"; label: string };

export default function MenuBar() {
  const {
    activeId,
    openApp,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    closeAll,
    theme,
    toggleTheme,
    lock,
    boot,
    setSpotlightOpen,
    windows,
  } = useDesktop();

  const [open, setOpen] = useState<string | null>(null);
  const now = useNow(1000);

  const activeApp = activeId ? getApp(activeId) : null;
  const appTitle = activeApp ? activeApp.title : "Finder";

  const run = (fn?: () => void) => {
    setOpen(null);
    fn?.();
  };

  const brandRows: Row[] = [
    { kind: "item", label: "About This Portfolio", onSelect: () => openApp("about") },
    { kind: "sep" },
    { kind: "item", label: "System Settings…", onSelect: () => openApp("settings") },
    {
      kind: "item",
      label: theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode",
      onSelect: toggleTheme,
    },
    { kind: "sep" },
    { kind: "item", label: "Close All Windows", onSelect: closeAll, disabled: windows.length === 0 },
    { kind: "item", label: "Restart", onSelect: boot },
    { kind: "item", label: "Lock Screen", onSelect: lock },
  ];

  const appRows = (menu: string): Row[] => {
    switch (menu) {
      case "File":
      case "Shell":
        return [
          { kind: "item", label: "New Window", onSelect: () => activeId && openApp(activeId) },
          { kind: "sep" },
          {
            kind: "item",
            label: "Close Window",
            shortcut: "⌘W",
            onSelect: () => activeId && closeWindow(activeId),
            disabled: !activeId,
          },
          {
            kind: "item",
            label: "Print…",
            shortcut: "⌘P",
            onSelect: () => window.print(),
          },
        ];
      case "Window":
        return [
          {
            kind: "item",
            label: "Minimize",
            shortcut: "⌘M",
            onSelect: () => activeId && minimizeWindow(activeId),
            disabled: !activeId,
          },
          {
            kind: "item",
            label: "Zoom",
            onSelect: () => activeId && toggleMaximize(activeId),
            disabled: !activeId,
          },
          { kind: "sep" },
          { kind: "item", label: "Bring All to Front", disabled: true },
        ];
      case "Edit":
        return [
          { kind: "item", label: "Undo", shortcut: "⌘Z", disabled: true },
          { kind: "item", label: "Redo", shortcut: "⇧⌘Z", disabled: true },
          { kind: "sep" },
          { kind: "item", label: "Cut", shortcut: "⌘X", disabled: true },
          { kind: "item", label: "Copy", shortcut: "⌘C", disabled: true },
          { kind: "item", label: "Paste", shortcut: "⌘V", disabled: true },
        ];
      case "View":
        return [
          { kind: "item", label: "Show Spotlight", shortcut: "⌘K", onSelect: () => setSpotlightOpen(true) },
          { kind: "sep" },
          { kind: "item", label: "Enter Full Screen", onSelect: () => activeId && toggleMaximize(activeId), disabled: !activeId },
        ];
      case "Go":
        return [
          { kind: "heading", label: "Applications" },
          { kind: "item", label: "Projects", onSelect: () => openApp("projects") },
          { kind: "item", label: "Journal", onSelect: () => openApp("notes") },
          { kind: "item", label: "Terminal", onSelect: () => openApp("terminal") },
        ];
      default:
        return [
          { kind: "item", label: `${appTitle} Help`, disabled: true },
          { kind: "sep" },
          { kind: "item", label: "Open Terminal and type 'help'", onSelect: () => openApp("terminal") },
        ];
    }
  };

  return (
    <>
      {open && <div className="menu-scrim" onClick={() => setOpen(null)} />}

      <div className="menubar">
        <MenuButton
          id="brand"
          open={open}
          setOpen={setOpen}
          label={<Icon name="apple" size={15} />}
          ariaLabel="System menu"
          rows={brandRows}
          run={run}
        />

        <MenuButton
          id="app"
          open={open}
          setOpen={setOpen}
          label={appTitle}
          bold
          rows={[
            { kind: "item", label: `About ${appTitle}`, onSelect: () => openApp("about") },
            { kind: "sep" },
            { kind: "item", label: "Preferences…", onSelect: () => openApp("settings") },
            { kind: "sep" },
            {
              kind: "item",
              label: `Quit ${appTitle}`,
              shortcut: "⌘Q",
              onSelect: () => activeId && closeWindow(activeId),
              disabled: !activeId,
            },
          ]}
          run={run}
        />

        {/* Grouped so the narrow breakpoint can drop the decorative menus and
            keep the brand menu and the app name, which do real work. */}
        <div className="menubar-appmenus">
          {(activeApp?.menus ?? ["File", "Edit", "View", "Window", "Help"]).map((m) => (
            <MenuButton
              key={m}
              id={`m-${m}`}
              open={open}
              setOpen={setOpen}
              label={m}
              rows={appRows(m)}
              run={run}
            />
          ))}
        </div>

        <div className="menubar-spacer" />

        <div className="menubar-right">
          <button
            className="menubar-item"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            title="Toggle appearance"
          >
            <Icon name={theme === "light" ? "sun" : "moon"} size={15} />
          </button>

          <button
            className="menubar-item"
            onClick={() => setSpotlightOpen(true)}
            aria-label="Open Spotlight search"
            title="Spotlight (⌘K)"
          >
            <Icon name="search" size={14} />
          </button>

          <span className="menubar-item menubar-status" aria-hidden="true">
            <Icon name="wifi" size={15} />
          </span>
          <span className="menubar-item menubar-status" aria-hidden="true">
            <Icon name="battery" size={17} />
          </span>

          <span className="menubar-item menubar-clock">
            {now ? (
              <>
                <span className="clock-long">
                  {now.toLocaleDateString([], {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </>
            ) : (
              profile.timezone
            )}
          </span>
        </div>
      </div>
    </>
  );
}

function MenuButton({
  id,
  label,
  ariaLabel,
  bold,
  rows,
  open,
  setOpen,
  run,
  alignRight,
}: {
  id: string;
  label: ReactNode;
  ariaLabel?: string;
  bold?: boolean;
  rows: Row[];
  open: string | null;
  setOpen: (v: string | null) => void;
  run: (fn?: () => void) => void;
  alignRight?: boolean;
}) {
  const isOpen = open === id;

  return (
    <div className="menu-anchor">
      <button
        className={`menubar-item${bold ? " is-bold" : ""}${isOpen ? " is-open" : ""}`}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setOpen(isOpen ? null : id)}
        onPointerEnter={() => open && !isOpen && setOpen(id)}
      >
        {label}
      </button>

      {isOpen && (
        <div className={`menu-dropdown${alignRight ? " is-right" : ""}`} role="menu">
          {rows.map((row, i) => {
            if (row.kind === "sep") return <div key={i} className="menu-sep" />;
            if (row.kind === "heading")
              return (
                <div key={i} className="menu-heading">
                  {row.label}
                </div>
              );
            return (
              <button
                key={i}
                className="menu-row"
                role="menuitem"
                disabled={row.disabled}
                onClick={() => run(row.onSelect)}
              >
                <span>{row.label}</span>
                {row.shortcut && <span className="menu-shortcut">{row.shortcut}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
