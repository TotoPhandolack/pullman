"use client";

import dynamic from "next/dynamic";

const HotspotEditor = dynamic(() => import("./HotspotEditor"), {
  ssr: false,
});

export default HotspotEditor;
