import React, { useState } from 'react';
import { Save, RefreshCw, CheckCircle2, Info, Eye } from 'lucide-react';
import { LiveEditManager } from '../../lib/liveEdit';

export const AdminLiveEditTab: React.FC = () => {
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleSaveChanges = () => {
    const overrides = LiveEditManager.getOverrides();
    const count = Object.keys(overrides).length;
    // Overrides are already saved on blur/upload in localStorage, but this gives explicit feedback
    setSavedStatus(`Tutte le ${count} modifiche al layout e ai testi sono state salvate!`);
    setTimeout(() => setSavedStatus(null), 4000);
  };

  const handleResetChanges = () => {
    if (confirm('Sei sicuro di voler ripristinare i testi e le immagini originali del sito?')) {
      LiveEditManager.clearOverrides();
      setSavedStatus('Modifiche ripristinate agli originali.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1A0505] p-4 rounded-xl border border-rosso-sipario shrink-0 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-lg">Modalità Editor Live</h2>
            <span className="text-[10px] text-white bg-rosso-sipario px-2 py-0.5 rounded font-bold animate-pulse">
              LIVE
            </span>
          </div>
          <p className="text-gray-300 text-xs mt-1">
            • <strong>Titoli (H1-H6) e Paragrafi (P):</strong> Clicca direttamente sul testo per modificarlo.<br />
            • <strong>Immagini:</strong> Clicca su un'immagine per caricarne una nuova dal tuo dispositivo.<br />
            • <strong>Navigazione:</strong> Clicca sui link e sui menu per cambiare pagina restando nell'editor.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={handleResetChanges}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition font-medium border border-gray-600"
            title="Ripristina testi originali"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ripristina</span>
          </button>

          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 px-4 py-2 bg-rosso-sipario hover:bg-red-700 text-white text-xs rounded-lg font-bold shadow-lg transition"
          >
            <Save className="w-4 h-4" />
            <span>Salva Modifiche</span>
          </button>
        </div>
      </div>

      {savedStatus && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs p-3 rounded-lg flex items-center justify-between animate-fade-in shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedStatus}</span>
          </div>
        </div>
      )}

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

