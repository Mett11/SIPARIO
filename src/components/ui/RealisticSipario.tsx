import React from 'react';
import { motion } from 'motion/react';

interface RealisticSiparioProps {
  children: React.ReactNode;
}

export const RealisticSipario: React.FC<RealisticSiparioProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex-1 relative flex flex-col overflow-hidden">
      {/* Main Page Content */}
      <div className="flex-1 flex flex-col">{children}</div>

      {/* Top Mantovana (Scalloped Arch Valance) - Lifts up when curtains open */}
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: '-75%', opacity: 0.9 }}
        exit={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 inset-x-0 h-16 sm:h-20 z-[110] pointer-events-none flex flex-col items-center justify-start drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
      >
        {/* Velvet Scallops */}
        <div
          className="w-full h-12 bg-[#800000] border-b-2 border-[#D4AF37] relative overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(180deg, #3d0000 0%, #800000 50%, #b30000 80%, #5e0000 100%), repeating-linear-gradient(90deg, transparent 0px, transparent 30px, rgba(0,0,0,0.4) 30px, rgba(0,0,0,0.4) 60px)',
          }}
        />
        {/* Scalloped Gold Tassel Trim */}
        <div
          className="w-full h-4 relative"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10px 0, transparent 8px, #D4AF37 8px, #997A15 11px, transparent 11px)',
            backgroundSize: '20px 20px',
          }}
        />
      </motion.div>

      {/* Left Curtain Drape */}
      <motion.div
        initial={{ x: 0, scaleX: 1 }}
        animate={{ x: '-102%', scaleX: 0.9 }}
        exit={{ x: 0, scaleX: 1 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: 'left center' }}
        className="fixed inset-y-0 left-0 w-1/2 bg-[#7A0000] z-[105] pointer-events-none flex flex-col justify-between shadow-[25px_0_60px_rgba(0,0,0,0.9)]"
      >
        {/* Velvet Texture and Folds */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #1f0000 0%, #6e0000 12%, #a80000 22%, #d61818 30%, #850000 40%, #3d0000 50%, #170000 58%, #780000 70%, #b01010 80%, #540000 92%, #1f0000 100%)',
            backgroundSize: '120px 100%',
          }}
        />

        {/* Soft Ambient Light Gradient on Curtain */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

        {/* Right Border: Gold Brocade Trim & Bullion Fringe along central meeting line */}
        <div
          className="absolute top-0 bottom-0 right-0 w-4 sm:w-5 border-l border-r border-[#FFE58F] shadow-2xl"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #D4AF37, #D4AF37 6px, #856404 6px, #856404 12px)',
          }}
        />

        {/* Golden Tie-Back Rope with Tassel Accent (Mid-height) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10 opacity-90">
          <div className="w-8 h-2 bg-gradient-to-r from-[#D4AF37] to-[#856404] rounded-full shadow-lg" />
          <div className="w-4 h-6 bg-[#D4AF37] border border-[#856404] rounded-b-full shadow-xl" />
        </div>

        {/* Bottom Bullion Fringe Trim */}
        <div
          className="absolute bottom-0 inset-x-0 h-6 border-t border-[#FFE58F]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #D4AF37 0px, #D4AF37 3px, #705300 3px, #705300 6px)',
          }}
        />
      </motion.div>

      {/* Right Curtain Drape */}
      <motion.div
        initial={{ x: 0, scaleX: 1 }}
        animate={{ x: '102%', scaleX: 0.9 }}
        exit={{ x: 0, scaleX: 1 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: 'right center' }}
        className="fixed inset-y-0 right-0 w-1/2 bg-[#7A0000] z-[105] pointer-events-none flex flex-col justify-between shadow-[-25px_0_60px_rgba(0,0,0,0.9)]"
      >
        {/* Velvet Texture and Folds */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #1f0000 0%, #540000 8%, #b01010 20%, #780000 30%, #170000 42%, #3d0000 50%, #850000 60%, #d61818 70%, #a80000 78%, #6e0000 88%, #1f0000 100%)',
            backgroundSize: '120px 100%',
          }}
        />

        {/* Soft Ambient Light Gradient on Curtain */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

        {/* Left Border: Gold Brocade Trim & Bullion Fringe along central meeting line */}
        <div
          className="absolute top-0 bottom-0 left-0 w-4 sm:w-5 border-l border-r border-[#FFE58F] shadow-2xl"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, #D4AF37, #D4AF37 6px, #856404 6px, #856404 12px)',
          }}
        />

        {/* Golden Tie-Back Rope with Tassel Accent (Mid-height) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10 opacity-90">
          <div className="w-4 h-6 bg-[#D4AF37] border border-[#856404] rounded-b-full shadow-xl" />
          <div className="w-8 h-2 bg-gradient-to-r from-[#856404] to-[#D4AF37] rounded-full shadow-lg" />
        </div>

        {/* Bottom Bullion Fringe Trim */}
        <div
          className="absolute bottom-0 inset-x-0 h-6 border-t border-[#FFE58F]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #D4AF37 0px, #D4AF37 3px, #705300 3px, #705300 6px)',
          }}
        />
      </motion.div>
    </div>
  );
};
