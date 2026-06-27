"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery, REDUCED_MOTION_QUERY } from "@/lib/hooks";

const ProfileDepthScene = dynamic(() => import("./profile-depth-scene"), {
  ssr: false,
});

/**
 * Gate for the depth portrait: reduced-motion / no-WebGL readers get the flat
 * cutout instead, and the frameloop pauses while the section is off-screen.
 */
export function ProfileDepth() {
  const wrapper = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapper}
      className="relative w-full"
      style={{ aspectRatio: "414 / 603" }}
    >
      {/* Everyone gets the 3D depth portrait. Under reduced-motion we keep it
          calm (no autonomous sway) — it then only responds to the pointer,
          which is user-initiated and so reduced-motion-friendly. */}
      <div className="absolute inset-0">
        <ProfileDepthScene paused={paused} calm={reduced} />
      </div>
    </div>
  );
}
