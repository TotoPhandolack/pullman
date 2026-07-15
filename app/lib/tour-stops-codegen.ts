import type { Hotspot, TourStop } from "./tour-stops";

function formatHotspot(h: Hotspot): string {
  const parts = [
    `id: ${JSON.stringify(h.id)}`,
    `type: ${JSON.stringify(h.type)}`,
    `yaw: ${h.yaw.toFixed(4)}`,
    `pitch: ${h.pitch.toFixed(4)}`,
  ];
  if (h.label) parts.push(`label: ${JSON.stringify(h.label)}`);
  if (h.content) parts.push(`content: ${JSON.stringify(h.content)}`);
  if (h.icon) parts.push(`icon: ${JSON.stringify(h.icon)}`);
  if (h.targetStopId) parts.push(`targetStopId: ${JSON.stringify(h.targetStopId)}`);
  return `{ ${parts.join(", ")} }`;
}

export function generateTourStopsCode(stops: TourStop[]): string {
  const lines = stops.map((stop) => {
    const hs = stop.hotspots;
    const hotspotsCode = hs.length
      ? `[\n${hs.map((h) => `      ${formatHotspot(h)},`).join("\n")}\n    ]`
      : "[]";
    const parts = [
      `id: ${JSON.stringify(stop.id)}`,
      `title: ${JSON.stringify(stop.title)}`,
      `image: ${JSON.stringify(stop.image)}`,
    ];
    if (stop.defaultYaw !== undefined) parts.push(`defaultYaw: ${stop.defaultYaw.toFixed(4)}`);
    if (stop.defaultPitch !== undefined) parts.push(`defaultPitch: ${stop.defaultPitch.toFixed(4)}`);
    parts.push(`hotspots: ${hotspotsCode}`);
    return `  { ${parts.join(", ")} },`;
  });
  return `export const tourStops: TourStop[] = [\n${lines.join("\n")}\n];`;
}
