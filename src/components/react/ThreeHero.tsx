'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, Points, PointMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Hero 3D scene: an "information constellation" — a particle sphere with
 * orbiting data rings around a wireframe core, drifting with the pointer.
 */

function ParticleSphere() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 1400;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 3.1 + (Math.random() - 0.5) * 0.35;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f5d4"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function OrbitRing({ radius, tilt, speed, color }: { radius: number; tilt: [number, number, number]; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <Torus ref={ref} args={[radius, 0.008, 8, 128]} rotation={tilt}>
      <meshBasicMaterial color={color} transparent opacity={0.45} />
    </Torus>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.15;
    ref.current.rotation.y += delta * 0.22;
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.03;
    ref.current.scale.setScalar(s);
  });
  return (
    <Icosahedron ref={ref} args={[1.35, 1]}>
      <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.55} />
    </Icosahedron>
  );
}

function InnerGlow() {
  return (
    <Icosahedron args={[0.55, 2]}>
      <meshBasicMaterial color="#a855f7" transparent opacity={0.35} />
    </Icosahedron>
  );
}

function PointerDrift({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const { x, y } = state.pointer;
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, x * 0.35, 2.5, delta);
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, -y * 0.2, 2.5, delta);
  });
  return <group ref={ref}>{children}</group>;
}

export default function ThreeHero() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0.4, 8], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <PointerDrift>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
          <group position={[2.4, 0.2, 0]}>
            <Core />
            <InnerGlow />
            <ParticleSphere />
            <OrbitRing radius={4.2} tilt={[Math.PI / 2.4, 0.4, 0]} speed={0.25} color="#00f5d4" />
            <OrbitRing radius={4.8} tilt={[Math.PI / 1.9, -0.5, 0]} speed={-0.18} color="#3b82f6" />
            <OrbitRing radius={3.7} tilt={[Math.PI / 2.8, 0.9, 0]} speed={0.35} color="#a855f7" />
          </group>
        </Float>
      </PointerDrift>
      <ambientLight intensity={0.6} />
    </Canvas>
  );
}
