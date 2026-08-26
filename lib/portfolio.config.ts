/* ============================================================================
 *  portfolio.config.ts  —  EDIT THIS FILE. NOTHING ELSE REQUIRED.
 * ----------------------------------------------------------------------------
 *  Every piece of human-readable content in the portfolio lives here.
 *  Replace the placeholder persona below with your own details and the whole
 *  desktop (windows, dock, terminal, spotlight, resume) updates itself.
 * ==========================================================================*/

/* ---------------------------------------------------------------- types --- */

export type Link = { label: string; href: string };

export type Project = {
  id: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  status: "Shipped" | "In progress" | "Archived" | "Experiment";
  accent: string;
  stack: string[];
  description: string;
  highlights: string[];
  links: Link[];
};

export type SkillGroup = {
  name: string;
  blurb: string;
  skills: { name: string; level: number }[]; // level: 0-100
};

export type Job = {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
};

export type Note = {
  id: string;
  title: string;
  date: string;
  preview: string;
  body: string[];
};

export type Track = { title: string; artist: string; album: string; length: number };

/* ------------------------------------------------------------- identity --- */

export const profile = {
  name: "Satya Prakash Behera",
  initials: "SPB",
  role: "Frontend/Full-Stack Engineer",
  location: "Bhubaneswar, Odisha, India",
  timezone: "IST (UTC+5:30)",
  available: true,
  availabilityNote: "Open to frontend / product engineering roles",
  email: "the.satyabehera@gmail.com",
  tagline: "I build software that feels like a place, not a form.",
  bio: [
    "I'm a full-stack engineer with seven years spent mostly on the parts of a product people actually touch. My favourite work sits at the seam between engineering and design: interaction models, motion, state machines, the small details that decide whether software feels trustworthy.",
    "Before this I studied computer science, spent two years doing backend work at a payments company, and slowly discovered that I care more about interfaces than infrastructure. I still write the backend. I just enjoy the frontend more.",
    "Outside of work I restore mechanical keyboards, cook a lot of South Indian food badly, and maintain a couple of open-source tools that a surprising number of people depend on.",
  ],
  facts: [
    { label: "Experience", value: "Fresher" },
    { label: "Based in", value: "Bhubaneswar" },
    { label: "Focus", value: "Frontend architecture" },
    { label: "Open to", value: "Full-time & Internship" },
  ],
  currently: [
    "Building a collaborative canvas with CRDTs and a lot of opinions about cursors",
    "Reading Designing Data-Intensive Applications, for the third time",
    "Learning Rust properly instead of pretending to know it",
  ],
};

/* ---------------------------------------------------------------- social --- */

