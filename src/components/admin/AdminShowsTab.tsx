import React, { useEffect, useState } from 'react';
import { Show, Role } from '../../types';
import { TheatreRepository } from '../../lib/repository';
import { Film, Plus, Edit2, Trash2, Eye, Globe, ShieldAlert, Check, X, AlertCircle } from 'lucide-react';

interface AdminShowsTabProps {
  role: Role;
  onOpenPreview: (show: Show) => void;
}

export const AdminShowsTab: React.FC<AdminShowsTabProps> = ({ role, onOpenPreview }) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingShow, setEditingShow] = useState<Partial<Show> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadShows = async () => {
    setLoading(true);
    try {
      const data = await TheatreRepository.getAllShows(true);
      setShows(data);
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Errore durante il caricamento' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShows();
  }, []);

  const handleSaveShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShow) return;

    try {
      await TheatreRepository.saveShow(editingShow, role);
      setFeedback({ type: 'success', message: 'Spettacolo salvato con successo!' });
      setEditingShow(null);
      loadShows();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore salvataggio spettacolo' });
    }
  };

  const handleTogglePublish = async (show: Show) => {
    try {
      const isPublished = (show as any).publication_status === 'published';
      await TheatreRepository.publishShow(show.id, !isPublished, role);
      setFeedback({
        type: 'success',
        message: `Spettacolo "${show.title}" ${!isPublished ? 'pubblicato' : 'impostato come bozza'}!`,
      });
      loadShows();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore durante il cambio di stato' });
    }
  };

  const handleDeleteShow = async (id: string, title: string) => {
    // if (!confirm(`Sei sicuro di voler eliminare lo spettacolo "${title}"?`)) return;
    try {
      await TheatreRepository.deleteShow(id, role);
      setFeedback({ type: 'success', message: 'Spettacolo eliminato con successo.' });
      loadShows();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore eliminazione' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A0505]/15 border border-[#FFFFFF]/30 p-6 rounded-xl">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF] flex items-center gap-2">
            <Film className="w-6 h-6 text-[#FFFFFF]" /> Gestione Spettacoli & Cast
          </h2>
          <p className="text-xs text-[#FFFFFF]/80 mt-1">
            Crea, modifica e gestisci la pubblicazione degli spettacoli in cartellone o in archivio.
          </p>
        </div>
        <button
          onClick={() =>
            setEditingShow({
              title: '',
              slug: '',
              subtitle: '',
              author: '',
              director: '',
              category: 'Commedia',
              status: 'in_scena',
              publication_status: 'draft' as any,
              synopsis: '',
              posterUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1200',
              castAndCredits: [],
              validation_status: 'VALIDATED',
            })
          }
          className="px-4 py-2.5 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] font-semibold text-xs rounded-lg border border-[#FFFFFF]/60 flex items-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4 text-[#FFFFFF]" /> Nuovo Spettacolo
        </button>
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

      {/* Editing Modal / Form */}
      {editingShow && (
        <div className="bg-[#050505] border-2 border-[#FFFFFF] p-6 rounded-xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#FFFFFF]/20 pb-4">
            <h3 className="font-serif-display text-xl font-bold text-[#FFFFFF]">
              {editingShow.id ? 'Modifica Spettacolo' : 'Nuovo Spettacolo'}
            </h3>
            <button onClick={() => setEditingShow(null)} className="text-[#FFFFFF]/60 hover:text-[#FFFFFF]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveShow} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Titolo dello Spettacolo *</label>
                <input
                  type="text"
                  required
                  placeholder="Es. Fiat Voluntas Dei"
                  value={editingShow.title || ''}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const autoSlug = newTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setEditingShow({
                      ...editingShow,
                      title: newTitle,
                      slug: editingShow.slug || autoSlug,
                    });
                  }}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">
                  Indirizzo Web Breve (Generato in automatico) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="fiat-voluntas-dei"
                  value={editingShow.slug || ''}
                  onChange={(e) => setEditingShow({ ...editingShow, slug: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Sottotitolo / Genere Dettagliato</label>
                <input
                  type="text"
                  placeholder="Es. Commedia brillante in tre atti"
                  value={editingShow.subtitle || ''}
                  onChange={(e) => setEditingShow({ ...editingShow, subtitle: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Autore dell'Opera</label>
                <input
                  type="text"
                  placeholder="Es. Giuseppe Macrì"
                  value={editingShow.author || ''}
                  onChange={(e) => setEditingShow({ ...editingShow, author: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Regia</label>
                <input
                  type="text"
                  placeholder="Es. Sebastiano Magliocco"
                  value={editingShow.director || ''}
                  onChange={(e) => setEditingShow({ ...editingShow, director: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Categoria Principale *</label>
                <select
                  value={editingShow.category || 'Commedia'}
                  onChange={(e) => setEditingShow({ ...editingShow, category: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                >
                  <option value="Commedia Dialettale">Commedia Dialettale</option>
                  <option value="Commedia Brillante">Commedia Brillante</option>
                  <option value="Teatro Drammatico">Teatro Drammatico</option>
                  <option value="Classici Napoletani / Siciliani">Classici Napoletani / Siciliani</option>
                  <option value="Spettacolo Musicale">Spettacolo Musicale</option>
                </select>
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Stato in Cartellone *</label>
                <select
                  value={editingShow.status || 'in_scena'}
                  onChange={(e) => setEditingShow({ ...editingShow, status: e.target.value as any })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                >
                  <option value="in_scena">In Scena (Attualmente in programmazione)</option>
                  <option value="in_arrivo">In Prossima Apertura</option>
                  <option value="archivio">Archivio Storico Produzioni</option>
                </select>
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Visibilità sul Sito *</label>
                <select
                  value={(editingShow as any).publication_status || 'draft'}
                  onChange={(e) =>
                    setEditingShow({ ...editingShow, publication_status: e.target.value as any })
                  }
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                >
                  <option value="draft">Bozza (Nascosto al pubblico)</option>
                  <option value="published">Pubblicato Visibile Online</option>
                </select>
              </div>
            </div>

            {/* Price Information Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Prezzo Biglietto Intero (€)</label>
                <input
                  type="text"
                  placeholder="Es. 10.00 €"
                  value={editingShow.ticketPriceFull || ''}
                  onChange={(e) => setEditingShow({ ...editingShow, ticketPriceFull: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Prezzo Biglietto Ridotto (€)</label>
                <input
                  type="text"
                  placeholder="Es. 7.00 € (under 18 e over 65)"
                  value={editingShow.ticketPriceReduced || ''}
                  onChange={(e) => setEditingShow({ ...editingShow, ticketPriceReduced: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Dicitura Prezzo Personalizzata</label>
                <input
                  type="text"
                  placeholder="Es. Ingresso € 10,00 - Ridotto € 7,00 / Offerta Libera"
                  value={editingShow.ticketPriceDisplay || ''}
                  onChange={(e) => setEditingShow({ ...editingShow, ticketPriceDisplay: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#FFFFFF] font-semibold mb-1">URL Locandina / Immagine Copertina *</label>
              <input
                type="text"
                required
                value={editingShow.posterUrl || ''}
                onChange={(e) => setEditingShow({ ...editingShow, posterUrl: e.target.value })}
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
              />
            </div>

            <div>
              <label className="block text-[#FFFFFF] font-semibold mb-1">Sinossi e Descrizione *</label>
              <textarea
                required
                rows={4}
                value={editingShow.synopsis || ''}
                onChange={(e) => setEditingShow({ ...editingShow, synopsis: e.target.value })}
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#FFFFFF]/20">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] font-semibold rounded border border-[#FFFFFF]/60"
              >
                Salva Spettacolo
              </button>
              <button
                type="button"
                onClick={() => setEditingShow(null)}
                className="px-6 py-2.5 bg-[#050505] text-[#FFFFFF]/80 hover:text-[#FFFFFF] border border-[#FFFFFF]/30 rounded"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shows List */}
      <div className="grid grid-cols-1 gap-4">
        {shows.map((show) => {
          const isPub = (show as any).publication_status === 'published';
          return (
            <div
              key={show.id}
              className="bg-[#050505] border border-[#FFFFFF]/30 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#FFFFFF] transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={show.posterUrl}
                  alt={show.title}
                  className="w-16 h-20 object-cover rounded border border-[#FFFFFF]/30 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-display text-lg font-bold text-[#FFFFFF]">{show.title}</span>
                    <span
                      className={`text-[10px] uppercase px-2 py-0.5 rounded font-semibold border ${
                        isPub
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                          : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                      }`}
                    >
                      {isPub ? 'LIVE' : 'BOZZA'}
                    </span>
                  </div>
                  <span className="text-xs text-[#FFFFFF] block mt-0.5">
                    {show.category} — {show.author ? `di ${show.author}` : ''} ({show.status})
                  </span>
                  <p className="text-xs text-[#FFFFFF]/70 line-clamp-1 mt-1 max-w-xl">{show.synopsis}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#FFFFFF]/20">
                <button
                  onClick={() => onOpenPreview(show)}
                  className="p-2 bg-[#1A0505]/30 border border-[#FFFFFF]/30 rounded text-[#FFFFFF] hover:bg-[#1A0505] transition flex items-center gap-1 text-xs"
                >
                  <Eye className="w-3.5 h-3.5" /> Anteprima
                </button>

                <button
                  onClick={() => handleTogglePublish(show)}
                  className={`p-2 border rounded transition flex items-center gap-1 text-xs ${
                    isPub
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-950'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> {isPub ? 'Imposta Bozza' : 'Pubblica'}
                </button>

                <button
                  onClick={() => setEditingShow(show)}
                  className="p-2 bg-[#050505] border border-[#FFFFFF]/40 rounded text-[#FFFFFF] hover:bg-[#1A0505]/40 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteShow(show.id, show.title)}
                  className="p-2 bg-red-950/40 border border-red-500/40 rounded text-red-300 hover:bg-red-900/60 transition"
                  title="Elimina Spettacolo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
