"use client";

import { useEffect, useRef, useState } from "react";
import type { Viewer } from "@photo-sphere-viewer/core";
import type { MarkerConfig, MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import type { Hotspot } from "../lib/tour-stops";
import { installPanCursor, type PanCursor } from "./viewerCursor";
import {
  floorDiscDataUri,
  infoMarkerHtml,
  FLOOR_DISC_SIZE,
  FLOOR_DISC_ROTATION,
} from "./editor/hotspotIcons";

interface Props {
  src: string;
  alt: string;
  hotspots?: Hotspot[];
  defaultYaw?: number;
  defaultPitch?: number;
  onNavigate?: (targetStopId: string) => void;
  className?: string;
}

function buildMarkers(hotspots: Hotspot[]): MarkerConfig[] {
  return hotspots.map((h) => {
    if (h.type === "link") {
      return {
        id: h.id,
        imageLayer: floorDiscDataUri(h.icon),
        position: { yaw: h.yaw, pitch: h.pitch },
        size: FLOOR_DISC_SIZE,
        rotation: FLOOR_DISC_ROTATION,
        tooltip: h.label || "Go to this spot",
        data: h,
      };
    }
    return {
      id: h.id,
      position: { yaw: h.yaw, pitch: h.pitch },
      html: infoMarkerHtml(h.label, h.icon),
      size: { width: 40, height: 40 },
      tooltip: h.label || undefined,
      data: h,
    };
  });
}

export default function TourViewer({
  src,
  alt,
  hotspots = [],
  defaultYaw,
  defaultPitch,
  onNavigate,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const markersRef = useRef<MarkersPlugin | null>(null);
  const cursorRef = useRef<PanCursor | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const hotspotsRef = useRef(hotspots);
  const onNavigateRef = useRef(onNavigate);
  const defaultYawRef = useRef(defaultYaw);
  const defaultPitchRef = useRef(defaultPitch);

  // Keep the "latest value" refs in sync after every render, rather than
  // writing to them during render (which the React Compiler forbids).
  useEffect(() => {
    hotspotsRef.current = hotspots;
    onNavigateRef.current = onNavigate;
    defaultYawRef.current = defaultYaw;
    defaultPitchRef.current = defaultPitch;
  });

  // Initialize the viewer once on mount.
  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    void (async () => {
      const [{ Viewer }, { MarkersPlugin }] = await Promise.all([
        import("@photo-sphere-viewer/core"),
        import("@photo-sphere-viewer/markers-plugin"),
      ]);
      await Promise.all([
        import("@photo-sphere-viewer/core/index.css"),
        import("@photo-sphere-viewer/markers-plugin/index.css"),
      ]);

      if (disposed || !containerRef.current) return;

      const viewer = new Viewer({
        container: containerRef.current,
        panorama: src,
        navbar: ["zoom", "fullscreen"],
        plugins: [[MarkersPlugin, { clickEventOnMarker: true }]],
        loadingTxt: "",
        defaultZoomLvl: 0,
        defaultYaw: defaultYawRef.current ?? 0,
        defaultPitch: defaultPitchRef.current ?? 0,
      });

      const mp = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
      if (mp) {
        mp.setMarkers(buildMarkers(hotspotsRef.current));
        markersRef.current = mp;
      }

      viewer.addEventListener("click", (e) => {
        const hotspot = (e.data as { marker?: { data?: Hotspot } }).marker
          ?.data;
        if (hotspot?.type === "link" && hotspot.targetStopId) {
          onNavigateRef.current?.(hotspot.targetStopId);
        }
      });

      cursorRef.current = installPanCursor(viewer);
      viewerRef.current = viewer;

      // Defensive: force one more size measurement next frame in case the
      // container's layout hadn't fully settled when the viewer measured it.
      requestAnimationFrame(() => {
        if (!disposed) viewer.autoSize();
      });
    })();

    return () => {
      disposed = true;
      cursorRef.current?.destroy();
      cursorRef.current = null;
      viewerRef.current?.destroy();
      viewerRef.current = null;
      markersRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap the panorama whenever a different stop is selected. On the very
  // first render `viewerRef.current` is still null (the dynamic imports
  // above haven't resolved yet), so this naturally no-ops on mount instead
  // of racing the initial load. Markers are cleared during the transition
  // and restored once the new panorama finishes loading so they never
  // appear at wrong positions on the old panorama mid-fade.
  useEffect(() => {
    const viewer = viewerRef.current;
    const mp = markersRef.current;
    if (!viewer) return;

    setTransitioning(true);
    mp?.clearMarkers();
    void viewer
      .setPanorama(src, {
        transition: true,
        position: {
          yaw: defaultYawRef.current ?? 0,
          pitch: defaultPitchRef.current ?? 0,
        },
      })
      .then(() => {
        if (!viewerRef.current) return;
        mp?.setMarkers(buildMarkers(hotspotsRef.current));
        setTransitioning(false);
      });
  }, [src]);

  return (
    <div
      role="img"
      aria-label={`${alt}. Drag to look around this 360 photo.`}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 ${className}`}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {transitioning && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium tracking-wide text-white/80">
          Drag to look around
        </span>
      </div>
    </div>
  );
}
