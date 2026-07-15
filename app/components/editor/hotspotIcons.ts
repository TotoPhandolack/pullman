/**
 * Preset hotspot icons shared by the editor (picker UI) and the public viewer
 * (marker rendering). Each `svg` is the inner markup for a `0 0 24 24` viewBox,
 * drawn with `stroke="currentColor"` and no fill so the consumer controls colour.
 *
 * The icon id is what we persist in `Hotspot.icon`. An empty/unknown id means
 * "use the type's default look" (a ring for links, a plain dot for info).
 */
export interface HotspotIconDef {
  id: string;
  label: string;
  svg: string;
}

export const HOTSPOT_ICONS: HotspotIconDef[] = [
  { id: "arrow", label: "Arrow", svg: `<path d="M5 12h14M12 5l7 7-7 7"/>` },
  { id: "forward", label: "Forward", svg: `<path d="M6 15l6-6 6 6"/>` },
  { id: "ring", label: "Ring", svg: `<circle cx="12" cy="12" r="7"/>` },
  {
    id: "door",
    label: "Door",
    svg: `<path d="M3 21h18M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M14 12h.01"/>`,
  },
  { id: "stairs", label: "Stairs", svg: `<path d="M4 20h4v-4h4v-4h4v-4h4"/>` },
  {
    id: "info",
    label: "Info",
    svg: `<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>`,
  },
  {
    id: "look",
    label: "Look",
    svg: `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>`,
  },
];

const BY_ID = new Map(HOTSPOT_ICONS.map((i) => [i.id, i]));

/** Inner SVG markup for a known icon id, or `null` if it isn't a preset. */
export function hotspotIconSvg(id: string | null | undefined): string | null {
  return (id && BY_ID.get(id)?.svg) || null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * A translucent brand-yellow "floor disc" (as an SVG data URI) used for link
 * hotspots. Rendered by Photo Sphere Viewer as a flat `imageLayer` marker laid
 * on the ground, so it tilts with the panorama and blends into the scene
 * instead of floating as a billboard. A plain ring is the default look
 * (`ring`/Auto); other icons are drawn centred inside the ring.
 */
export function floorDiscDataUri(iconId: string | null | undefined): string {
  const glyph = hotspotIconSvg(iconId);
  const inner =
    glyph && iconId !== "ring"
      ? `<g transform="translate(120 120) scale(3.4) translate(-12 -12)" fill="none" stroke="#fff" stroke-opacity="0.95" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>`
      : "";
  // NB: width/height are required — an SVG data URI with only a viewBox decodes
  // to naturalWidth 0 in Chrome, so the WebGL texture uploads empty (invisible).
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">` +
    `<defs><filter id="s" x="-25%" y="-25%" width="150%" height="150%">` +
    `<feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#000" flood-opacity="0.5"/>` +
    `</filter></defs>` +
    `<g filter="url(#s)">` +
    `<circle cx="120" cy="120" r="86" fill="#c9a24b" fill-opacity="0.18"/>` +
    `<circle cx="120" cy="120" r="86" fill="none" stroke="#c9a24b" stroke-opacity="0.95" stroke-width="11"/>` +
    inner +
    `</g></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/** Size (px) and flat-on-floor rotation shared by all link `imageLayer` markers. */
export const FLOOR_DISC_SIZE = { width: 220, height: 220 };
export const FLOOR_DISC_ROTATION = { pitch: Math.PI / 2 };

/** Billboard chip used for info hotspots (label/feature tags face the camera). */
export function infoMarkerHtml(label: string | null | undefined, iconId: string | null | undefined): string {
  const iconSvg = hotspotIconSvg(iconId);
  const glyph = iconSvg
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2.3"
        stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;">${iconSvg}</svg>`
    : `<span style="color:#0a0a0a;font-weight:700;font-size:18px;font-family:sans-serif;pointer-events:none;">${
        label ? escapeHtml(label.charAt(0).toUpperCase()) : "i"
      }</span>`;

  return `<div style="width:40px;height:40px;background:#c9a24b;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 12px rgba(0,0,0,0.45);cursor:pointer;">${glyph}</div>`;
}

/**
 * Upright, camera-facing marker for link hotspots. Earlier link hotspots were
 * flat "floor discs" laid on the ground — invisible edge-on when placed on a
 * wall or near the horizon. A billboard marker stays clearly visible and
 * clickable at any placement angle. The `.fm-tour-link` class (see globals.css)
 * adds a gentle attention pulse.
 */
export function linkMarkerHtml(
  label: string | null | undefined,
  iconId: string | null | undefined,
): string {
  // Default glyph reads as "go / enter" (an upward chevron) when no icon is set.
  const glyph = hotspotIconSvg(iconId) ?? `<path d="M6 15l6-6 6 6"/>`;
  return `<div class="fm-tour-link" title="${label ? escapeHtml(label) : "Go to this spot"}" style="
      width:46px;height:46px;border-radius:9999px;background:#c9a24b;
      border:2px solid rgba(255,255,255,0.9);
      display:flex;align-items:center;justify-content:center;cursor:pointer;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a"
        stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
        style="pointer-events:none;">${glyph}</svg>
    </div>`;
}
