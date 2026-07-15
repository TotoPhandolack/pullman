import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Hotspot, TourStop } from "../../lib/tour-stops";
import { generateTourStopsCode } from "../../lib/tour-stops-codegen";

const DATA_FILE = path.join(process.cwd(), "app", "lib", "tour-stops.ts");
const ARRAY_MARKER = "export const tourStops: TourStop[] = [";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isHotspot(value: unknown): value is Hotspot {
  if (typeof value !== "object" || value === null) return false;
  const h = value as Record<string, unknown>;
  return (
    isNonEmptyString(h.id) &&
    (h.type === "link" || h.type === "info") &&
    isFiniteNumber(h.yaw) &&
    isFiniteNumber(h.pitch)
  );
}

function isTourStop(value: unknown): value is TourStop {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  if (!isNonEmptyString(s.id) || !isNonEmptyString(s.title) || !isNonEmptyString(s.image)) {
    return false;
  }
  if (!Array.isArray(s.hotspots) || !s.hotspots.every(isHotspot)) return false;
  if (s.defaultYaw !== undefined && !isFiniteNumber(s.defaultYaw)) return false;
  if (s.defaultPitch !== undefined && !isFiniteNumber(s.defaultPitch)) return false;
  return true;
}

function parseStops(body: unknown): TourStop[] | null {
  if (typeof body !== "object" || body === null) return null;
  const stops = (body as Record<string, unknown>).stops;
  if (!Array.isArray(stops) || stops.length === 0 || !stops.every(isTourStop)) return null;

  const ids = new Set<string>();
  for (const stop of stops as TourStop[]) {
    if (ids.has(stop.id)) return null; // duplicate scene id
    ids.add(stop.id);
  }
  for (const stop of stops as TourStop[]) {
    for (const h of stop.hotspots) {
      if (h.type === "link" && (!h.targetStopId || !ids.has(h.targetStopId))) {
        return null; // link hotspot pointing at an unknown/missing scene
      }
    }
  }
  return stops as TourStop[];
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "The hotspot editor can only save files in development." },
      { status: 403 },
    );
  }

  const stops = parseStops(await request.json().catch(() => null));
  if (!stops) {
    return Response.json({ error: "Invalid scene data." }, { status: 400 });
  }

  const source = await readFile(DATA_FILE, "utf8");
  const markerIndex = source.indexOf(ARRAY_MARKER);
  if (markerIndex === -1) {
    return Response.json(
      { error: `Could not find the tourStops array in ${DATA_FILE}.` },
      { status: 500 },
    );
  }

  const header = source.slice(0, markerIndex);
  await writeFile(DATA_FILE, `${header}${generateTourStopsCode(stops)}\n`, "utf8");
  return Response.json({ ok: true });
}
