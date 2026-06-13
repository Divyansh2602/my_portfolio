"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollSignal } from "@/lib/scroll-signal";

/**
 * Project media plane. Until real screenshots arrive (PLAN.md pending
 * input) it renders a procedural accent-tinted field — gradient, soft
 * glow, scanlines — so there is always something to distort. Hover sends
 * a ripple out from the cursor; scroll velocity drives an RGB channel
 * split. A fullscreen clip-space quad keeps it camera-independent.
 */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uMouse;     // 0..1, cursor in panel space
  uniform float uHover;     // 0..1 eased
  uniform float uRgb;       // channel-split amount (from scroll velocity)
  uniform vec3  uAccent;
  uniform float uAspect;    // width / height

  // procedural "screenshot": vertical gradient + glow + scanlines
  vec3 scene(vec2 uv) {
    float grad = smoothstep(1.0, 0.0, uv.y);
    vec3 base = mix(vec3(0.02, 0.02, 0.03), uAccent * 0.35, grad * 0.9);

    // soft glow toward upper-third
    vec2 g = (uv - vec2(0.6, 0.72));
    g.x *= uAspect;
    float glow = exp(-dot(g, g) * 6.0);
    base += uAccent * glow * 0.5;

    // faint grid / scanlines
    float scan = 0.04 * sin(uv.y * 800.0);
    float grid = 0.03 * step(0.985, fract(uv.x * 14.0));
    base += scan + grid;

    return base;
  }

  void main() {
    vec2 uv = vUv;

    // ripple out from the cursor while hovered
    vec2 d = uv - uMouse;
    d.x *= uAspect;
    float dist = length(d);
    float ripple = sin(dist * 26.0 - uTime * 4.0) * exp(-dist * 5.0);
    uv += normalize(d + 1e-4) * ripple * 0.015 * uHover;

    // RGB split — magnitude from scroll velocity, plus a touch on hover
    float split = uRgb + uHover * 0.004;
    float r = scene(uv + vec2(split, 0.0)).r;
    float g = scene(uv).g;
    float b = scene(uv - vec2(split, 0.0)).b;

    // vignette
    vec2 vig = (vUv - 0.5);
    float v = smoothstep(1.0, 0.2, dot(vig, vig) * 2.2);

    gl_FragColor = vec4(vec3(r, g, b) * v, 1.0);
  }
`;

function Plane({ accent }: { accent: string }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uRgb: { value: 0 },
      uAccent: { value: new THREE.Color(accent) },
      uAspect: { value: 1 },
    }),
    [accent]
  );

  useFrame((state, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += Math.min(delta, 0.1);
    u.uAspect.value = state.size.width / state.size.height;

    // hover target lives on the material via userData (set by events)
    const hoverTarget = (mat.current!.userData.hover as number) ?? 0;
    u.uHover.value += (hoverTarget - u.uHover.value) * 0.12;

    const mt = mat.current!.userData.mouse as THREE.Vector2 | undefined;
    if (mt) u.uMouse.value.lerp(mt, 0.2);

    // scroll-velocity → RGB split, eased and clamped
    const target = Math.min(0.02, Math.abs(scrollSignal.velocity) * 0.0009);
    u.uRgb.value += (target - u.uRgb.value) * 0.1;
  });

  return (
    <mesh
      onPointerMove={(e) => {
        if (!mat.current || e.uv == null) return;
        mat.current.userData.mouse = new THREE.Vector2(e.uv.x, e.uv.y);
      }}
      onPointerOver={() => {
        if (mat.current) mat.current.userData.hover = 1;
      }}
      onPointerOut={() => {
        if (mat.current) mat.current.userData.hover = 0;
      }}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ProjectPanelScene({
  accent,
  paused,
}: {
  accent: string;
  paused: boolean;
}) {
  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <Plane accent={accent} />
    </Canvas>
  );
}
