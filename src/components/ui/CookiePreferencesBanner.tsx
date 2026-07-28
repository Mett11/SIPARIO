import React, { useState } from 'react';
import { Sparkles, Check, X, Eye, Monitor } from 'lucide-react';
import { UserPreferences } from '../../types';

interface CookiePreferencesBannerProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  isOpenModal: boolean;
  onCloseModal: () => void;
}

export const CookiePreferencesBanner: React.FC<CookiePreferencesBannerProps> = ({
  preferences,
  onUpdatePreferences,
  isOpenModal,
  onCloseModal,
}) => {
  const [hasConsented, setHasConsented] = useState(() => preferences.cookieConsent);

  const handleAcceptAll = () => {
    onUpdatePreferences({ cookieConsent: true });
    setHasConsented(true);
  };

  if (!hasConsented && !isOpenModal) {
    return (
      <div 
        className="fixed bottom-0 inset-x-0 z-50 p-4 bg-[#050505]/95 border-t border-[#FFFFFF]/40 backdrop-blur-md shadow-2xl"
        role="dialog"
        aria-live="polite"
        aria-label="Informativa Cookie e Preferenze"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#FFFFFF]/90 leading-relaxed">
            Questo sito utilizza cookie tecnici essenziali per garantire la navigazione e la gestione delle prenotazioni. Rispettiamo la tua privacy e l'accessibilità visiva.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onCloseModal} // Opens preferences modal
              className="px-3 py-1.5 border border-[#FFFFFF]/50 text-[#FFFFFF] hover:bg-[#1A0505]/40 rounded text-xs transition"
            >
              Personalizza
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-1.5 bg-[#E60000] text-[#FFFFFF] hover:bg-[#1A0505] rounded font-medium text-xs transition border border-[#FFFFFF]/40 shadow"
            >
              Accetta Essenziali
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpenModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#050505] border border-[#FFFFFF]/50 rounded-lg max-w-md w-full p-6 text-[#FFFFFF] shadow-2xl relative">
        <button
          onClick={onCloseModal}
          className="absolute top-4 right-4 text-[#FFFFFF]/70 hover:text-[#FFFFFF]"
          aria-label="Chiudi finestra"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#FFFFFF] mb-4">
          <Sparkles className="w-5 h-5" />
          <h2 id="modal-title" className="font-serif-display font-semibold text-lg">
            Preferenze Accessibilità e 3D
          </h2>
        </div>

        <div className="space-y-6 text-xs">
          {/* Reduced Motion Toggle */}
          <div className="border-b border-[#FFFFFF]/20 pb-4">
            <label className="flex items-start justify-between cursor-pointer gap-4">
              <div>
                <span className="font-semibold text-sm block text-[#FFFFFF]">
                  Movimento Ridotto (Reduced Motion)
                </span>
                <span className="text-[#FFFFFF]/70 text-[11px] block mt-0.5">
                  Disabilita o riduce al minimo le animazioni, il sipario 3D e i movimenti di camera.
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.reducedMotion}
                onChange={(e) => onUpdatePreferences({ reducedMotion: e.target.checked })}
                className="mt-1 w-4 h-4 accent-[#FFFFFF] rounded"
              />
            </label>
          </div>

          {/* 3D Quality Selection */}
          <div className="border-b border-[#FFFFFF]/20 pb-4">
            <span className="font-semibold text-sm block text-[#FFFFFF] mb-1">
              Qualità Esperienza 3D (Theatre Canvas)
            </span>
            <p className="text-[#FFFFFF]/70 text-[11px] mb-3">
              Regola il livello di dettaglio grafico del sipario e della scena teatrale.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {(['off', 'low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => onUpdatePreferences({ quality3d: q })}
                  className={`py-1.5 px-2 rounded border text-center font-medium capitalize transition ${
                    preferences.quality3d === q
                      ? 'bg-[#E60000] border-[#FFFFFF] text-[#FFFFFF]'
                      : 'border-[#FFFFFF]/30 text-[#FFFFFF]/70 hover:bg-[#1A0505]/30'
                  }`}
                >
                  {q === 'off' ? 'Disattivo (2D)' : q}
                </button>
              ))}
            </div>
          </div>

          {/* Cookie Notice */}
          <div>
            <span className="font-semibold text-sm block text-[#FFFFFF] mb-1">
              Cookie Tecnici Essenziali
            </span>
            <p className="text-[#FFFFFF]/70 text-[11px]">
              Sempre attivi per memorizzare le tue preferenze e la sessione di prenotazione.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              onUpdatePreferences({ cookieConsent: true });
              setHasConsented(true);
              onCloseModal();
            }}
            className="px-5 py-2 bg-[#E60000] text-[#FFFFFF] hover:bg-[#1A0505] border border-[#FFFFFF]/60 rounded font-medium text-xs transition shadow"
          >
            Salva Preferenze
          </button>
        </div>
      </div>
    </div>
  );
};
