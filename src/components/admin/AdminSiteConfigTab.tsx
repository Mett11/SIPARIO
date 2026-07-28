import React, { useEffect, useState } from 'react';
import { SiteConfig, Role } from '../../types';
import { TheatreRepository } from '../../lib/repository';
import { Settings, Save, AlertCircle, X } from 'lucide-react';

interface AdminSiteConfigTabProps {
  role: Role;
}

export const AdminSiteConfigTab: React.FC<AdminSiteConfigTabProps> = ({ role }) => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    TheatreRepository.getSiteConfig()
      .then((cfg) => setConfig(cfg))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      await TheatreRepository.updateSiteConfig(config, role);
      setFeedback({ type: 'success', message: 'Configurazione del sito aggiornata con successo!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore durante il salvataggio' });
    }
  };

  if (loading || !config) {
    return <div className="text-center py-12 text-xs text-[#FFFFFF]">Caricamento impostazioni...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1A0505]/15 border border-[#FFFFFF]/30 p-6 rounded-xl flex items-center justify-between">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#FFFFFF]" /> Impostazioni Generali & Contatti
          </h2>
          <p className="text-xs text-[#FFFFFF]/80 mt-1">
            Modifica le informazioni istituzionali dell associazione, i recapiti ufficiali e i link social.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border border-red-500/50 text-red-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {feedback.message}
          </span>
          <button onClick={() => setFeedback(null)} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#050505] border border-[#FFFFFF]/30 p-6 rounded-xl space-y-6 text-xs shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#FFFFFF] font-semibold mb-1">Nome Compagnia / Associazione *</label>
            <input
              type="text"
              required
              value={config.name || ''}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[#FFFFFF] font-semibold mb-1">Città e Provincia *</label>
            <input
              type="text"
              required
              value={config.city || ''}
              onChange={(e) => setConfig({ ...config, city: e.target.value })}
              className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#FFFFFF] font-semibold mb-1">Indirizzo Sede Legale e Operativa *</label>
          <input
            type="text"
            required
            value={config.address || ''}
            onChange={(e) => setConfig({ ...config, address: e.target.value })}
            className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#FFFFFF] font-semibold mb-1">Telefono Ufficiale *</label>
            <input
              type="text"
              required
              value={config.phone || ''}
              onChange={(e) => setConfig({ ...config, phone: e.target.value })}
              className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[#FFFFFF] font-semibold mb-1">Email Istituzionale *</label>
            <input
              type="email"
              required
              value={config.email || ''}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#FFFFFF]/20">
          <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
            Profili Social Ufficiali
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#FFFFFF]/80 mb-1">Facebook URL</label>
              <input
                type="url"
                value={config.facebookUrl || ''}
                onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
              />
            </div>

            <div>
              <label className="block text-[#FFFFFF]/80 mb-1">Instagram URL</label>
              <input
                type="url"
                value={config.instagramUrl || ''}
                onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
              />
            </div>

            <div>
              <label className="block text-[#FFFFFF]/80 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                value={config.youtubeUrl || ''}
                onChange={(e) => setConfig({ ...config, youtubeUrl: e.target.value })}
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[#FFFFFF] font-semibold mb-1">Messaggio Avviso Banner (Opzionale)</label>
          <input
            type="text"
            value={config.noticeMessage || ''}
            onChange={(e) => setConfig({ ...config, noticeMessage: e.target.value })}
            placeholder="Es. Apertura tesseramento stagione 2026/2027"
            className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] font-semibold rounded border border-[#FFFFFF]/60 flex items-center gap-2 transition shadow-lg"
        >
          <Save className="w-4 h-4 text-[#FFFFFF]" />
          <span>Salva Impostazioni</span>
        </button>
      </form>
    </div>
  );
};