export const socials: (Link & { icon: "github" | "linkedin" | "Gmail" | "x" | "globe" })[] = [
  { label: "GitHub", href: "https://github.com/Satya-geek7", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/satyaprbehera", icon: "linkedin" },
  { label: "Email", href: "mailto:the.satyabehera@gmail.com", icon: "Gmail" },
  { label: "Website", href: "https://example.com", icon: "globe" },
];

/* -------------------------------------------------------------- projects --- */

export const projects: Project[] = [
  {
    id: "atlas",
    name: "Atlas",
    tagline: "A collaborative canvas that survives bad wifi",
    year: "2026",
    role: "Lead engineer",
    status: "In progress",
    accent: "#4f8cff",
    stack: ["TypeScript", "React", "Next.js", "Express.js", "Postgres"],
    description:
      "Atlas is a multiplayer whiteboard built around conflict-free replicated data types, so two people editing the same shape on the same flaky train wifi converge on the same document instead of fighting each other. The rendering layer is a custom canvas scene graph rather than DOM nodes, which is what makes 20,000 shapes stay at 60fps.",
    highlights: [
      "Custom CRDT layer on top of Yjs that cut sync payloads by 62%",
      "Canvas scene graph with dirty-rect redraw; holds 60fps at 20k shapes",
      "Offline-first: full editing with no connection, reconciled on reconnect",
      "Presence system with interpolated remote cursors at 30Hz",
    ],
    links: [
      { label: "Source", href: "https://github.com/Satya-geek7" },
      { label: "Live demo", href: "https://example.com" },
    ],
  },
  {
    id: "kettle",
    name: "Kettle",
    tagline: "Build-time state machine compiler",
    year: "2025",
    role: "Creator & maintainer",
    status: "Shipped",
    accent: "#f2994a",
    stack: ["TypeScript", "Vite", "Node", "AST tooling"],
    description:
      "Kettle takes a declarative state chart and compiles it into a plain, dependency-free reducer at build time. No runtime interpreter, no 40kb library in your bundle, and full exhaustiveness checking on transitions because the generated types make impossible states unrepresentable.",
    highlights: [
      "Zero runtime footprint: charts compile to plain functions",
      "Generated discriminated unions catch invalid transitions at compile time",
      "Used in production by four teams; 3.1k stars",
      "Visual chart inspector that reads the compiled output",
    ],
    links: [
      { label: "Source", href: "https://github.com" },
      { label: "Docs", href: "https://example.com" },
    ],
  },
  {
    id: "ledgerlite",
    name: "LedgerLite",
    tagline: "Double-entry accounting for people who hate accounting",
    year: "2024",
    role: "Full-stack engineer",
    status: "Shipped",
    accent: "#27ae60",
    stack: ["Next.js", "Postgres", "Prisma", "Stripe", "Redis"],
    description:
      "A bookkeeping tool for freelancers that hides real double-entry accounting behind an interface that only ever asks you plain questions. Every transaction is an immutable append-only journal entry, so the books are auditable, but the user never sees the word 'debit'.",
    highlights: [
      "Immutable append-only journal with derived balance projections",
      "Bank reconciliation that matches 94% of transactions automatically",
      "Cut invoice-to-payment time for pilot users from 19 days to 6",
      "Handles multi-currency with historical FX snapshots per entry",
    ],
    links: [{ label: "Case study", href: "https://example.com" }],
  },
  {
    id: "quill",
    name: "Quill",
    tagline: "Terminal-first note taking with plain text as the database",
    year: "2024",
    role: "Creator",
    status: "Shipped",
    accent: "#9b51e0",
    stack: ["Rust", "SQLite FTS5", "Ratatui"],
    description:
      "Quill treats a folder of markdown files as the source of truth and keeps a throwaway SQLite index beside it for instant full-text search. If Quill disappears tomorrow your notes are still just files, which was the entire design constraint.",
    highlights: [
      "Sub-8ms full-text search across 40k notes via FTS5",
      "Bidirectional links resolved without a database migration",
      "Filesystem watcher reindexes incrementally on save",
      "Single 4MB static binary, no dependencies",
    ],
    links: [{ label: "Source", href: "https://github.com" }],
  },
  {
    id: "prism",
    name: "Prism",
    tagline: "Accessibility contrast auditing in CI",
    year: "2023",
    role: "Creator",
    status: "Archived",
    accent: "#eb5757",
    stack: ["Node", "Playwright", "GitHub Actions"],
    description:
      "Prism crawled a running app in CI, screenshotted every interactive state, and failed the build when text dropped below WCAG contrast thresholds. Archived because the browser devtools finally grew equivalent tooling, which is the best reason to archive something.",
    highlights: [
      "Caught 140 contrast regressions in its first month on one codebase",
      "Hover, focus and disabled state capture, not just static pages",
      "Diffed against baseline to keep the noise floor near zero",
    ],
    links: [{ label: "Source", href: "https://github.com" }],
  },
];

/* ---------------------------------------------------------------- skills --- */

export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    blurb: "What I reach for, roughly in order of comfort.",
    skills: [
      { name: "TypeScript", level: 90 },
      { name: "JavaScript", level: 90 },
      { name: "SQL", level: 70 },
      { name: "Python", level: 60 }
    ],
  },
  {
    name: "Frontend",
    blurb: "Where I spend most of my day.",
    skills: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 980 },
      { name: "CSS architecture", level: 85 },
      { name: "Canvas / WebGL", level: 70 },
      { name: "Accessibility", level: 84 },
      { name: "Motion design", level: 78 },
    ],
  },
  {
    name: "Backend & data",
    blurb: "Enough to own a feature end to end.",
    skills: [
      { name: "Node / Bun", level: 70 },
      { name: "Express.js", level: 70 },
      { name: "API design", level: 75 },
      { name: "Event sourcing", level: 68 },
    ],
  },
  {
    name: "Craft & tooling",
    blurb: "The unglamorous half of the job.",
    skills: [
      { name: "Testing strategy", level: 85 },
      { name: "CI/CD", level: 80 },
      { name: "Docker", level: 74 },
      { name: "Observability", level: 71 },
      { name: "Technical writing", level: 88 },
    ],
  },
];

