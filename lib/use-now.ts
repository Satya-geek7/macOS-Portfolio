"use client";

import { useEffect, useState } from "react";

/**
 * Ticking clock that stays SSR-safe: returns null until mounted on the client,
 * so the server HTML and the first client render always agree.
 */
export function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
