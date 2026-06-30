"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollSignal } from "@/lib/scroll-signal";

const GRAVITY = 18;
const JUMP_FORCE = 7;
const SPEED = 4;
const ICE = "#7dd3fc";
const CYAN = "#22d3ee";

// Camera is at [0, 0, 5], fov 50.
// halfH = tan(25°) * 5 ≈ 2.33 world units (half the canvas height in world space).
// Robot local foot Y = -0.60 (bottom of legs).
// Ground world Y = -halfH + 0.60 ≈ -1.73, so feet just touch the canvas bottom.
const HALF_H = Math.tan((25 * Math.PI) / 180) * 5;
const GROUND_Y = -HALF_H + 0.60;

function Robot() {
  const { size, clock } = useThree();
  const robotRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Mesh>(null!);
  const rightLegRef = useRef<THREE.Mesh>(null!);
  const leftArmRef = useRef<THREE.Mesh>(null!);
  const rightArmRef = useRef<THREE.Mesh>(null!);
  const antennaTipRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  const st = useRef({
    x: 0,
    y: 0,
    vy: 0,
    grounded: true,
    facing: 1,
    keys: new Set<string>(),
    antennaTimer: 0,
    antennaOn: true,
  });

  useEffect(() => {
    const s = st.current;
    const down = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      // Prevent Space from triggering page scroll while robot is active
      if (e.key === " ") e.preventDefault();
      s.keys.add(e.key);
    };
    const up = (e: KeyboardEvent) => s.keys.delete(e.key);
    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    if (!robotRef.current) return;
    const s = st.current;
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    // Clamp to half-width minus robot radius so it doesn't exit the canvas
    const halfW = HALF_H * (size.width / size.height) - 0.5;

    // Horizontal input (A/D or arrow keys)
    let dx = 0;
    const ks = s.keys;
    if (ks.has("ArrowLeft") || ks.has("a") || ks.has("A")) dx = -1;
    if (ks.has("ArrowRight") || ks.has("d") || ks.has("D")) dx = 1;

    // Scroll velocity gives a small speed boost
    const boost = Math.abs(scrollSignal.velocity) * 0.3;
    s.x = Math.max(-halfW, Math.min(halfW, s.x + dx * (SPEED + boost) * dt));
    if (dx !== 0) s.facing = Math.sign(dx);

    // Jump (Space / W / ArrowUp)
    if (s.grounded && (ks.has(" ") || ks.has("w") || ks.has("W") || ks.has("ArrowUp"))) {
      s.vy = JUMP_FORCE;
      s.grounded = false;
    }
    s.vy -= GRAVITY * dt;
    s.y += s.vy * dt;
    if (s.y <= 0) {
      s.y = 0;
      s.vy = 0;
      s.grounded = true;
    }

    // Idle hover when standing still
    const hover = s.grounded && dx === 0 ? Math.sin(t * 2) * 0.02 : 0;

    const r = robotRef.current;
    r.position.set(s.x, GROUND_Y + s.y + hover, 0);
    r.rotation.y = s.facing === -1 ? Math.PI : 0;
    // Lean into movement direction, decay when still
    r.rotation.z += (dx * -0.12 - r.rotation.z) * 0.18;

    if (lightRef.current) lightRef.current.position.copy(r.position);

    // Limb swing when walking, decay to rest when idle
    const swing = Math.sin(t * 9);
    if (dx !== 0) {
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing * 0.6;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing * 0.6;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.45;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.45;
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x *= 0.85;
      if (rightLegRef.current) rightLegRef.current.rotation.x *= 0.85;
      if (leftArmRef.current) leftArmRef.current.rotation.x *= 0.85;
      if (rightArmRef.current) rightArmRef.current.rotation.x *= 0.85;
    }

    // Antenna tip blinks between ice and signal every 0.8s
    s.antennaTimer += dt;
    if (s.antennaTimer > 0.8) {
      s.antennaTimer = 0;
      s.antennaOn = !s.antennaOn;
      if (antennaTipRef.current) {
        (antennaTipRef.current.material as THREE.MeshBasicMaterial).color.set(
          s.antennaOn ? CYAN : ICE
        );
      }
    }
  });

  return (
    <>
      <pointLight ref={lightRef} color={CYAN} intensity={1.5} distance={3} />
      <group ref={robotRef}>
        {/* Head */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.22, 8, 6]} />
          <meshBasicMaterial color={ICE} wireframe />
        </mesh>
        {/* Antenna stem */}
        <mesh position={[0, 1.22, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.28, 4]} />
          <meshBasicMaterial color={ICE} wireframe />
        </mesh>
        {/* Antenna tip — blinking signal node */}
        <mesh ref={antennaTipRef} position={[0, 1.38, 0]}>
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial color={CYAN} />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.45, 0.6, 0.25]} />
          <meshBasicMaterial color={ICE} wireframe />
        </mesh>
        {/* Left arm */}
        <mesh ref={leftArmRef} position={[-0.37, 0.25, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.45, 5]} />
          <meshBasicMaterial color={ICE} wireframe />
        </mesh>
        {/* Right arm */}
        <mesh ref={rightArmRef} position={[0.37, 0.25, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.45, 5]} />
          <meshBasicMaterial color={ICE} wireframe />
        </mesh>
        {/* Left leg */}
        <mesh ref={leftLegRef} position={[-0.14, -0.35, 0]}>
          <cylinderGeometry args={[0.09, 0.07, 0.5, 5]} />
          <meshBasicMaterial color={ICE} wireframe />
        </mesh>
        {/* Right leg */}
        <mesh ref={rightLegRef} position={[0.14, -0.35, 0]}>
          <cylinderGeometry args={[0.09, 0.07, 0.5, 5]} />
          <meshBasicMaterial color={ICE} wireframe />
        </mesh>
      </group>
    </>
  );
}

export function AgentBotScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Robot />
    </Canvas>
  );
}