/* ------------------------------------------------------------ experience --- */

export const experience: Job[] = [
  {
    company: "National Institute of electronics and Information Technology, Bhubaneswar",
    role: "Full-Stack Engineer Intern",
    period: "2026.09.01 — Present",
    location: "Bhubaneswar (on-site)",
    bullets: [
      "Own the design system used by 40 engineers across six product surfaces; cut component duplication by 70%.",
      "Led the migration off a five-year-old Webpack monolith to a Vite-based module setup, taking cold builds from 4m10s to 22s.",
      "Introduced render-budget tracking in CI, which caught three regressions before release in the first quarter.",
      "Mentor two mid-level engineers; run the internal frontend guild and its fortnightly teardown session.",
    ],
  }
];

export const education = [
  {
    school: "Radhakrishna Institute of Technology & Engineering",
    degree: "B.Tech, Computer Science & Engineering",
    period: "2013 — 2017",
    note: "7th Sem on-going",
  },
];

export const certifications = [
  "AWS Certified Solutions Architect — Associate (2023)",
  "Google Mobile Web Specialist (2021)",
];

/* ----------------------------------------------------------------- notes --- */

export const notes: Note[] = [
  {
    id: "n1",
    title: "The interface is the product",
    date: "12 Aug 2026",
    preview: "Users never see your architecture. They see the 200ms you didn't optimise.",
    body: [
      "Nobody has ever churned because your service boundaries were drawn badly. They churn because the save button lied to them.",
      "This isn't an argument against good architecture — bad architecture is exactly what makes the save button lie eventually. It's an argument about where to spend your last available hour in a sprint. Spend it on the thing being touched.",
      "The practical version: instrument the interactions, not just the endpoints. A p99 of 80ms on the API means nothing if the client waterfalls three of them before painting.",
    ],
  },
  {
    id: "n2",
    title: "Notes on building a CRDT canvas",
    date: "29 Jul 2026",
    preview: "Everything I got wrong in the first four weeks of Atlas.",
    body: [
      "First mistake: treating the CRDT as the rendering model. Convergent data structures are great at agreeing on state and terrible at telling you what changed cheaply. I needed a separate dirty-rect layer.",
      "Second mistake: syncing cursors through the same document as the shapes. Presence is ephemeral, high-frequency and worthless after 200ms. It belongs on a different channel with a different retention policy.",
      "Third mistake: assuming offline was a feature I could add later. Offline-first is a shape you build into the data model on day one, or a rewrite you schedule for month six.",
    ],
  },
  {
    id: "n3",
    title: "Against clever code",
    date: "04 Jun 2026",
    preview: "The best code I wrote this year was the code I deleted twice.",
    body: [
      "Cleverness has a carrying cost, and the person who pays it is whoever reads the function at 2am during an incident. Frequently that person is me, having forgotten everything.",
      "My rule now: if explaining a block requires a diagram, the block is wrong or it needs the diagram in a comment above it. Both outcomes are fine. Neither is what I would have written five years ago.",
    ],
  },
];

/* ------------------------------------------------------------ ambient ui --- */

