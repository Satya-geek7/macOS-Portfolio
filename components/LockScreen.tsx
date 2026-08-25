"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useNow } from "@/lib/use-now";
import { lockScreen, profile } from "@/lib/portfolio.config";

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const now = useNow(1000);
  const [value, setValue] = useState("");
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 480);
    return () => window.clearTimeout(id);
  }, []);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onUnlock, 460);
  };

  return (
    <div className={`lock${leaving ? " is-leaving" : ""}`}>
      <div className="lock-clock">
        <div className="lock-time">
          {now
            ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
            : "--:--"}
        </div>
        <div className="lock-date">
          {now
            ? now.toLocaleDateString([], {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            : ""}
        </div>
      </div>

      <div className="lock-avatar">{profile.initials}</div>
      <div className="lock-name">{profile.name}</div>

      <form
        className="lock-form"
        onSubmit={(e) => {
          e.preventDefault();
          enter();
        }}
      >
        <input
          ref={inputRef}
          className="lock-input"
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Password"
          aria-label="Password"
          autoComplete="off"
        />
        <button className="lock-go" type="submit" aria-label="Log in">
          <Icon name="chevron" size={14} />
        </button>
      </form>

      <div className="lock-hint">{lockScreen.hint}</div>
    </div>
  );
}
