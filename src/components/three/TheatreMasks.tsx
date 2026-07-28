import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Create a custom 3D Venetian Theatre Mask geometry using Three.js Shape
function createMaskShape() {
  const shape = new THREE.Shape();
  // Outer mask contour
  shape.moveTo(0, 1.2);
  shape.bezierCurveTo(0.8, 1.3, 1.4, 0.9, 1.4, 0.2);
  shape.bezierCurveTo(1.4, -0.6, 0.9, -1.2, 0, -1.3);
  shape.bezierCurveTo(-0.9, -1.2, -1.4, -0.6, -1.4, 0.2);
  shape.bezierCurveTo(-1.4, 0.9, -0.8, 1.3, 0, 1.2);

  // Right Eye cutout
  const rightEye = new THREE.Path();
  rightEye.moveTo(0.25, 0.2);
  rightEye.bezierCurveTo(0.45, 0.35, 0.75, 0.35, 0.85, 0.15);
  rightEye.bezierCurveTo(0.75, 0.0, 0.45, 0.0, 0.25, 0.2);
  shape.holes.push(rightEye);

  // Left Eye cutout
  const leftEye = new THREE.Path();
  leftEye.moveTo(-0.25, 0.2);
  leftEye.bezierCurveTo(-0.45, 0.35, -0.75, 0.35, -0.85, 0.15);
  leftEye.bezierCurveTo(-0.75, 0.0, -0.45, 0.0, -0.25, 0.2);
  shape.holes.push(leftEye);

  return shape;
}

interface TheatreMaskProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  type: 'comedy' | 'tragedy';
  floatSpeed?: number;
}

export const SingleTheatreMask: React.FC<TheatreMaskProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  type,
  floatSpeed = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const maskShape = React.useMemo(() => createMaskShape(), []);

  const extrudeSettings = React.useMemo(
    () => ({
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * floatSpeed;
    // Gentle floating bob and slight rotative sway
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.18;
    groupRef.current.position.x = position[0] + Math.cos(t * 0.5) * 0.08;
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.6) * 0.15;
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.7) * 0.05;
  });

  const isComedy = type === 'comedy';

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Main Mask Face */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[maskShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color={isComedy ? '#FFFDD0' : '#8A0F0F'}
          roughness={0.2}
          metalness={0.4}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Gold Filigree / Accent Trim along brows */}
      <mesh position={[0, 0.3, 0.12]} scale={[1.05, 0.2, 0.05]}>
        <boxGeometry args={[2.2, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Nose Bridge */}
      <mesh position={[0, -0.05, 0.18]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.18, 0.7, 16]} />
        <meshStandardMaterial
          color={isComedy ? '#FFFDD0' : '#8A0F0F'}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Mouth Expression: Smiling or Downturned Expression */}
      <mesh
        position={[0, -0.7, 0.1]}
        rotation={[0, 0, isComedy ? 0 : Math.PI]}
        scale={[1, isComedy ? 1 : 0.8, 1]}
      >
        <torusGeometry args={[0.3, 0.05, 12, 24, Math.PI]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Side Gold Ribbon Details */}
      <mesh position={[-1.2, 0.1, -0.1]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.2, 0.1, -0.1]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

export const TheatreMasks: React.FC<{ enableAnimation?: boolean }> = ({
  enableAnimation = true,
}) => {
  return (
    <group position={[1.8, 0, 0]}>
      {/* Local Spotlight for the Masks on the Right */}
      <pointLight position={[1, 1, 3]} intensity={2.5} color="#FFD700" distance={8} />
      <pointLight position={[-1, -1, 2]} intensity={1.5} color="#E60000" distance={6} />

      {/* Comedy Mask (Golden Ivory) - Facing Right/Center */}
      <SingleTheatreMask
        position={[0.2, 0.6, 0.2]}
        rotation={[0.1, -0.4, 0.05]}
        scale={0.8}
        type="comedy"
        floatSpeed={enableAnimation ? 1 : 0}
      />

      {/* Tragedy Mask (Venetian Crimson Velvet & Gold Trim) - Facing Left towards Comedy Mask */}
      <SingleTheatreMask
        position={[1.8, -0.4, -0.3]}
        rotation={[-0.1, 0.5, -0.1]}
        scale={0.78}
        type="tragedy"
        floatSpeed={enableAnimation ? 0.85 : 0}
      />
    </group>
  );
};
