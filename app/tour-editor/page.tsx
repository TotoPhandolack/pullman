import type { Metadata } from "next";
import HotspotEditor from "../components/editor/HotspotEditorLoader";

export const metadata: Metadata = {
  title: "Hotspot Editor",
  robots: { index: false, follow: false },
};

export default function TourEditorPage() {
  return <HotspotEditor />;
}
