"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./icons";

/* The data-theme attribute on <html> is the single source of truth:
 * light is the default; the layout's inline script applies a stored
 * "dark" choice before paint, and this button flips it afterwards. */

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

// The server always renders the light-default state.
function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    if (dark) {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = "dark";
    }
    try {
      localStorage.setItem("theme", dark ? "light" : "dark");
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
  };

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
      className="grid h-11 w-11 place-items-center rounded-full border border-line text-cream transition-colors hover:border-gold hover:text-gold"
    >
      {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
