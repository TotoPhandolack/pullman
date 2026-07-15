export type HotspotType = "link" | "info";

export type Hotspot = {
  id: string;
  type: HotspotType;
  yaw: number;
  pitch: number;
  label?: string;
  content?: string;
  icon?: string;
  /** Required when type is "link": the TourStop.id to jump to. */
  targetStopId?: string;
};

export type TourStop = {
  id: string;
  title: string;
  image: string;
  /** Camera direction shown when a visitor first arrives at this scene. */
  defaultYaw?: number;
  defaultPitch?: number;
  hotspots: Hotspot[];
};

/**
 * Placeholder tour built from the existing flat hotel photos so the section is
 * fully functional today. These are NOT real 360° panoramas yet — Photo Sphere
 * Viewer wraps them onto the sphere, so they look stretched. Swap each `image`
 * for a real equirectangular panorama and re-place the hotspots in the editor
 * at /tour-editor when the 360° shots are ready.
 */
export const tourStops: TourStop[] = [
  { id: "360degree-1", title: "360degree 1", image: "/assets/tour-360/da285bd1-e25e-4f47-84e3-68b205517c79.webp", defaultYaw: 5.4481, defaultPitch: -0.1269, hotspots: [] },
  { id: "360degree-2", title: "360degree 2", image: "/assets/tour-360/615c1970-4ec0-4f37-aebd-3bde8d56fe4e.webp", hotspots: [] },
];
