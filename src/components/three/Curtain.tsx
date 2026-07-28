import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface CurtainProps {
  enableAnimation?: boolean;
}

export const Curtain: React.FC<CurtainProps> = ({ enableAnimation = true }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const [isFullyOpened, setIsFullyOpened] = useState(false);

  useFrame((state) => {
    if (!enableAnimation || isFullyOpened) return;
    
    const time = state.clock.getElapsedTime();
    // Smooth opening curve
    const progress = Math.min(time * 0.3, 1.0);

    if (meshRef.current) {
      // Abstractly move the mesh upwards and fade it out or scale it
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        5.5,
        0.05
      );
      
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        0.1,
        0.05
      );
    }
    
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        0.8,
        0.02
      );
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        0,
        0.05
      );
    }

    if (progress >= 0.99 && meshRef.current?.position.y && meshRef.current.position.y > 5.0) {
      setIsFullyOpened(true);
    }
  });

  if (isFullyOpened) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[15, 10, 64, 64]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#E60000"
        speed={2}
        distort={0.3}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
