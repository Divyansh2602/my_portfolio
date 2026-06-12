"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 01 — Surface particle field: points sampled on the facets of stacked,
 * elongated octahedral shards → crystalline silhouette. Curl noise gives
 * each particle a slow drift; a mouse uniform repels particles near the
 * cursor. Whole structure rotates slowly. Count is set by GPU tier
 * (hero-canvas.tsx).
 */

const NOISE_GLSL = /* glsl */ `
// Simplex 3D noise (Ashima / Ian McEwan, MIT)
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 curlNoise(vec3 p){
  const float e = 0.1;
  float n1 = snoise(vec3(p.x, p.y + e, p.z));
  float n2 = snoise(vec3(p.x, p.y - e, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + e));
  float n4 = snoise(vec3(p.x, p.y, p.z - e));
  float n5 = snoise(vec3(p.x + e, p.y, p.z));
  float n6 = snoise(vec3(p.x - e, p.y, p.z));
  float x = (n1 - n2) - (n3 - n4);
  float y = (n3 - n4) - (n5 - n6);
  float z = (n5 - n6) - (n1 - n2);
  return normalize(vec3(x, y, z) / (2.0 * e));
}
`;

const VERTEX = /* glsl */ `
${NOISE_GLSL}

uniform float uTime;
uniform vec3 uMouse;
uniform float uPixelRatio;
uniform float uSize;

attribute vec3 aColor;
attribute float aSeed;

varying vec3 vColor;
varying float vTwinkle;

void main() {
  vec3 p = position;

  // gentle per-particle drift
  vec3 curl = curlNoise(position * 0.4 + uTime * 0.05 + aSeed);
  p += curl * 0.12;

  // cursor repulsion (uMouse in object space)
  vec3 toMouse = p - uMouse;
  float dist = length(toMouse);
  float force = smoothstep(1.6, 0.0, dist);
  p += normalize(toMouse + 0.0001) * force * force * 0.9;

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z);

  vColor = aColor;
  vTwinkle = 0.65 + 0.35 * sin(uTime * (1.5 + aSeed) + aSeed * 40.0);
}
`;

const FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vTwinkle;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.05, d) * vTwinkle;
  if (alpha < 0.01) discard;
  // additive blending stacks fast at 80k points — keep alpha low or the
  // core blows out to white
  gl_FragColor = vec4(vColor, alpha * 0.35);
}
`;

const SILVER = new THREE.Color("#C8D3DC");
const ICE = new THREE.Color("#7DD3FC");

/** Octahedron face corners for surface sampling. */
const OCTA_FACES: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = (() => {
  const px = new THREE.Vector3(1, 0, 0);
  const nx = new THREE.Vector3(-1, 0, 0);
  const py = new THREE.Vector3(0, 1, 0);
  const ny = new THREE.Vector3(0, -1, 0);
  const pz = new THREE.Vector3(0, 0, 1);
  const nz = new THREE.Vector3(0, 0, -1);
  return [
    [px, py, pz], [pz, py, nx], [nx, py, nz], [nz, py, px],
    [px, ny, pz], [pz, ny, nx], [nx, ny, nz], [nz, ny, px],
  ];
})();

interface Shard {
  scale: THREE.Vector3;
  rotation: THREE.Quaternion;
  offset: THREE.Vector3;
}

function buildShards(rand: () => number): Shard[] {
  const shards: Shard[] = [];
  const count = 7;
  for (let i = 0; i < count; i++) {
    const main = i === 0;
    const s = main ? 1 : 0.25 + rand() * 0.45;
    shards.push({
      // elongated on y → crystal spire silhouette
      scale: new THREE.Vector3(s * 1.1, s * (2.2 + rand() * 1.2), s * 1.1),
      rotation: new THREE.Quaternion().setFromEuler(
        new THREE.Euler(rand() * 0.5 - 0.25, rand() * Math.PI * 2, rand() * 0.5 - 0.25)
      ),
      offset: main
        ? new THREE.Vector3(0, 0, 0)
        : new THREE.Vector3(
            (rand() - 0.5) * 3.4,
            (rand() - 0.5) * 2.4,
            (rand() - 0.5) * 3.4
          ),
    });
  }
  return shards;
}

/** Deterministic PRNG so the crystal is identical every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Particles({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const { gl } = useThree();

  const { positions, colors, seeds } = useMemo(() => {
    const rand = mulberry32(20260612);
    const shards = buildShards(rand);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const v = new THREE.Vector3();
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const shard = shards[Math.floor(rand() * shards.length)];
      const [a, b, cc] = OCTA_FACES[Math.floor(rand() * 8)];
      // barycentric surface sample
      let u = rand();
      let w = rand();
      if (u + w > 1) {
        u = 1 - u;
        w = 1 - w;
      }
      v.set(0, 0, 0)
        .addScaledVector(a, u)
        .addScaledVector(b, w)
        .addScaledVector(cc, 1 - u - w);
      v.multiply(shard.scale).applyQuaternion(shard.rotation).add(shard.offset);
      // faint surface jitter so facets read as dust, not solid planes
      v.x += (rand() - 0.5) * 0.06;
      v.y += (rand() - 0.5) * 0.06;
      v.z += (rand() - 0.5) * 0.06;

      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;

      // mostly silver, ~25% ice, brighter toward spire tips
      c.copy(rand() < 0.25 ? ICE : SILVER);
      const lift = 0.55 + 0.45 * Math.min(1, Math.abs(v.y) / 2.5);
      colors[i * 3] = c.r * lift;
      colors[i * 3 + 1] = c.g * lift;
      colors[i * 3 + 2] = c.b * lift;

      seeds[i] = rand();
    }
    return { positions, colors, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
      uSize: { value: 16 },
    }),
    []
  );

  // pointer → object-space point on the z=0 plane, lerped for smoothness
  const ndc = useRef(new THREE.Vector2(99, 99));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    []
  );
  const hit = useMemo(() => new THREE.Vector3(999, 999, 0), []);
  const local = useMemo(() => new THREE.Vector3(999, 999, 0), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      ndc.current.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame((state, delta) => {
    if (!material.current || !group.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;

    group.current.rotation.y += delta * 0.06;

    raycaster.setFromCamera(ndc.current, state.camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      // convert to the rotating group's local space so repulsion tracks
      local.copy(hit);
      group.current.worldToLocal(local);
      material.current.uniforms.uMouse.value.lerp(local, 0.15);
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function HeroParticlesScene({
  count,
  paused,
}: {
  count: number;
  paused: boolean;
}) {
  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      camera={{ position: [0, 0.4, 7.5], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
      }}
      style={{ pointerEvents: "none" }}
    >
      <Particles count={count} />
    </Canvas>
  );
}
