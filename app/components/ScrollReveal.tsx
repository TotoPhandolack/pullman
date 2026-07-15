"use client";

import { useEffect } from "react";

/**
 * Arms scroll-reveal animations. Elements opt in with `className="reveal"`.
 * Nothing is hidden until this mounts (it adds `reveal-ready` to <body>),
 * so content stays visible if JS is disabled or fails.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    document.body.classList.add("reveal-ready");

    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
