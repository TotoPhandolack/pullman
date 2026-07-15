"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
} from "react";
import type { Viewer } from "@photo-sphere-viewer/core";
import type {
  MarkerConfig,
  MarkersPlugin,
} from "@photo-sphere-viewer/markers-plugin";
import type { Hotspot } from "../../lib/tour-stops";
import { installPanCursor, type PanCursor } from "../viewerCursor";
import { infoMarkerHtml, linkMarkerHtml } from "./hotspotIcons";

export type PlacingMode = "new" | "move" | null;

interface Props {
  src: string;
  hotspots: Hotspot[];
  placing: PlacingMode;
  draftPosition: { yaw: number; pitch: number } | null;
  defaultYaw?: number;
  defaultPitch?: number;
  onPlace: (pos: { yaw: number; pitch: number }) => void;
  onSelectHotspot: (id: string) => void;
  className?: string;
}

export interface HotspotCanvasHandle {
  getPosition(): { yaw: number; pitch: number } | null;
}

const DRAFT_MARKER_ID = "__draft__";

function buildMarkers(hotspots: Hotspot[]): MarkerConfig[] {
  return hotspots.map((h) => {
    if (h.type === "link") {
      return {
        id: h.id,
        position: { yaw: h.yaw, pitch: h.pitch },
        html: linkMarkerHtml(h.label, h.icon),
        size: { width: 46, height: 46 },
        tooltip: h.label || "Link hotspot",
        data: h,
      };
    }
    return {
      id: h.id,
      position: { yaw: h.yaw, pitch: h.pitch },
      html: infoMarkerHtml(h.label, h.icon),
      size: { width: 40, height: 40 },
      tooltip: h.label || "Info hotspot",
      data: h,
    };
  });
}

function draftMarker(pos: { yaw: number; pitch: number }): MarkerConfig {
  return {
    id: DRAFT_MARKER_ID,
    position: pos,
    html: `<div style="width:34px;height:34px;border-radius:50%;border:3px dashed #c9a24b;background:rgba(255,212,0,0.15);box-shadow:0 0 0 4px rgba(0,0,0,0.4);"></div>`,
    size: { width: 34, height: 34 },
    tooltip: "New hotspot position",
  };
}

function HotspotCanvas(
  {
    src,
    hotspots,
    placing,
    draftPosition,
    defaultYaw,
    defaultPitch,
    onPlace,
    onSelectHotspot,
    className = "",
  }: Props,
  ref: ForwardedRef<HotspotCanvasHandle>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const markersRef = useRef<MarkersPlugin | null>(null);
  const cursorRef = useRef<PanCursor | null>(null);
  const [ready, setReady] = useState(false);

  const placingRef = useRef(placing);
  const onPlaceRef = useRef(onPlace);
  const onSelectHotspotRef = useRef(onSelectHotspot);
  const defaultYawRef = useRef(defaultYaw);
  const defaultPitchRef = useRef(defaultPitch);

  // Keep the "latest value" refs in sync after every render, rather than
  // writing to them during render (which the React Compiler forbids).
  useEffect(() => {
    placingRef.current = placing;
    onPlaceRef.current = onPlace;
    onSelectHotspotRef.current = onSelectHotspot;
    defaultYawRef.current = defaultYaw;
    defaultPitchRef.current = defaultPitch;
  });

  useImperativeHandle(ref, () => ({
    getPosition() {
      return viewerRef.current?.getPosition() ?? null;
    },
  }));

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
        navbar: ["zoom"],
        plugins: [[MarkersPlugin, { clickEventOnMarker: true }]],
        loadingTxt: "",
        defaultZoomLvl: 0,
        defaultYaw: defaultYawRef.current ?? 0,
        defaultPitch: defaultPitchRef.current ?? 0,
      });

      markersRef.current = viewer.getPlugin<MarkersPlugin>(MarkersPlugin) ?? null;

      viewer.addEventListener("click", (e) => {
        const data = e.data as {
          yaw: number;
          pitch: number;
          marker?: { data?: Hotspot };
        };
        if (placingRef.current) {
          onPlaceRef.current({ yaw: data.yaw, pitch: data.pitch });
          return;
        }
        const hotspot = data.marker?.data;
        if (hotspot) onSelectHotspotRef.current(hotspot.id);
      });

      cursorRef.current = installPanCursor(
        viewer,
        () => placingRef.current !== null,
      );
      viewerRef.current = viewer;
      setReady(true);

      // The canvas measures its container synchronously at construction time;
      // inside this editor's deep flex layout that can briefly read a 0
      // height before the browser finishes settling it. Force one more
      // measurement next frame, once layout has definitely resolved.
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

  // Swap the panorama when a different scene is selected (instant — no
  // decorative fade needed while editing). Reset to that scene's default
  // view so the camera doesn't carry over the previous scene's angle.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    void viewer.setPanorama(src, {
      transition: false,
      position: {
        yaw: defaultYawRef.current ?? 0,
        pitch: defaultPitchRef.current ?? 0,
      },
    });
  }, [src]);

  // Re-evaluate the cursor whenever placing mode toggles.
  useEffect(() => {
    cursorRef.current?.refresh();
  }, [placing]);

  // Rebuild markers whenever the committed hotspots or the draft preview change.
  useEffect(() => {
    const mp = markersRef.current;
    if (!mp) return;
    const markers = buildMarkers(hotspots);
    if (draftPosition) markers.push(draftMarker(draftPosition));
    mp.setMarkers(markers);
  }, [hotspots, draftPosition, ready]);

  return (
    <div className={`overflow-hidden bg-black ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}

export default forwardRef(HotspotCanvas);
