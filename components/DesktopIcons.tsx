"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { useDesktop } from "@/lib/desktop-context";
import { apps, shortcuts } from "@/lib/app-registry";

export default function DesktopIcons() {
  const { openApp, openUrl } = useDesktop();
  const [selected, setSelected] = useState<string | null>(null);

  const desktopApps = apps.filter((a) => a.onDesktop);

  // Clicking anywhere that isn't an icon clears the selection. The container
  // can't do this itself — it is pointer-events: none so that clicks pass
  // through to the wallpaper and to windows behind it.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest(".desktop-icon")) return;
      setSelected(null);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div className="desktop-icons">
      {desktopApps.map((app) => (
        <IconButton
          key={app.id}
          id={app.id}
          label={app.label}
          icon={app.icon}
          gradient={app.gradient}
          selected={selected === app.id}
          onSelect={() => setSelected(app.id)}
          onOpen={() => openApp(app.id)}
        />
      ))}

      {shortcuts.map((s) => (
        <IconButton
          key={s.id}
          id={s.id}
          label={s.label}
          icon={s.icon}
          gradient={s.gradient}
          selected={selected === s.id}
          onSelect={() => setSelected(s.id)}
          onOpen={() => openUrl(s.href)}
        />
      ))}
    </div>
  );
}

function IconButton({
  id,
  label,
  icon,
  gradient,
  selected,
  onSelect,
  onOpen,
}: {
  id: string;
  label: string;
  icon: Parameters<typeof Icon>[0]["name"];
  gradient: [string, string];
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      className={`desktop-icon${selected ? " is-selected" : ""}`}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`${label} — press Enter to open`}
      data-icon-id={id}
    >
      <span
        className="icon-tile"
        style={{ background: `linear-gradient(150deg, ${gradient[0]}, ${gradient[1]})` }}
      >
        <Icon name={icon} size={26} />
      </span>
      <span className="icon-label">{label}</span>
    </button>
  );
}
