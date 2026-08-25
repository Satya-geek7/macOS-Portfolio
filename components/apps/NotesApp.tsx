"use client";

import { useState } from "react";
import { notes } from "@/lib/portfolio.config";

export default function NotesApp() {
  const [selected, setSelected] = useState(notes[0]?.id);
  const note = notes.find((n) => n.id === selected) ?? notes.at(0);

  if (!note) {
    return (
      <div className="pane">
        <div className="pane-scroll scroll-area">
          <div className="prose">
            <p>No entries yet. Add one to the notes array in lib/portfolio.config.ts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="sidebar is-wide scroll-area" aria-label="Journal entries">
        <div className="sidebar-heading">{notes.length} Entries</div>
        {notes.map((n) => (
          <button
            key={n.id}
            className={`note-row${n.id === note.id ? " is-active" : ""}`}
            onClick={() => setSelected(n.id)}
          >
            <div className="note-row-title">{n.title}</div>
            <div className="note-row-date">{n.date}</div>
            <div className="note-row-preview">{n.preview}</div>
          </button>
        ))}
      </nav>

      <div className="pane">
        <div className="pane-scroll scroll-area">
          <article className="note-body">
            <h1 className="note-title">{note.title}</h1>
            <div className="note-date">{note.date}</div>
            <div className="divider" />
            <div className="prose">
              {note.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
