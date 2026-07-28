import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-[#050505] text-[#FFFFFF] flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#1A0505] border border-[#FFFFFF] flex items-center justify-center text-[#FFFFFF]">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-widest block">
          Errore 404
        </span>
        <h1 className="font-serif-display text-4xl font-bold text-[#FFFFFF]">
          Pagina Fuori Scena
        </h1>
        <p className="text-xs text-[#FFFFFF]/70 max-w-md mx-auto">
          La pagina richiesta non esiste o è stata spostata nell'archivio della compagnia.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E60000] text-[#FFFFFF] border border-[#FFFFFF]/60 rounded text-xs font-semibold hover:bg-[#1A0505] transition"
      >
        <Home className="w-4 h-4 text-[#FFFFFF]" />
        <span>Rientra in Home Page</span>
      </Link>
    </div>
  );
};
