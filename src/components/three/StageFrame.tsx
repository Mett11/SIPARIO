import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const StageFrame: React.FC<{ enableAnimation?: boolean }> = ({
  enableAnimation = true,
}) => {
  const footlightsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!enableAnimation || !footlightsRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle pulsating warm glow on footlights
    footlightsRef.current.children.forEach((child, idx) => {
      if (child instanceof THREE.PointLight) {
        child.intensity = 1.2 + Math.sin(t * 2 + idx) * 0.3;
      }
    });
  });

  return (
    <group position={[0, 0, -2]}>
      {/* 1. Proscenium Arch Frame (Inquadratura del Boccascena) */}
      {/* Top Arch Bar */}
      <mesh position={[0, 3.8, 0]}>
        <boxGeometry args={[14, 0.4, 0.4]} />
        <meshStandardMaterial color="#8B0000" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 3.6, 0.1]}>
        <boxGeometry args={[14.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Left Column */}
      <mesh position={[-6.2, 0, 0]}>
        <boxGeometry args={[0.5, 8, 0.4]} />
        <meshStandardMaterial color="#8B0000" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[-5.9, 0, 0.1]}>
        <boxGeometry args={[0.1, 8, 0.2]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Right Column */}
      <mesh position={[6.2, 0, 0]}>
        <boxGeometry args={[0.5, 8, 0.4]} />
        <meshStandardMaterial color="#8B0000" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[5.9, 0, 0.1]}>
        <boxGeometry args={[0.1, 8, 0.2]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* 2. Footlights / Luci della Ribalta along bottom */}
      <group ref={footlightsRef} position={[0, -3.2, 1]}>
        {/* Footlight Brass Bar */}
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 10, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Footlight Bulbs & Warm Point Lights */}
        {[-4, -2.5, -1, 0, 1, 2.5, 4].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            {/* Brass Housing Shell */}
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Glowing Bulb Mesh */}
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
            {/* Upward Point Light */}
            <pointLight
              color="#FF8C00"
              intensity={1.2}
              distance={4}
              decay={2}
              position={[0, 0.2, 0]}
            />
          </group>
        ))}
      </group>
    </group>
  );
};
