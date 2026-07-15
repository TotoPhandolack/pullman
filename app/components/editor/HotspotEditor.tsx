"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { tourStops as seedStops, type Hotspot, type HotspotType, type TourStop } from "../../lib/tour-stops";
import { clearStops, loadStops, saveStops } from "../../lib/hotspot-storage";
import { generateTourStopsCode } from "../../lib/tour-stops-codegen";
import HotspotCanvas, {
  type HotspotCanvasHandle,
  type PlacingMode,
} from "./HotspotCanvas";
import { HOTSPOT_ICONS } from "./hotspotIcons";

type HotspotDraft = {
  id?: string;
  type: HotspotType;
  yaw: number;
  pitch: number;
  label: string;
  content: string;
  icon: string;
  targetStopId: string;
};

const UPLOADED_IMAGE_PREFIX = "/assets/tour-360/";

function makeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `hotspot-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function humanizeFilename(name: string): string {
  const words = name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  const title = words
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return title || "New Scene";
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "scene";
}

function makeUniqueSceneId(title: string, existing: TourStop[]): string {
  const base = slugify(title);
  const ids = new Set(existing.map((s) => s.id));
  let id = base;
  let n = 2;
  while (ids.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}

export default function HotspotEditor() {
  const [stops, setStops] = useState<TourStop[]>(() => loadStops() ?? seedStops);
  const [selectedId, setSelectedId] = useState(stops[0].id);
  const [placing, setPlacing] = useState<PlacingMode>(null);
  const [draft, setDraft] = useState<HotspotDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addingScene, setAddingScene] = useState(false);
  const [saveAllState, setSaveAllState] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  // Local edits are drafted here; localStorage is only the editor's own
  // staging area, not what the public site reads. This component is
  // client-only (see HotspotEditorLoader), so reading localStorage during
  // the initial state computation above is safe — there's no SSR pass to
  // mismatch against.

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDraft(null);
        setPlacing(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const canvasRef = useRef<HotspotCanvasHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = stops.find((s) => s.id === selectedId) ?? stops[0];
  const hotspots = selected.hotspots;
  const otherStops = stops.filter((s) => s.id !== selectedId);

  function selectStop(id: string) {
    setSelectedId(id);
    setDraft(null);
    setPlacing(null);
  }

  function flashSaved() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }

  function persist(next: TourStop[]) {
    setStops(next);
    saveStops(next);
  }

  function updateSelectedStop(patch: Partial<TourStop>) {
    persist(stops.map((s) => (s.id === selectedId ? { ...s, ...patch } : s)));
  }

  function handlePlace(pos: { yaw: number; pitch: number }) {
    if (placing === "move" && draft) {
      setDraft({ ...draft, yaw: pos.yaw, pitch: pos.pitch });
      setPlacing(null);
      return;
    }
    if (placing === "new") {
      setDraft({
        type: "link",
        yaw: pos.yaw,
        pitch: pos.pitch,
        label: "",
        content: "",
        icon: "",
        targetStopId: "",
      });
      setPlacing(null);
    }
  }

  function editHotspot(id: string) {
    const h = hotspots.find((x) => x.id === id);
    if (!h) return;
    setDraft({
      id: h.id,
      type: h.type,
      yaw: h.yaw,
      pitch: h.pitch,
      label: h.label ?? "",
      content: h.content ?? "",
      icon: h.icon ?? "",
      targetStopId: h.targetStopId ?? "",
    });
    setPlacing(null);
    setError(null);
  }

  function cancelDraft() {
    setDraft(null);
    setPlacing(null);
    setError(null);
  }

  function saveHotspot() {
    if (!draft) return;
    if (draft.type === "link" && !draft.targetStopId) {
      setError("Pick a destination scene for this link hotspot.");
      return;
    }
    const hotspot: Hotspot = {
      id: draft.id ?? makeId(),
      type: draft.type,
      yaw: draft.yaw,
      pitch: draft.pitch,
      label: draft.label.trim() || undefined,
      content:
        draft.type === "info" ? draft.content.trim() || undefined : undefined,
      icon: draft.icon || undefined,
      targetStopId: draft.type === "link" ? draft.targetStopId : undefined,
    };
    const next = draft.id
      ? hotspots.map((h) => (h.id === hotspot.id ? hotspot : h))
      : [...hotspots, hotspot];
    updateSelectedStop({ hotspots: next });
    setDraft(null);
    setError(null);
    flashSaved();
  }

  function deleteHotspot(id: string) {
    updateSelectedStop({ hotspots: hotspots.filter((h) => h.id !== id) });
    if (draft?.id === id) setDraft(null);
  }

  function setDefaultView() {
    const pos = canvasRef.current?.getPosition();
    if (!pos) return;
    updateSelectedStop({ defaultYaw: pos.yaw, defaultPitch: pos.pitch });
    flashSaved();
  }

  async function addScene(file: File) {
    setAddingScene(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/tour-images", { method: "POST", body: form });
      const data = (await res.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? `Upload failed (${res.status}).`);
      }
      const title = humanizeFilename(file.name);
      const id = makeUniqueSceneId(title, stops);
      const newStop: TourStop = { id, title, image: data.url, hotspots: [] };
      persist([...stops, newStop]);
      selectStop(id);
      flashSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add the scene.");
    } finally {
      setAddingScene(false);
    }
  }

  function removeScene(id: string) {
    if (stops.length <= 1) {
      setError("You need at least one scene — add a new one before deleting this.");
      return;
    }
    const target = stops.find((s) => s.id === id);
    const remaining = stops
      .filter((s) => s.id !== id)
      .map((s) => ({
        ...s,
        hotspots: s.hotspots.filter((h) => h.targetStopId !== id),
      }));
    persist(remaining);
    if (selectedId === id) selectStop(remaining[0].id);

    // Uploaded panoramas are owned by the editor and safe to delete from
    // disk; shared site photos under /assets/images are not — only detach
    // those from the tour, don't remove the file.
    if (target?.image.startsWith(UPLOADED_IMAGE_PREFIX)) {
      fetch("/api/tour-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target.image }),
      }).catch(() => {});
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generateTourStopsCode(stops));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function saveAll() {
    setSaveAllState("saving");
    setError(null);
    try {
      const res = await fetch("/api/tour-hotspots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stops }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? `Save failed (${res.status}).`);
      }
      clearStops();
      setSaveAllState("saved");
      setTimeout(() => setSaveAllState("idle"), 1500);
    } catch (e) {
      setSaveAllState("idle");
      setError(
        e instanceof Error ? e.message : "Could not save hotspots to the file.",
      );
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950 text-white">
      <header className="flex shrink-0 items-center gap-4 border-b border-white/10 px-5 py-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
        >
          ← Back to site
        </Link>
        <span className="text-white/30">·</span>
        <h1 className="font-display text-lg tracking-wide text-white">
          Hotspot Editor
        </h1>
        {savedFlash && (
          <span className="text-xs font-medium text-green-400">Saved ✓</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setExportOpen(true)}
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80 hover:bg-white/20"
          >
            Export code
          </button>
          <button
            onClick={saveAll}
            disabled={saveAllState === "saving"}
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-black hover:bg-gold-deep disabled:cursor-wait disabled:opacity-60"
          >
            {saveAllState === "saving"
              ? "Saving…"
              : saveAllState === "saved"
                ? "Saved ✓"
                : "Save all"}
          </button>
        </div>
      </header>

      {error && (
        <div className="flex shrink-0 items-center justify-between border-b border-red-500/20 bg-red-500/10 px-5 py-2 text-xs text-red-300">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="px-1">
            ✕
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <aside className="w-64 shrink-0 overflow-y-auto border-r border-white/10">
          <div className="p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
              Scenes
            </h2>
            <ul className="space-y-1.5">
              {stops.map((s) => {
                const count = s.hotspots.length;
                return (
                  <li key={s.id} className="group relative">
                    <button
                      onClick={() => selectStop(s.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg py-2 pl-2.5 pr-8 text-left transition-colors ${
                        s.id === selectedId
                          ? "bg-gold/15 text-gold"
                          : "text-white/70 hover:bg-white/5"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt=""
                        className="h-9 w-14 shrink-0 rounded object-cover"
                      />
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {s.title}
                      </span>
                      {count > 0 && (
                        <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50">
                          {count}
                        </span>
                      )}
                    </button>
                    {stops.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeScene(s.id);
                        }}
                        title="Delete this scene"
                        aria-label={`Delete ${s.title}`}
                        className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 rounded-md px-1.5 py-1 text-xs text-white/40 hover:bg-red-500/15 hover:text-red-400 group-hover:block"
                      >
                        ✕
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) void addScene(file);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={addingScene}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 py-2.5 text-xs font-medium text-white/60 transition-colors hover:border-gold/40 hover:text-gold disabled:cursor-wait disabled:opacity-60"
            >
              {addingScene ? "Uploading…" : "+ Add Scene"}
            </button>
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 bg-black">
          <HotspotCanvas
            ref={canvasRef}
            src={selected.image}
            hotspots={hotspots}
            placing={placing}
            draftPosition={draft ? { yaw: draft.yaw, pitch: draft.pitch } : null}
            defaultYaw={selected.defaultYaw}
            defaultPitch={selected.defaultPitch}
            onPlace={handlePlace}
            onSelectHotspot={editHotspot}
            className="absolute inset-0"
          />

          {placing && (
            <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center">
              <span className="rounded-full border border-gold/40 bg-black/80 px-4 py-2 text-sm font-medium text-gold">
                {placing === "new"
                  ? "Click anywhere on the panorama to place the hotspot"
                  : "Click the panorama to move this hotspot there"}
              </span>
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 shadow-xl backdrop-blur">
            {placing ? (
              <button
                onClick={() => setPlacing(null)}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
              >
                Cancel placing
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setDraft(null);
                    setPlacing("new");
                  }}
                  className="rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-black hover:bg-gold-deep"
                >
                  + Add Hotspot
                </button>
                <button
                  onClick={setDefaultView}
                  title="Save the current camera angle as this scene's starting view"
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/20"
                >
                  Set as default view
                </button>
              </>
            )}
          </div>
        </main>

        <aside className="w-80 shrink-0 overflow-y-auto border-l border-white/10">
          {draft ? (
            <div
              className="border-b border-white/10 bg-gold/5 p-4"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !(e.target instanceof HTMLTextAreaElement)) {
                  e.preventDefault();
                  saveHotspot();
                }
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gold">
                  {draft.id ? "Edit hotspot" : "New hotspot"}
                </h3>
                <button
                  onClick={cancelDraft}
                  title="Close (Esc)"
                  className="px-1 text-sm leading-none text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["link", "info"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setDraft({ ...draft, type: t })}
                        className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                          draft.type === t
                            ? "bg-gold text-black"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        {t === "link" ? "Link" : "Info"}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[10px] text-white/40">
                    {draft.type === "link"
                      ? "Takes visitors to another scene."
                      : "Shows a small text popup in place."}
                  </p>
                </div>

                {draft.type === "link" ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-white/50">Goes to scene</span>
                    <div className="flex max-h-44 flex-col gap-1 overflow-y-auto">
                      {otherStops.map((s) => {
                        const active = draft.targetStopId === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setDraft({ ...draft, targetStopId: s.id })}
                            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-colors ${
                              active
                                ? "border-gold/60 bg-gold/15"
                                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={s.image}
                              alt=""
                              className="h-7 w-10 shrink-0 rounded object-cover bg-zinc-800"
                            />
                            <span className="flex-1 truncate text-xs font-medium">
                              {s.title}
                            </span>
                            {active && <span className="shrink-0 text-gold">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-white/50">Content</span>
                    <textarea
                      value={draft.content}
                      onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                      rows={3}
                      placeholder="Describe what's here…"
                      className="resize-none rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-sm outline-none focus:border-white/30"
                    />
                  </label>
                )}

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-white/50">
                    Label <span className="text-white/30">(tooltip, optional)</span>
                  </span>
                  <input
                    autoFocus
                    value={draft.label}
                    onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                    placeholder={draft.type === "link" ? "Go to the cardio zone" : "Info"}
                    className="rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-sm outline-none focus:border-white/30"
                  />
                </label>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-white/50">Icon</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, icon: "" })}
                      title="Default for this type"
                      className={`flex h-9 items-center justify-center rounded-lg text-[10px] font-medium transition-colors ${
                        draft.icon === ""
                          ? "bg-gold text-black"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      Auto
                    </button>
                    {HOTSPOT_ICONS.map((ic) => (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setDraft({ ...draft, icon: ic.id })}
                        title={ic.label}
                        className={`flex h-9 items-center justify-center rounded-lg transition-colors ${
                          draft.icon === ic.id
                            ? "bg-gold text-black"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4.5 w-4.5"
                          dangerouslySetInnerHTML={{ __html: ic.svg }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-white/50">Position</span>
                    <span className="font-mono text-[10px] text-white/40">
                      yaw {draft.yaw.toFixed(2)} · pitch {draft.pitch.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => setPlacing((p) => (p === "move" ? null : "move"))}
                    title="Pick a new spot on the panorama"
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      placing === "move"
                        ? "bg-gold text-black"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {placing === "move" ? "Click canvas…" : "Move"}
                  </button>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={saveHotspot}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold text-black transition-colors ${
                      draft.type === "link" && !draft.targetStopId
                        ? "cursor-not-allowed bg-gold/40"
                        : "bg-gold hover:bg-gold-deep"
                    }`}
                  >
                    {draft.id ? "Save changes" : "Add hotspot"}
                  </button>
                  <button
                    onClick={cancelDraft}
                    className="rounded-lg px-3 py-2 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                Hotspots on this scene ({hotspots.length})
              </h3>
              {hotspots.length === 0 ? (
                <p className="text-xs text-white/40">
                  No hotspots yet. Click “+ Add Hotspot” below the photo, then
                  click a spot on the panorama.
                </p>
              ) : (
                <ul className="space-y-2">
                  {hotspots.map((h) => (
                    <li
                      key={h.id}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                    >
                      <span className="min-w-0 flex-1 truncate text-xs font-medium">
                        {h.label || (h.type === "link" ? "Link hotspot" : "Info hotspot")}
                      </span>
                      <span className="shrink-0 text-[10px] uppercase text-white/40">
                        {h.type}
                      </span>
                      <button
                        onClick={() => editHotspot(h.id)}
                        className="shrink-0 text-xs text-white/60 hover:text-gold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHotspot(h.id)}
                        className="shrink-0 text-xs text-white/60 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>
      </div>

      {exportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setExportOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-white">Export hotspot data</h2>
              <button
                onClick={() => setExportOpen(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-sm text-white/60">
              Copy this and paste it over the{" "}
              <code className="text-gold">tourStops</code> array in{" "}
              <code className="text-gold">app/lib/tour-stops.ts</code> to make
              these changes permanent.
            </p>
            <pre className="max-h-96 overflow-auto rounded-lg bg-black p-4 text-xs text-white/80">
              <code>{generateTourStopsCode(stops)}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="mt-4 w-full rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-gold-deep"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
