"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDesktop } from "@/lib/desktop-context";
import { apps, type AppId } from "@/lib/app-registry";
import {
  experience,
  notes,
  profile,
  projects,
  skillGroups,
  socials,
} from "@/lib/portfolio.config";

/* ---------------------------------------------------------------- helpers */

type Block = { id: number; cmd: string | null; body: ReactNode };

const FILES = ["about.txt", "projects.md", "skills.json", "resume.pdf", "contact.txt"];

const COMMANDS = [
  "help",
  "about",
  "projects",
  "project",
  "skills",
  "experience",
  "notes",
  "contact",
  "open",
  "resume",
  "theme",
  "ls",
  "cat",
  "whoami",
  "date",
  "echo",
  "neofetch",
  "clear",
  "sudo",
  "exit",
];

const LOGO = `   ▄▄▄▄▄▄▄▄▄
 ▄█████████████▄
███████████████████
███████████████████
███████████████████
 ▀█████████████▀
   ▀▀▀▀▀▀▀▀▀`;

export default function TerminalApp({ nonce }: { nonce: number }) {
  const { openApp, theme, setTheme, closeWindow, openUrl } = useDesktop();

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histCursor, setHistCursor] = useState<number | null>(null);

  const seq = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (cmd: string | null, body: ReactNode) => {
    seq.current += 1;
    setBlocks((prev) => [...prev, { id: seq.current, cmd, body }]);
  };

  /* Greeting, replayed whenever the window is re-opened. */
  useEffect(() => {
    seq.current += 1;
    setBlocks([
      {
        id: seq.current,
        cmd: null,
        body: (
          <>
            <div className="term-line term-dim">
              Last login: {new Date().toLocaleString()} on ttys001
            </div>
            <div className="term-line" style={{ marginTop: 8 }}>
              <span className="term-bold">{profile.name}</span>
              <span className="term-dim"> — {profile.role}</span>
            </div>
            <div className="term-line term-dim">
              Type <span className="term-accent">help</span> to see what this shell can do. Tab
              completes, ↑ recalls.
            </div>
          </>
        ),
      },
    ]);
  }, [nonce]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [blocks]);

  /* ------------------------------------------------------------ execution */
  const exec = (raw: string) => {
    const line = raw.trim();
    if (!line) {
      push("", null);
      return;
    }

    setHistory((h) => [...h, line]);
    setHistCursor(null);

    const [cmd, ...args] = line.split(/\s+/);
    const arg = args.join(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        push(line, <HelpTable />);
        break;

      case "clear":
        seq.current = 0;
        setBlocks([]);
        return;

      case "whoami":
        push(
          line,
          <>
            <div className="term-line">{profile.name.toLowerCase().replace(/\s+/g, "")}</div>
            <div className="term-line term-dim">
              {profile.role} · {profile.location}
            </div>
          </>
        );
        break;

      case "about":
        push(
          line,
          <>
            {profile.bio.map((p, i) => (
              <div key={i} className="term-line term-out" style={{ marginBottom: 8 }}>
                {p}
              </div>
            ))}
          </>
        );
        break;

      case "ls":
        push(
          line,
          <div className="term-line">
            {FILES.map((f) => (
              <span key={f} className={f.endsWith(".pdf") ? "term-err" : "term-accent"}>
                {f}
                {"   "}
              </span>
            ))}
          </div>
        );
        break;

      case "cat": {
        if (!arg) {
          push(line, <div className="term-line term-err">cat: missing file operand</div>);
          break;
        }
        const target = arg.toLowerCase();
        if (!FILES.includes(target)) {
          push(
            line,
            <div className="term-line term-err">
              cat: {arg}: No such file or directory
            </div>
          );
          break;
        }
        if (target === "about.txt") {
          push(line, <div className="term-line term-out">{profile.bio[0]}</div>);
        } else if (target === "projects.md") {
          push(
            line,
            <>
              {projects.map((p) => (
                <div key={p.id} className="term-line term-out">
                  <span className="term-bold">## {p.name}</span> — {p.tagline}
                </div>
              ))}
            </>
          );
        } else if (target === "skills.json") {
          push(
            line,
            <div className="term-line term-out">
              {JSON.stringify(
                Object.fromEntries(
                  skillGroups.map((g) => [g.name, g.skills.map((s) => s.name)])
                ),
                null,
                2
              )}
            </div>
          );
        } else if (target === "resume.pdf") {
          push(
            line,
            <>
              <div className="term-line term-warn">
                resume.pdf is a binary file. Opening in Preview…
              </div>
            </>
          );
          openApp("resume");
        } else {
          push(
            line,
            <>
              <div className="term-line term-out">{profile.email}</div>
              {socials.map((s) => (
                <div key={s.label} className="term-line term-out">
                  {s.label.padEnd(10)} {s.href}
                </div>
              ))}
            </>
          );
        }
        break;
      }

      case "projects":
        push(
          line,
          <div className="term-table">
            {projects.map((p) => (
              <div key={p.id} style={{ display: "contents" }}>
                <span className="term-accent">{p.name}</span>
                <span className="term-out">
                  {p.tagline} <span className="term-dim">· {p.year}</span>
                </span>
              </div>
            ))}
          </div>
        );
        break;

      case "project": {
        const found = projects.find(
          (p) => p.id === arg.toLowerCase() || p.name.toLowerCase() === arg.toLowerCase()
        );
        if (!found) {
          push(
            line,
            <div className="term-line term-err">
              project: {arg || "(none)"}: not found. Try <span className="term-accent">projects</span>.
            </div>
          );
          break;
        }
        push(
          line,
          <>
            <div className="term-line term-bold">{found.name}</div>
            <div className="term-line term-dim">
              {found.role} · {found.year} · {found.status}
            </div>
            <div className="term-line term-out" style={{ marginTop: 6 }}>
              {found.description}
            </div>
            <div className="term-line term-accent" style={{ marginTop: 6 }}>
              {found.stack.join(" · ")}
            </div>
          </>
        );
        openApp("projects", found.id);
        break;
      }

      case "skills":
        push(
          line,
          <>
            {skillGroups.map((g) => (
              <div key={g.name} style={{ marginBottom: 6 }}>
                <div className="term-line term-bold">{g.name}</div>
                {g.skills.map((s) => (
                  <div key={s.name} className="term-line term-out">
                    {s.name.padEnd(20, " ")}
                    <span className="term-ok">{"█".repeat(Math.round(s.level / 10))}</span>
                    <span className="term-dim">{"░".repeat(10 - Math.round(s.level / 10))}</span>
                    <span className="term-dim"> {s.level}</span>
                  </div>
                ))}
              </div>
            ))}
          </>
        );
        break;

      case "experience":
        push(
          line,
          <>
            {experience.map((job) => (
              <div key={job.company} style={{ marginBottom: 8 }}>
                <div className="term-line">
                  <span className="term-bold">{job.role}</span>
                  <span className="term-dim"> @ {job.company}</span>
                </div>
                <div className="term-line term-dim">
                  {job.period} · {job.location}
                </div>
              </div>
            ))}
          </>
        );
        break;

      case "notes":
        push(
          line,
          <div className="term-table">
            {notes.map((n) => (
              <div key={n.id} style={{ display: "contents" }}>
                <span className="term-dim">{n.date}</span>
                <span className="term-accent">{n.title}</span>
              </div>
            ))}
          </div>
        );
        break;

      case "contact":
        push(
          line,
          <>
            <div className="term-line term-out">{profile.email}</div>
            <div className="term-line term-dim">Opening Contact…</div>
          </>
        );
        openApp("contact");
        break;

      case "resume":
        push(line, <div className="term-line term-dim">Opening Resume.pdf in Preview…</div>);
        openApp("resume");
        break;

      case "open": {
        const id = arg.toLowerCase().replace(/\.app$/, "");
        const match = apps.find((a) => a.id === id || a.title.toLowerCase() === id);
        if (match) {
          push(line, <div className="term-line term-dim">Opening {match.title}…</div>);
          openApp(match.id as AppId);
        } else if (id === "github" || id === "linkedin") {
          const social = socials.find((s) => s.label.toLowerCase() === id);
          push(line, <div className="term-line term-dim">Opening {social?.href}…</div>);
          if (social) openUrl(social.href);
        } else {
          push(
            line,
            <div className="term-line term-err">
              open: {arg || "(none)"}: unknown application. Available:{" "}
              <span className="term-accent">{apps.map((a) => a.id).join(", ")}</span>
            </div>
          );
        }
        break;
      }

      case "theme": {
        const want = arg.toLowerCase();
        if (want === "light" || want === "dark") {
          setTheme(want);
          push(line, <div className="term-line term-ok">Appearance set to {want}.</div>);
        } else if (!want || want === "toggle") {
          const next = theme === "light" ? "dark" : "light";
          setTheme(next);
          push(line, <div className="term-line term-ok">Appearance set to {next}.</div>);
        } else {
          push(
            line,
            <div className="term-line term-err">theme: expected “light”, “dark” or “toggle”</div>
          );
        }
        break;
      }

      case "date":
        push(line, <div className="term-line term-out">{new Date().toString()}</div>);
        break;

      case "echo":
        push(line, <div className="term-line term-out">{arg}</div>);
        break;

      case "neofetch":
        push(
          line,
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <pre className="term-logo">{LOGO}</pre>
            <div>
              <div className="term-line term-ok term-bold">
                {profile.name.toLowerCase().replace(/\s+/g, "")}@portfolio
              </div>
              <div className="term-line term-dim">─────────────────────</div>
              {[
                ["OS", "PortfolioOS 1.0 (Next.js)"],
                ["Shell", "psh 1.0"],
                ["Role", profile.role],
                ["Location", profile.location],
                ["Uptime", "7 years"],
                ["Projects", `${projects.length} shipped`],
                ["Theme", theme],
              ].map(([k, v]) => (
                <div key={k} className="term-line">
                  <span className="term-accent">{k}</span>
                  <span className="term-out">: {v}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "sudo":
        push(
          line,
          <div className="term-line term-warn">
            Nice try. {profile.name.split(" ")[0]} is not in the sudoers file. This incident has
            been logged.
          </div>
        );
        break;

      case "exit":
        push(line, <div className="term-line term-dim">logout</div>);
        window.setTimeout(() => closeWindow("terminal"), 420);
        break;

      default:
        push(
          line,
          <div className="term-line term-err">
            psh: command not found: {cmd}. Try <span className="term-accent">help</span>.
          </div>
        );
    }
  };

  /* ------------------------------------------------------------- keyboard */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      exec(input);
      setInput("");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = histCursor === null ? history.length - 1 : Math.max(0, histCursor - 1);
      setHistCursor(next);
      setInput(history[next]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histCursor === null) return;
      const next = histCursor + 1;
      if (next >= history.length) {
        setHistCursor(null);
        setInput("");
      } else {
        setHistCursor(next);
        setInput(history[next]);
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(/\s+/);

      if (parts.length <= 1) {
        const matches = COMMANDS.filter((c) => c.startsWith(parts[0]?.toLowerCase() ?? ""));
        if (matches.length === 1) setInput(matches[0] + " ");
        else if (matches.length > 1)
          push(input, <div className="term-line term-dim">{matches.join("   ")}</div>);
        return;
      }

      const base = parts[0].toLowerCase();
      const partial = parts[parts.length - 1].toLowerCase();
      const pool =
        base === "cat"
          ? FILES
          : base === "open"
            ? [...apps.map((a) => a.id), "github", "linkedin"]
            : base === "project"
              ? projects.map((p) => p.id)
              : base === "theme"
                ? ["light", "dark", "toggle"]
                : [];

      const matches = pool.filter((p) => p.startsWith(partial));
      if (matches.length === 1) {
        setInput([...parts.slice(0, -1), matches[0]].join(" ") + " ");
      } else if (matches.length > 1) {
        push(input, <div className="term-line term-dim">{matches.join("   ")}</div>);
      }
      return;
    }

    if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      seq.current = 0;
      setBlocks([]);
    }
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-scroll" ref={scrollRef}>
        {blocks.map((b) => (
          <div key={b.id}>
            {b.cmd !== null && (
              <div className="term-prompt-line">
                <Ps1 />
                <span className="term-cmd">{b.cmd}</span>
              </div>
            )}
            {b.body}
          </div>
        ))}

        <div className="term-input-row">
          <Ps1 />
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}

function Ps1() {
  return (
    <span className="term-ps1">
      {profile.name.split(" ")[0].toLowerCase()}@portfolio <span className="term-path">~</span> $
    </span>
  );
}

function HelpTable() {
  const rows: [string, string][] = [
    ["about", "who I am, the long version"],
    ["projects", "list every project"],
    ["project <id>", "open one project in the Projects window"],
    ["skills", "skill levels as bar charts"],
    ["experience", "roles and dates"],
    ["notes", "list journal entries"],
    ["resume", "open Resume.pdf in Preview"],
    ["contact", "how to reach me"],
    ["open <app>", "launch any app window"],
    ["theme <light|dark>", "change appearance"],
    ["ls", "list files"],
    ["cat <file>", "print a file"],
    ["neofetch", "system summary"],
    ["whoami / date / echo", "the usual"],
    ["clear", "clear the screen (⌘L)"],
    ["exit", "close this window"],
  ];

  return (
    <div className="term-table">
      {rows.map(([cmd, desc]) => (
        <div key={cmd} style={{ display: "contents" }}>
          <span className="term-accent">{cmd}</span>
          <span className="term-out">{desc}</span>
        </div>
      ))}
    </div>
  );
}
