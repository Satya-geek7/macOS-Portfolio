"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { useDesktop } from "@/lib/desktop-context";
import { buildSpotlightIndex, type SpotlightItem } from "@/lib/app-registry";

/**
 * Subsequence match with a light relevance score: prefix hits rank above
 * word-boundary hits, which rank above scattered matches.
 */
function score(item: SpotlightItem, query: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const title = item.title.toLowerCase();

  if (title === q) return 1000;
  if (title.startsWith(q)) return 800 - title.length;
  if (title.includes(q)) return 600 - title.indexOf(q);
  if (item.haystack.includes(q)) return 400 - item.haystack.indexOf(q) / 100;

  // Fall back to a loose subsequence over the title.
  let cursor = 0;
  for (const ch of q) {
    const found = title.indexOf(ch, cursor);
    if (found === -1) return 0;
    cursor = found + 1;
  }
  return 120;
}

export default function Spotlight() {
  const { spotlightOpen, setSpotlightOpen, openApp, openUrl, toggleTheme, lock } = useDesktop();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const index = useMemo(() => buildSpotlightIndex(), []);

  const results = useMemo(() => {
    return index
      .map((item) => ({ item, s: score(item, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 9)
      .map((r) => r.item);
  }, [index, query]);

  useEffect(() => {
    if (!spotlightOpen) return;
    setQuery("");
    setCursor(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [spotlightOpen]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    const active = listRef.current?.querySelector(".spotlight-row.is-active");
    active?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!spotlightOpen) return null;

  const choose = (item: SpotlightItem | undefined) => {
    if (!item) return;
    setSpotlightOpen(false);

    if (item.target.type === "app") {
      openApp(item.target.id, item.target.focusId);
    } else if (item.target.type === "url") {
      openUrl(item.target.href);
    } else if (item.target.action === "theme") {
      toggleTheme();
    } else if (item.target.action === "lock") {
      lock();
    }
  };

  // Gather each kind into a single group, in the order the kinds first appear.
  // Results are sorted by score, so a kind can reappear further down the list;
  // merging keeps one heading per kind and keeps the group keys unique.
  const groups: { kind: string; items: SpotlightItem[] }[] = [];
  for (const item of results) {
    const bucket = groups.find((g) => g.kind === item.kind);
    if (bucket) bucket.items.push(item);
    else groups.push({ kind: item.kind, items: [item] });
  }

  // Grouping reorders rows relative to `results`, so arrow keys and Enter walk
  // this flattened list instead — the cursor always matches what is highlighted.
  const ordered = groups.flatMap((g) => g.items);

  let flatIndex = -1;

  return (
    <div
      className="spotlight-scrim"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSpotlightOpen(false);
      }}
    >
      <div className="spotlight" role="dialog" aria-modal="true" aria-label="Spotlight search">
        <div className="spotlight-field">
          <Icon name="search" size={21} />
          <input
            ref={inputRef}
            className="spotlight-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, projects and actions"
            aria-label="Spotlight search"
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.max(0, Math.min(c + 1, ordered.length - 1)));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                choose(ordered[cursor]);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setSpotlightOpen(false);
              }
            }}
          />
          <span className="spotlight-esc">esc</span>
        </div>

        {results.length > 0 ? (
          <div className="spotlight-results scroll-area" ref={listRef}>
            {groups.map((group) => (
              <div key={group.kind}>
                <div className="spotlight-group">{group.kind}s</div>
                {group.items.map((item) => {
                  flatIndex += 1;
                  const myIndex = flatIndex;
                  return (
                    <button
                      key={item.key}
                      className={`spotlight-row${myIndex === cursor ? " is-active" : ""}`}
                      onPointerEnter={() => setCursor(myIndex)}
                      onClick={() => choose(item)}
                    >
                      <span
                        className="spotlight-tile"
                        style={{
                          background: `linear-gradient(150deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                        }}
                      >
                        <Icon name={item.icon} size={16} />
                      </span>
                      <span className="spotlight-text">
                        <span className="spotlight-title">{item.title}</span>
                        <span className="spotlight-sub">{item.subtitle}</span>
                      </span>
                      <span className="spotlight-kind">
                        {myIndex === cursor ? "↵" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="spotlight-results">
            <div className="spotlight-empty">No results for “{query}”</div>
          </div>
        )}
      </div>
    </div>
  );
}
