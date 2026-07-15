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
  { id: "resort-overview", title: "Resort Overview", image: "/assets/images/hotel-28.jpg", defaultYaw: 0.0000, defaultPitch: -0.1000, hotspots: [
      { id: "seed-overview-lobby", type: "link", yaw: 2.9000, pitch: -0.3500, label: "Enter the lobby", icon: "door", targetStopId: "lobby-lounge" },
    ] },
  { id: "lobby-lounge", title: "Lobby & Lounge", image: "/assets/images/hotel-17.jpg", defaultYaw: 0.0000, defaultPitch: -0.1000, hotspots: [
      { id: "seed-lobby-room", type: "link", yaw: 1.8000, pitch: -0.3500, label: "Guest rooms", icon: "ring", targetStopId: "deluxe-room" },
      { id: "seed-lobby-overview", type: "link", yaw: 4.6000, pitch: -0.3500, label: "Back outside", icon: "arrow", targetStopId: "resort-overview" },
    ] },
  { id: "deluxe-room", title: "Deluxe Room", image: "/assets/images/hotel-07.jpg", defaultYaw: 0.0000, defaultPitch: -0.1000, hotspots: [
      { id: "seed-room-suite", type: "link", yaw: 2.4000, pitch: -0.3500, label: "Executive suite", icon: "ring", targetStopId: "executive-suite" },
      { id: "seed-room-lobby", type: "link", yaw: 5.1000, pitch: -0.3500, label: "Back to lobby", icon: "arrow", targetStopId: "lobby-lounge" },
    ] },
  { id: "executive-suite", title: "Executive Suite", image: "/assets/images/hotel-12.jpg", defaultYaw: 0.0000, defaultPitch: -0.1000, hotspots: [
      { id: "seed-suite-pool", type: "link", yaw: 2.1000, pitch: -0.3500, label: "Pool & grounds", icon: "ring", targetStopId: "pool-grounds" },
      { id: "seed-suite-room", type: "link", yaw: 4.8000, pitch: -0.3500, label: "Deluxe room", icon: "arrow", targetStopId: "deluxe-room" },
    ] },
  { id: "pool-grounds", title: "Pool & Grounds", image: "/assets/images/hotel-23.jpg", defaultYaw: 0.0000, defaultPitch: -0.1000, hotspots: [
      { id: "seed-pool-dining", type: "link", yaw: 1.6000, pitch: -0.3500, label: "Restaurant", icon: "ring", targetStopId: "restaurant" },
      { id: "seed-pool-suite", type: "link", yaw: 4.4000, pitch: -0.3500, label: "Suites", icon: "arrow", targetStopId: "executive-suite" },
    ] },
  { id: "restaurant", title: "Restaurant", image: "/assets/images/hotel-25.jpg", defaultYaw: 0.0000, defaultPitch: -0.1000, hotspots: [
      { id: "seed-dining-lobby", type: "link", yaw: 2.2000, pitch: -0.3500, label: "Return to lobby", icon: "door", targetStopId: "lobby-lounge" },
      { id: "seed-dining-pool", type: "link", yaw: 5.0000, pitch: -0.3500, label: "Pool & grounds", icon: "arrow", targetStopId: "pool-grounds" },
    ] },
];
