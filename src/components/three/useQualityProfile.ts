import { useState, useEffect } from 'react';
import { UserPreferences } from '../../types';

export interface QualityProfile {
  dpr: number;
  particlesCount: number;
  enableLights: boolean;
  enableAnimation: boolean;
  isSupportedWebGL: boolean;
  profileName: 'low' | 'medium' | 'high' | 'off';
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(window.WebGLRenderingContext && gl);
  } catch (e) {
    return false;
  }
}

export function useQualityProfile(userPreferences?: UserPreferences): QualityProfile {
  const [profile, setProfile] = useState<QualityProfile>(() => {
    const hasWebGL = checkWebGLSupport();
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    const isTouchDevice =
      typeof window !== 'undefined'
        ? 'ontouchstart' in window || navigator.maxTouchPoints > 0
        : false;

    const userSetting = userPreferences?.quality3d || 'medium';

    if (
      !hasWebGL ||
      userSetting === 'off' ||
      (userPreferences?.reducedMotion && prefersReducedMotion)
    ) {
      return {
        dpr: 1,
        particlesCount: 0,
        enableLights: false,
        enableAnimation: false,
        isSupportedWebGL: hasWebGL,
        profileName: 'off',
      };
    }

    if (userSetting === 'low' || isTouchDevice || prefersReducedMotion) {
      return {
        dpr: 1,
        particlesCount: 15,
        enableLights: false, // Disabilitato in low quality / reduced motion come da requisiti
        enableAnimation: !prefersReducedMotion && !userPreferences?.reducedMotion,
        isSupportedWebGL: hasWebGL,
        profileName: 'low',
      };
    }

    if (userSetting === 'high') {
      return {
        dpr: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2),
        particlesCount: 60,
        enableLights: true,
        enableAnimation: true,
        isSupportedWebGL: hasWebGL,
        profileName: 'high',
      };
    }

    // Default medium profile
    return {
      dpr: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5),
      particlesCount: 35,
      enableLights: true,
      enableAnimation: !prefersReducedMotion && !userPreferences?.reducedMotion,
      isSupportedWebGL: hasWebGL,
      profileName: 'medium',
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const isTouch =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouch && profile.profileName === 'high') {
        setProfile((prev) => ({ ...prev, dpr: 1.25, particlesCount: 25 }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [profile.profileName]);

  return profile;
}
