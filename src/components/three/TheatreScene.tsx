import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { StageLights } from './StageLights';
import { TheatreMasks } from './TheatreMasks';
import { StageFrame } from './StageFrame';
import { useQualityProfile } from './useQualityProfile';
import { SceneFallback } from './SceneFallback';
import { PerformanceTelemetry } from './PerformanceTelemetry';
import { UserPreferences } from '../../types';

interface TheatreSceneProps {
  userPreferences?: UserPreferences;
  fallbackText?: string;
  showTelemetry?: boolean;
}

export const TheatreScene: React.FC<TheatreSceneProps> = ({
  userPreferences,
  fallbackText,
  showTelemetry = false,
}) => {
  const quality = useQualityProfile(userPreferences);

  if (!quality.isSupportedWebGL || quality.profileName === 'off') {
    return <SceneFallback message={fallbackText || 'Esperienza 2D Attiva'} />;
  }

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Suspense fallback={<SceneFallback />}>
        <Canvas
          dpr={quality.dpr}
          camera={{ position: [0, 0, 6], fov: 45 }}
          frameloop={quality.enableAnimation ? 'always' : 'demand'}
          gl={{ antialias: quality.profileName === 'high', alpha: true }}
          className="w-full h-full pointer-events-none"
        >
          <StageLights
            enableLights={quality.enableLights}
            enableAnimation={quality.enableAnimation}
          />

          {/* 3D Venetian Masks (Commedia & Tragedia) */}
          <TheatreMasks enableAnimation={quality.enableAnimation} />

          {/* 3D Proscenium Arch & Footlights */}
          <StageFrame enableAnimation={quality.enableAnimation} />

          {quality.profileName !== 'low' && (
            <Sparkles 
              count={quality.particlesCount * 3} 
              scale={12} 
              size={2} 
              speed={0.4} 
              opacity={0.25} 
              color="#FFD700" 
            />
          )}
        </Canvas>
      </Suspense>
      {showTelemetry && <PerformanceTelemetry profile={quality} />}
    </div>
  );
};

export default TheatreScene;
