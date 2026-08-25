"use client";

import type { WinState } from "@/lib/desktop-context";
import AboutApp from "./AboutApp";
import ProjectsApp from "./ProjectsApp";
import SkillsApp from "./SkillsApp";
import TerminalApp from "./TerminalApp";
import ContactApp from "./ContactApp";
import ResumeApp from "./ResumeApp";
import NotesApp from "./NotesApp";
import SettingsApp from "./SettingsApp";

/** Maps a window's app id to the component that fills it. */
export default function AppSurface({ win }: { win: WinState }) {
  switch (win.id) {
    case "about":
      return <AboutApp />;
    case "projects":
      return <ProjectsApp focusId={win.focusId} />;
    case "skills":
      return <SkillsApp nonce={win.nonce} />;
    case "terminal":
      return <TerminalApp nonce={win.nonce} />;
    case "contact":
      return <ContactApp />;
    case "resume":
      return <ResumeApp />;
    case "notes":
      return <NotesApp />;
    case "settings":
      return <SettingsApp />;
    default:
      return null;
  }
}
