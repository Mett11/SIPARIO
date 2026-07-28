import React from 'react';

export const SceneFallback: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div 
      className="relative w-full h-full min-h-[350px] bg-[#050505] overflow-hidden flex items-center justify-center border-b border-[#FFFFFF]/20"
      aria-hidden="true"
    >
      {/* CSS Theatre Curtain Background Fallback */}
      <div className="absolute inset-0 curtain-gradient opacity-90" />
      
      {/* Vertical curtain fold effect using repeating linear gradients */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #050505 0px, transparent 20px, #E60000 40px, #1A0505 60px, #050505 80px)'
        }}
      />

      {/* Warm stage light cone overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-gradient-to-b from-[#FFFFFF]/20 via-[#1A0505]/10 to-transparent blur-2xl pointer-events-none" />

      {/* Decorative Stage Arch Border */}
      <div className="absolute inset-x-8 top-4 bottom-0 border-t-2 border-x border-[#FFFFFF]/30 rounded-t-3xl pointer-events-none" />

      {message && (
        <div className="relative z-10 px-4 py-2 bg-[#050505]/80 border border-[#FFFFFF]/40 rounded text-xs text-[#FFFFFF] tracking-wider uppercase">
          {message}
        </div>
      )}
    </div>
  );
};
