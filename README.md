# Portfolio OS

An interactive portfolio that behaves like a desktop operating system. It boots, asks you to log in, and drops you onto a wallpaper with a menu bar, a magnifying dock, desktop icons, live widgets, Spotlight search, and draggable windows — each of which is a section of the portfolio rather than a page of a website.

Built with Next.js 15 (App Router), React 19, TypeScript, and plain CSS. No UI library, no icon package, no image assets: every icon is inline SVG and every wallpaper is a layered CSS gradient.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. For a production build, `npm run build` followed by `npm start`.

Node 18.18 or newer is required (Next.js 15's floor).

## Making it yours

Everything you would want to change lives in one file: **`lib/portfolio.config.ts`**. Nothing else needs editing. It exports, in order, `profile` (name, initials, role, location, email, bio, quick facts, what you're working on now), `socials`, `projects`, `skillGroups`, `experience`, `education`, `certifications`, `notes` (the Journal app's entries), `weather`, `playlist` (the Now Playing widget), `wallpapers`, and `lockScreen`.

The content currently in there is a placeholder persona — a Bengaluru-based full-stack engineer named Aarav Mehta — so you can see every surface populated before you replace it. The types are strict, so if you delete a required field TypeScript will point at it.

Two things worth knowing while you edit. Project ids are used as deep links: Spotlight results and the terminal's `project <id>` command jump straight to a project, so keep ids short and stable. And each project's `status` string is turned into a CSS class, so the four supported values are `Shipped`, `In progress`, `Archived`, and `Experiment` — anything else renders without a colour.

If you want to change which apps exist, or which appear on the desktop versus in the dock, that's `lib/app-registry.ts` — window sizes, icons, gradients, and the fake menu-bar menus are all declared there as data.

## Keyboard

| Keys | What happens |
| --- | --- |
| `⌘K` or `⌘Space` | Open or close Spotlight |
| `↑` `↓` `↵` | Move through Spotlight results and launch |
| `Esc` | Close Spotlight |
| `⌘W` | Close the front window |
| `⌘M` | Minimize the front window |
| `⌘L` | Clear the terminal (when it has focus) |
| `↑` `↓` | Walk terminal history (when it has focus) |
| `Tab` | Complete a terminal command or argument |

Control works in place of Command on Windows and Linux. Windows can also be dragged by their title bar, resized from the right and bottom edges or the corner grip, and zoomed by double-clicking the title bar.

## The terminal

The terminal is the one place where the desktop metaphor is more than decoration: its commands drive the real window manager, so `open projects` genuinely opens the Projects window and `theme dark` genuinely repaints the whole shell.

| Command | What it does |
| --- | --- |
| `help` | List every command |
| `about` | The long-form bio |
| `projects` | List every project |
| `project <id>` | Open one project in the Projects window |
| `skills` | Skill levels as bar charts |
| `experience` | Roles and dates |
| `notes` | List journal entries |
| `resume` | Open Resume.pdf in Preview |
| `contact` | Email and links |
| `open <app>` | Launch any app window |
| `theme <light\|dark\|toggle>` | Change appearance |
| `ls` / `cat <file>` | The fake filesystem |
| `neofetch` | System summary |
| `whoami` / `date` / `echo` | The usual |
| `sudo` | Refuses, politely |
| `clear` / `exit` | Clear the screen / close the window |

## Themes and wallpapers

The menu bar's sun/moon button toggles light and dark; System Settings has a wallpaper picker with three gradients per theme. Both choices persist in `localStorage`, and each theme remembers its own wallpaper. An inline script in `app/layout.tsx` applies the stored theme before first paint, so there is no flash of the wrong palette on reload.

The boot and lock sequence only runs once per browser tab — it's recorded in `sessionStorage`, so refreshing while you work drops you straight back onto the desktop. Restart or Lock Screen in the brand menu will replay it.

## How it fits together

`lib/desktop-context.tsx` is the operating system: boot phase, theme, wallpaper, the window manager, and Spotlight state, exposed through a `useDesktop()` hook. Windows are plain state objects with position, size, and z-order; the z-counter is a ref so that every state updater stays pure, which matters because React StrictMode double-invokes them in development.

`components/` holds the chrome — `BootScreen`, `LockScreen`, `MenuBar`, `Dock`, `DesktopIcons`, `Window`, `Spotlight` — with `components/widgets/` for the four desktop widgets and `components/apps/` for the contents of each window. `app/globals.css` carries the design tokens and the shell; `app/desktop.css` carries window chrome and per-app interiors.

Two details that are easy to trip over if you start editing. Anything that shows the current time returns `null` until mounted (see `lib/use-now.ts`), which is what keeps the server and client markup identical — reintroducing `new Date()` into a first render will cause a hydration mismatch. And the dock measures its tile positions only while at rest, never during render, because a magnified tile shifts its own neighbours.

## Notes

Resume's "Print or save as PDF" button uses a print stylesheet that strips the desktop away and prints only the résumé sheet. Reduced-motion preferences are respected globally. The layout is responsive: below 1080px the widget column steps aside, and below 760px the decorative menu titles and status icons drop out and the dock shrinks.
