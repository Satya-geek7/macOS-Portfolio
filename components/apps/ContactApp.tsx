"use client";

import { useState } from "react";
import Icon from "../Icon";
import { useDesktop } from "@/lib/desktop-context";
import { profile, socials } from "@/lib/portfolio.config";

export default function ContactApp() {
  const { openUrl } = useDesktop();
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name || "someone"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${from}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked — the address is on screen anyway.
    }
  };

  return (
    <div className="pane">
      <div className="pane-scroll scroll-area">
        <h1 className="h-lg">Get in touch</h1>
        <p style={{ color: "var(--text-2)", fontSize: 14, marginTop: 5 }}>
          This form opens your mail client with the message pre-filled — nothing is sent from
          this page and nothing is stored.
        </p>

        <div className="divider" />

        <form className="form-stack" onSubmit={send}>
          <div className="field">
            <label className="field-label" htmlFor="c-name">
              Your name
            </label>
            <input
              id="c-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priya Raman"
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="c-email">
              Your email
            </label>
            <input
              id="c-email"
              className="input"
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="priya@company.com"
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="c-msg">
              Message
            </label>
            <textarea
              id="c-msg"
              className="textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What are you building?"
              required
            />
          </div>

          <div className="btn-row">
            <button className="btn btn-primary" type="submit">
              <Icon name="mail" size={15} />
              Open in mail app
            </button>
            <button className="btn" type="button" onClick={copyEmail}>
              <Icon name={copied ? "check" : "copy"} size={15} />
              {copied ? "Copied" : "Copy address"}
            </button>
          </div>

          {copied && (
            <div className="copy-note">
              <Icon name="check" size={13} />
              {profile.email} copied to your clipboard
            </div>
          )}
        </form>

        <div className="divider" />

        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Elsewhere
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {socials.map((s) => (
            <button key={s.label} className="link-tile" onClick={() => openUrl(s.href)}>
              <span className="link-tile-icon">
                <Icon name={s.icon === "x" ? "globe" : s.icon} size={16} />
              </span>
              <span className="link-tile-text">
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{s.label}</span>
                <span className="link-tile-sub">
                  {s.href.replace(/^https?:\/\//, "").replace(/^mailto:/, "")}
                </span>
              </span>
              <Icon name="arrow-up-right" size={15} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
