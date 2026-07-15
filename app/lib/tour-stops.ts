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
  { id: "360degree-1", title: "360degree 1", image: "/assets/tour-360/da285bd1-e25e-4f47-84e3-68b205517c79.webp", defaultYaw: 5.5207, defaultPitch: -0.1212, hotspots: [
      { id: "de06fec2-7baf-4474-9962-172a802fa1e3", type: "link", yaw: 4.7511, pitch: -0.0127, label: "Front door", icon: "door", targetStopId: "360degree-2" },
    ] },
  { id: "360degree-2", title: "360degree 2", image: "/assets/tour-360/615c1970-4ec0-4f37-aebd-3bde8d56fe4e.webp", hotspots: [
      { id: "3bde02ba-475b-4adb-a54c-087081846fc5", type: "link", yaw: 0.3750, pitch: 0.0312, icon: "look", targetStopId: "360degree-3" },
    ] },
  { id: "360degree-3", title: "360degree 3", image: "/assets/tour-360/f8d8a837-81e5-41d2-9314-2eaa0115f8a0.webp", defaultYaw: 1.6393, defaultPitch: -0.0824, hotspots: [
      { id: "8c8bb2b2-6d93-4857-841b-71cc525b2b8b", type: "link", yaw: 2.1772, pitch: -0.1111, label: "Window", icon: "look", targetStopId: "360degree-2" },
    ] },
  { id: "hotel-04", title: "Hotel 04", image: "/assets/tour-360/7c247e9c-9532-4b5c-b216-844c32fdc238.jpg", defaultYaw: 0.0726, defaultPitch: -0.1249, hotspots: [
      { id: "2464ae81-d7fd-4cb5-842e-552403b26571", type: "link", yaw: 0.9272, pitch: 0.1343, icon: "look", targetStopId: "360degree-3" },
    ] },
  { id: "hotel-26", title: "Hotel 26", image: "/assets/tour-360/84823edb-7e11-49b5-a56b-38af51eaa348.jpg", hotspots: [
      { id: "ba974378-2226-414c-867e-ba39600b8aa3", type: "link", yaw: 4.7757, pitch: 0.0569, icon: "door", targetStopId: "hotel-04" },
    ] },
];
