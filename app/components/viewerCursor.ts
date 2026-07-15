import type { Viewer } from "@photo-sphere-viewer/core";

export interface PanCursor {
  /** Re-evaluate the cursor, e.g. after `isPlacing`'s underlying value changes. */
  refresh: () => void;
  destroy: () => void;
}

/**
 * Gives the panorama a grab/grabbing cursor — an open hand at rest and a
 * closed hand while the user holds and drags to look around — instead of
 * Photo Sphere Viewer's default static "move" cursor. Pass `isPlacing` (used
 * by the hotspot editor) to show a crosshair instead while armed to place.
 */
export function installPanCursor(
  viewer: Viewer,
  isPlacing: () => boolean = () => false,
): PanCursor {
  const container = viewer.container;
  let dragging = false;

  const apply = () => {
    if (isPlacing()) viewer.setCursor("crosshair");
    else viewer.setCursor(dragging ? "grabbing" : "grab");
  };

  const onDown = () => {
    dragging = true;
    apply();
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    apply();
  };

  // Capture on the container; window mouseup so a release outside the
  // viewer still clears the drag state.
  container.addEventListener("mousedown", onDown, true);
  window.addEventListener("mouseup", onUp, true);
  apply();

  return {
    refresh: apply,
    destroy() {
      container.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("mouseup", onUp, true);
    },
  };
}
