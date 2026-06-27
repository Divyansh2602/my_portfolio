"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 02 — Profile depth portrait. The photo is rendered as a displaced mesh:
 * a fine plane whose vertices are pushed forward along Z by a depth map
 * (generated locally with Depth-Anything). The result has REAL relief —
 * the nose protrudes, the background sits flat — so when it tilts with the
 * pointer and scroll you see genuine 3D parallax, not a flat plane turning.
 *
 * Textures are loaded manually (not via drei's useTexture/Suspense) so the
 * hook order is always stable.
 */

const PORTRAIT_ASPECT = 414 / 603; // matches the source photo (w/h)

const VERTEX = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uDisplace;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    float depth = texture2D(uDepth, uv).r;   // 1 = closest, 0 = flat background
    vDepth = depth;
    vec3 p = position;
    p.z += depth * uDisplace;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uColor;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    // The flattened background sits at depth 0 and the stretched silhouette
    // "skirt" ramps down toward it — discard those low-depth fragments so the
    // edge stays crisp instead of smearing sideways as the mesh tilts.
    // (0.20 trims <0.2% of the solid figure, measured from the depth map.)
    if (vDepth < 0.20) discard;
    vec4 c = texture2D(uColor, vUv);
    if (c.a < 0.6) discard;                  // drop the soft matte edge
    // faint depth shading so the relief reads even when facing forward
    float shade = 0.82 + 0.18 * vDepth;
    gl_FragColor = vec4(c.rgb * shade, c.a);
  }
`;

function Portrait({ calm }: { calm: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { gl, invalidate } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const [tex, setTex] = useState<{
    color: THREE.Texture;
    depth: THREE.Texture;
  } | null>(null);

  // Load the photo + depth map once. Raw ShaderMaterial samples them directly
  // and writes the texel straight to gl_FragColor, so the sRGB photo displays
  // 1:1 on the sRGB canvas and the depth map is read as raw linear data.
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let alive = true;
    Promise.all([
      loader.loadAsync("/profile.png"),
      loader.loadAsync("/profile-depth.png"),
    ])
      .then(([color, depth]) => {
        if (alive) {
          setTex({ color, depth });
          invalidate(); // ensure a render in "demand" mode once loaded
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [invalidate]);

  // Dispose GPU textures on unmount / swap.
  useEffect(
    () => () => {
      tex?.color.dispose();
      tex?.depth.dispose();
    },
    [tex]
  );

  const uniforms = useMemo(() => {
    if (!tex) return null;
    return {
      uColor: { value: tex.color },
      uDepth: { value: tex.depth },
      uDisplace: { value: 0.28 },
    };
  }, [tex]);

  // Track the pointer across the whole window for a subtle follow tilt.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;

    // scroll-linked tilt: where the canvas sits in the viewport drives rotateX
    const rect = gl.domElement.getBoundingClientRect();
    const prog = (rect.top + rect.height / 2) / window.innerHeight; // 0 top → 1 bottom
    const scrollTilt = calm ? 0 : (prog - 0.5) * 0.32;

    // autonomous idle sway is disabled under reduced-motion ("calm"); the
    // pointer follow stays because it only moves on user input. Amplitudes are
    // kept modest so the silhouette never tilts far enough to smear.
    const swayY = calm ? 0 : Math.sin(t * 0.5) * 0.1;
    const swayX = calm ? 0 : Math.sin(t * 0.4) * 0.04;

    const targetY = pointer.current.x * 0.34 + swayY;
    const targetX = -pointer.current.y * 0.22 + scrollTilt + swayX;

    const ease = 1 - Math.exp(-delta * 4);
    m.rotation.y += (targetY - m.rotation.y) * ease;
    m.rotation.x += (targetX - m.rotation.x) * ease;
  });

  if (!uniforms) return null;

  // plane sized to the photo aspect; many segments so the depth reads smoothly
  const h = 2.2;
  const w = h * PORTRAIT_ASPECT;

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[w, h, 180, 262]} />
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function ProfileDepthScene({
  paused,
  calm,
}: {
  paused: boolean;
  calm: boolean;
}) {
  return (
    <Canvas
      frameloop={paused ? "demand" : "always"}
      camera={{ position: [0, 0, 3.7], fov: 34 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Portrait calm={calm} />
    </Canvas>
  );
}
