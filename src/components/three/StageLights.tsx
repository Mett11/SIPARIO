import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StageLightsProps {
  enableLights?: boolean;
  enableAnimation?: boolean;
}

export const StageLights: React.FC<StageLightsProps> = ({
  enableLights = true,
  enableAnimation = true,
}) => {
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (!enableAnimation || !enableLights || !spotLightRef.current) return;
    const time = state.clock.getElapsedTime();
    // Gentle sway of striking spotlight beam
    spotLightRef.current.position.x = Math.sin(time * 0.5) * 2;
    spotLightRef.current.position.z = Math.cos(time * 0.2) * 1 + 2;
  });

  // Basic static ambient lighting always present
  if (!enableLights) {
    return (
      <>
        <ambientLight intensity={0.5} color="#FFFFFF" />
        <directionalLight position={[0, 4, 3]} intensity={0.4} color="#E60000" />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.2} color="#FFFFFF" />
      <directionalLight position={[0, 5, 5]} intensity={0.3} color="#FFFFFF" />

      {/* Dramatic Spot Light */}
      <spotLight
        ref={spotLightRef}
        position={[0, 4.2, 3]}
        angle={0.65}
        penumbra={0.5}
        intensity={4}
        color="#E60000"
        castShadow={false}
      />

      {/* Subtle Cold Balcony Fill Light */}
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#333333" />
    </>
  );
};
