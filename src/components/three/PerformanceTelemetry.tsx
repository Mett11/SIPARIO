import React, { useState, useEffect } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { QualityProfile } from './useQualityProfile';

interface TelemetryProps {
  profile: QualityProfile;
}

export const PerformanceTelemetry: React.FC<TelemetryProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fps, setFps] = useState<number>(60);
  const [frameTime, setFrameTime] = useState<number>(16.6);
  const [dropCount, setDropCount] = useState<number>(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 1000) {
        const calculatedFps = Math.round((frameCount * 1000) / delta);
        const calculatedMs = Math.round((delta / frameCount) * 10) / 10;
        setFps(calculatedFps);
        setFrameTime(calculatedMs);

        if (calculatedFps < 45) {
          setDropCount((prev) => prev + 1);
        }

        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <aside 
      aria-label="Telemetria prestazioni Three.js"
      className="fixed bottom-4 left-4 z-40 text-[11px] font-mono pointer-events-auto"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#050505]/90 border border-[#FFFFFF]/40 rounded-lg text-[#FFFFFF] hover:bg-[#1A0505] transition shadow-lg"
        title="Telemetria Prestazioni Render"
      >
        <Activity className="w-3.5 h-3.5 text-[#FFFFFF]" />
        <span>3D Profilo: {profile.profileName.toUpperCase()}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] ${fps >= 50 ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
          {fps} FPS
        </span>
        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="mt-2 p-3 bg-[#050505]/95 border border-[#FFFFFF]/50 rounded-xl space-y-1.5 text-[#FFFFFF] shadow-2xl backdrop-blur-md w-56">
          <div className="flex justify-between border-b border-[#FFFFFF]/20 pb-1 text-[#FFFFFF] font-semibold">
            <span>Telemetria Realtime</span>
            <span className="uppercase text-[10px]">{profile.profileName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#FFFFFF]/70">Frequenza Frame:</span>
            <span className="font-bold">{fps} FPS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#FFFFFF]/70">Frame Time:</span>
            <span>{frameTime} ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#FFFFFF]/70">DPR Render:</span>
            <span>{profile.dpr}x</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#FFFFFF]/70">Fasci Luci:</span>
            <span>{profile.enableLights ? 'Attivi' : 'Disabilitati'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#FFFFFF]/70">Drop Frame Count:</span>
            <span className={dropCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{dropCount}</span>
          </div>
        </div>
      )}
    </aside>
  );
};
