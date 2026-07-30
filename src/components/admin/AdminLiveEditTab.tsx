import React from 'react';

export const AdminLiveEditTab: React.FC = () => {
  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center bg-[#1A0505] p-4 rounded-xl border border-rosso-sipario shrink-0">
        <div>
          <h2 className="text-white font-bold text-lg">Modalità Live Edit</h2>
          <p className="text-gray-400 text-sm">
            Clicca su qualsiasi testo nel sito per modificarlo direttamente. 
            Clicca su un'immagine per inserire un nuovo URL. I salvataggi sono automatici.
          </p>
        </div>
        <div className="text-xs text-white bg-rosso-sipario px-3 py-1 rounded animate-pulse font-bold">
          Live Edit Attivo
        </div>
      </div>
      
      <div className="flex-1 border-4 border-rosso-sipario rounded-xl overflow-hidden bg-nero-palco relative">
        <iframe 
          src="/?liveEdit=true" 
          className="w-full h-full border-0"
          title="Live Edit Editor"
        />
      </div>
    </div>
  );
};
