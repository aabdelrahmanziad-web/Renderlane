"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const VIOLET = "#7C5CFF";
const SCALE = 1 / 32; // maps logo SVG units (160x100) to scene units

/** Flat-top hexagon outline, optionally with a hexagonal hole (a ring). */
function hexShape(radius: number, hole?: number) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  if (hole) {
    const path = new THREE.Path();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      const x = Math.cos(a) * hole;
      const y = Math.sin(a) * hole;
      if (i === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    }
    path.closePath();
    shape.holes.push(path);
  }
  return shape;
}

/** The left chevron from the logo, as a 2D shape centred on the logo's middle. */
function chevronShape() {
  const pts: [number, number][] = [
    [30, 18],
    [41, 18],
    [21, 50],
    [41, 82],
    [30, 82],
    [9, 50],
  ];
  const shape = new THREE.Shape();
  pts.forEach(([x, y], i) => {
    const px = (x - 25) * SCALE;
    const py = -(y - 50) * SCALE;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  });
  shape.closePath();
  return shape;
}

type SceneProps = { ready: boolean; quality: "high" | "low" };

function Gem({ ready, quality }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const gem = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const [hovered, setHovered] = useState(false);
  const viewport = useThree((s) => s.viewport);

  const ringGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(hexShape(1.15, 0.78), {
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.06,
      bevelSegments: 4,
      curveSegments: 1,
    });
    g.center();
    return g;
  }, []);

  const chevronGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(chevronShape(), {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 3,
    });
    g.center();
    return g;
  }, []);

  const wide = viewport.width > 6;
  const baseX = wide ? viewport.width * 0.2 : 0;
  const baseScale = wide ? 1 : 0.72;

  useFrame((state, delta) => {
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const { pointer } = state;
    const d = Math.min(delta, 0.05);

    spin.current = THREE.MathUtils.damp(spin.current, 0, 1.6, d);
    if (gem.current) {
      gem.current.rotation.y += d * (0.35 + spin.current + (hovered ? 0.4 : 0));
      gem.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }
    if (core.current) {
      core.current.rotation.y -= d * 0.6;
      core.current.rotation.z += d * 0.3;
    }
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * 0.35 + scroll * 0.8, 4, d);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.55, 4, d);
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, baseX, 3, d);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, scroll * 1.6, 4, d);
      const s = (ready ? baseScale : 0.4) * (hovered ? 1.06 : 1) * (1 - scroll * 0.25);
      group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, s, 3, d));
    }
    const spread = ready ? 1.95 + scroll * 2.2 : 6;
    if (left.current) left.current.position.x = THREE.MathUtils.damp(left.current.position.x, -spread, 2.6, d);
    if (right.current) right.current.position.x = THREE.MathUtils.damp(right.current.position.x, spread, 2.6, d);
    if (rings.current) {
      rings.current.rotation.z += d * 0.08;
      rings.current.rotation.x = THREE.MathUtils.damp(rings.current.rotation.x, pointer.y * 0.4, 2, d);
    }
  });

  return (
    <group ref={group} position={[baseX, 0, 0]} scale={0.4}>
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh
          ref={gem}
          geometry={ringGeo}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => (spin.current += 6)}
        >
          {quality === "high" ? (
            <MeshTransmissionMaterial
              samples={6}
              resolution={512}
              thickness={0.7}
              roughness={0.08}
              transmission={1}
              ior={1.45}
              chromaticAberration={0.12}
              anisotropy={0.2}
              distortion={0.25}
              distortionScale={0.4}
              temporalDistortion={0.1}
              color="#d9cfff"
              background={new THREE.Color("#120b2e")}
            />
          ) : (
            <meshPhysicalMaterial
              color="#b9a8ff"
              metalness={0.2}
              roughness={0.15}
              clearcoat={1}
              iridescence={0.8}
              emissive={VIOLET}
              emissiveIntensity={0.15}
            />
          )}
        </mesh>

        {/* glowing inner core */}
        <mesh ref={core} scale={0.42}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={1.6} roughness={0.3} flatShading />
        </mesh>

        {/* chevrons slide in from the sides */}
        <mesh ref={left} geometry={chevronGeo} position={[-6, 0, 0]}>
          <meshStandardMaterial color="#F5F5F4" metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh ref={right} geometry={chevronGeo} position={[6, 0, 0]} rotation={[0, Math.PI, 0]}>
          <meshStandardMaterial color="#F5F5F4" metalness={0.6} roughness={0.25} />
        </mesh>
      </Float>

      {/* thin hexagonal orbit lines (a torus with 6 segments is a hexagon) */}
      <group ref={rings}>
        {[2.2, 2.8, 3.5].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2.4 + i * 0.35, i * 0.6, 0]}>
            <torusGeometry args={[r, 0.006, 4, 6]} />
            <meshBasicMaterial color={i === 1 ? VIOLET : "#F5F5F4"} transparent opacity={i === 1 ? 0.7 : 0.18} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function HeroScene({ ready }: { ready: boolean }) {
  const quality = useMemo<"high" | "low">(() => {
    if (typeof window === "undefined") return "low";
    const small = window.innerWidth < 768;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    return small || weak ? "low" : "high";
  }, []);

  return (
    <Canvas
      dpr={[1, quality === "high" ? 1.75 : 1.25]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-4, -2, 2]} intensity={30} color={VIOLET} />

      <Gem ready={ready} quality={quality} />

      <Sparkles count={quality === "high" ? 80 : 40} scale={[10, 6, 4]} size={2.2} speed={0.35} color="#a594ff" opacity={0.7} />

      {/* Studio lighting built from light panels: no external HDR file needed */}
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} color={VIOLET} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[5, 1, -1]} scale={[3, 8, 1]} />
          <Lightformer form="ring" intensity={3} color="#a594ff" position={[0, -3, 4]} scale={3} />
        </group>
      </Environment>
    </Canvas>
  );
}
