import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingPosterProps {
  enableAnimation?: boolean;
}

export const FloatingPoster: React.FC<FloatingPosterProps> = ({ enableAnimation = true }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!enableAnimation || !groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    groupRef.current.rotation.y = time * 0.1;
    
    if (meshRef1.current) {
      meshRef1.current.rotation.z = time * 0.2;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = time * -0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <mesh ref={meshRef1} position={[0, 0, 0]}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#E60000" wireframe transparent opacity={0.3} />
      </mesh>
      
      <mesh ref={meshRef2} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} transparent opacity={0.15} />
      </mesh>
    </group>
  );
};
