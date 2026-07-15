import type { TourStop } from "./tour-stops";

/** v2: persists the full editable scene list (not just per-stop overrides),
 * since the editor can now add/remove scenes as well as hotspots. Bumped
 * from the v1 key so a stale overrides-shaped payload can't be misread. */
const STORAGE_KEY = "fullman-hotel:tour-scenes:v2";

export function loadStops(): TourStop[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as TourStop[]) : null;
  } catch {
    return null;
  }
}

export function saveStops(stops: TourStop[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stops));
}

export function clearStops() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
