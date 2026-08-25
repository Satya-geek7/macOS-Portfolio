"use client";

/* Shared inline SVG icon set — no icon library dependency. */

import type { IconKey } from "@/lib/app-registry";

type Props = { name: IconKey | ExtraIcon; size?: number; className?: string };

export type ExtraIcon =
  | "search"
  | "chevron"
  | "close"
  | "check"
  | "sun"
  | "moon"
  | "play"
  | "pause"
  | "next"
  | "prev"
  | "wifi"
  | "battery"
  | "control"
  | "apple"
  | "arrow-up-right"
  | "copy"
  | "grid"
  | "list";

const paths: Record<string, React.ReactNode> = {
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c.7-4 3.8-6 7.5-6s6.8 2 7.5 6" />
    </>
  ),
  folder: <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.2h9A1.5 1.5 0 0 1 21 9.7v8.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" />,
  sparkles: (
    <>
      <path d="M12 3l1.7 4.7L18.5 9.4 13.7 11 12 15.8 10.3 11 5.5 9.4l4.8-1.7z" />
      <path d="M18 15l.8 2.2 2.2.8-2.2.8L18 21l-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.4" />
      <path d="M7 9.5l3 2.5-3 2.5M12.5 15h4.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
      <path d="M3.8 7.2L12 13l8.2-5.8" />
    </>
  ),
  doc: (
    <>
      <path d="M6.5 3h7.2L18.5 8v13H6.5z" />
      <path d="M13.4 3v5.2h5.1M9 12.5h6M9 16h6" />
    </>
  ),
  note: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2.2" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 13.6a7.7 7.7 0 0 0 0-3.2l2-1.4-1.9-3.3-2.3.9a7.6 7.6 0 0 0-2.8-1.6L14 2h-4l-.4 2.5a7.6 7.6 0 0 0-2.8 1.6l-2.3-.9L2.6 8.5l2 1.4a7.7 7.7 0 0 0 0 3.2l-2 1.4 1.9 3.3 2.3-.9a7.6 7.6 0 0 0 2.8 1.6L10 22h4l.4-2.5a7.6 7.6 0 0 0 2.8-1.6l2.3.9 1.9-3.3z" />
    </>
  ),
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      stroke="none"
      d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM10 9.5h3.8v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76v5.69h-4v-5.05c0-1.2-.02-2.75-1.75-2.75-1.75 0-2.02 1.3-2.02 2.66v5.14h-4z"
    />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2M12 3.4c2.3 2.4 3.4 5.4 3.4 8.6s-1.1 6.2-3.4 8.6c-2.3-2.4-3.4-5.4-3.4-8.6S9.7 5.8 12 3.4z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.4" />
      <path d="M15.8 15.8L21 21" />
    </>
  ),
  chevron: <path d="M9 5.5l6.5 6.5L9 18.5" />,
  close: <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" />,
  check: <path d="M4.8 12.6l4.6 4.6 9.8-10.4" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.1" />
      <path d="M12 2.2v2.4M12 19.4v2.4M2.2 12h2.4M19.4 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19" />
    </>
  ),
  moon: <path d="M20.5 14.6A8.7 8.7 0 0 1 9.4 3.5a8.9 8.9 0 1 0 11.1 11.1z" />,
  play: <path fill="currentColor" stroke="none" d="M8 5.2l11 6.8-11 6.8z" />,
  pause: (
    <path fill="currentColor" stroke="none" d="M7 5h3.2v14H7zM13.8 5H17v14h-3.2z" />
  ),
  next: (
    <path fill="currentColor" stroke="none" d="M6 5.5l9 6.5-9 6.5zM16.4 5.5h2.4v13h-2.4z" />
  ),
  prev: (
    <path fill="currentColor" stroke="none" d="M18 5.5v13l-9-6.5zM5.2 5.5h2.4v13H5.2z" />
  ),
  wifi: (
    <>
      <path d="M2.8 8.6a14.5 14.5 0 0 1 18.4 0M5.9 12a10 10 0 0 1 12.2 0M9 15.3a5.4 5.4 0 0 1 6 0" />
      <circle cx="12" cy="18.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  battery: (
    <>
      <rect x="2.5" y="8" width="17" height="8" rx="2.2" />
      <path d="M21.4 11v2" />
      <rect x="4.3" y="9.8" width="12.5" height="4.4" rx="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  control: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </>
  ),
  apple: (
    <path
      fill="currentColor"
      stroke="none"
      d="M16.1 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.3-.9-2.3-3.4zM14 6.3c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2z"
    />
  ),
  "arrow-up-right": <path d="M7.5 16.5l9-9M9 7.5h7.5V15" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
      <path d="M15.5 5.5h-9a2 2 0 0 0-2 2v9" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.6" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.6" />
    </>
  ),
  list: <path d="M4 7h16M4 12h16M4 17h10" />,
};

export default function Icon({ name, size = 20, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] ?? null}
    </svg>
  );
}