/** Weather widget. Static by design — no API key, no network call. */
export const weather = {
  city: "Bengaluru",
  temp: 28,
  condition: "Clear",
  high: 31,
  low: 22,
  humidity: 64,
  wind: 8,
};

/** Fake now-playing widget. Lengths are in seconds. */
export const playlist: Track[] = [
  { title: "Peaceful Lofi", artist: "Calm Study", album: "Focus Hours", length: 214 },
  { title: "Rain on Glass", artist: "Hollow Rooms", album: "Nightshift", length: 189 },
  { title: "Slow Commute", artist: "Meridian", album: "Blue Line", length: 246 },
  { title: "Second Coffee", artist: "The Long Way", album: "Mornings", length: 172 },
];

/* ------------------------------------------------------------ wallpapers --- */

export type Wallpaper = {
  id: string;
  name: string;
  mode: "light" | "dark";
  /** Any valid CSS `background` shorthand value. Layered gradients only — no image files. */
  css: string;
};

export const wallpapers: Wallpaper[] = [
  {
    id: "seaside",
    name: "Seaside",
    mode: "light",
    css: `radial-gradient(1100px 460px at 76% 14%, rgba(255,247,214,0.95), rgba(255,247,214,0) 62%),
          radial-gradient(700px 700px at 12% 88%, rgba(120,205,225,0.35), rgba(120,205,225,0) 60%),
          linear-gradient(180deg,
            #7fcbec 0%, #a9def5 30%, #d5f0fb 45.5%,
            #4fb3dd 46%, #2b8fc4 58%, #1f6f9e 62.5%,
            #ecd9b4 63%, #f5e8cd 82%, #efdcbd 100%)`,
  },
  {
    id: "blossom",
    name: "Blossom",
    mode: "light",
    css: `radial-gradient(800px 600px at 82% 20%, rgba(255,214,224,0.85), rgba(255,214,224,0) 60%),
          radial-gradient(900px 700px at 10% 80%, rgba(214,226,255,0.8), rgba(214,226,255,0) 62%),
          linear-gradient(160deg, #fff4f7 0%, #f7eaff 40%, #e9f0ff 72%, #f6f9ff 100%)`,
  },
  {
    id: "dune",
    name: "Dune",
    mode: "light",
    css: `radial-gradient(900px 500px at 70% 12%, rgba(255,236,196,0.95), rgba(255,236,196,0) 65%),
          linear-gradient(180deg, #ffe6bd 0%, #f7cf9c 34%, #e8ab7a 58%, #c98564 78%, #a9694f 100%)`,
  },
  {
    id: "midnight",
    name: "Midnight",
    mode: "dark",
    css: `radial-gradient(900px 620px at 18% 8%, rgba(124,96,255,0.38), rgba(124,96,255,0) 62%),
          radial-gradient(760px 520px at 86% 78%, rgba(0,178,220,0.30), rgba(0,178,220,0) 60%),
          linear-gradient(180deg, #080c20 0%, #101736 46%, #1a1338 100%)`,
  },
  {
    id: "aurora",
    name: "Aurora",
    mode: "dark",
    css: `radial-gradient(700px 500px at 24% 22%, rgba(0,255,190,0.24), rgba(0,255,190,0) 60%),
          radial-gradient(820px 560px at 78% 34%, rgba(120,80,255,0.32), rgba(120,80,255,0) 62%),
          radial-gradient(600px 400px at 60% 92%, rgba(255,90,160,0.20), rgba(255,90,160,0) 60%),
          linear-gradient(180deg, #04070f 0%, #0a1226 50%, #120a24 100%)`,
  },
  {
    id: "graphite",
    name: "Graphite",
    mode: "dark",
    css: `radial-gradient(900px 600px at 50% 0%, rgba(120,140,170,0.22), rgba(120,140,170,0) 66%),
          linear-gradient(180deg, #16181d 0%, #1d2026 48%, #101216 100%)`,
  },
];

/* ------------------------------------------------------------- lockscreen --- */

export const lockScreen = {
  hint: "Type anything and press Return",
  greeting: "Welcome back",
};
