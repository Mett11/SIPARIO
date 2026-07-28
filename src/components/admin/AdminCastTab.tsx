import React, { useEffect, useState } from 'react';
import { CompanyCastMember, Role } from '../../types';
import { TheatreRepository } from '../../lib/repository';
import { Users, Plus, Edit2, Trash2, X, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface AdminCastTabProps {
  role: Role;
}

export const AdminCastTab: React.FC<AdminCastTabProps> = ({ role }) => {
  const [cast, setCast] = useState<CompanyCastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Partial<CompanyCastMember> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadCast = async () => {
    setLoading(true);
    try {
      const data = await TheatreRepository.getCompanyCast();
      setCast(data);
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Errore durante il caricamento del cast' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCast();
  }, []);

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name || !editingMember.role) return;

    try {
      await TheatreRepository.saveCastMember(editingMember, role);
      setFeedback({ type: 'success', message: 'Componente del cast salvato con successo!' });
      setEditingMember(null);
      loadCast();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore durante il salvataggio' });
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    // if (!confirm(`Sei sicuro di voler rimuovere "${name}" dal cast della compagnia?`)) return;
    try {
      await TheatreRepository.deleteCastMember(id, role);
      setFeedback({ type: 'success', message: 'Componente rimosso dal cast.' });
      loadCast();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore durante l\'eliminazione' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A0505]/20 border border-[#FFFFFF]/30 p-6 rounded-xl">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-rosso-sipario" /> Gestione Cast & Attori della Compagnia
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Aggiungi e gestisci gli attori, i registi e le maestranze de Il Sipario. Inserisci il nome, la foto, il ruolo e le note teatrali.
          </p>
        </div>
        <button
          onClick={() =>
            setEditingMember({
              name: '',
              role: 'Attore',
              photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
              bio: '',
              shows: 'Fiat Voluntas Dei',
            })
          }
          className="px-4 py-2.5 bg-rosso-sipario hover:bg-red-700 text-white font-semibold text-xs rounded-lg border border-white/20 flex items-center gap-2 transition shrink-0 shadow-md"
        >
          <Plus className="w-4 h-4" /> Aggiungi Attore / Componente
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

      {/* Editing Form Modal */}
      {editingMember && (
        <div className="bg-[#0A0A0A] border-2 border-white/40 p-6 rounded-xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <h3 className="font-serif-display text-xl font-bold text-white">
              {editingMember.id ? 'Modifica Componente Cast' : 'Aggiungi Nuovo Attore / Componente'}
            </h3>
            <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 font-semibold mb-1">Nome e Cognome *</label>
                <input
                  type="text"
                  required
                  placeholder="Es. Sebastiano Magliocco"
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full bg-black/60 border border-white/30 rounded p-2.5 text-white focus:border-rosso-sipario outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-200 font-semibold mb-1">Ruolo / Qualifica Teatrale *</label>
                <input
                  type="text"
                  required
                  placeholder="Es. Regista & Attore Protagonista, Scenografo, Attrice..."
                  value={editingMember.role || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full bg-black/60 border border-white/30 rounded p-2.5 text-white focus:border-rosso-sipario outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 font-semibold mb-1">Link Foto dell'Attore (URL Immagine) *</label>
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={editingMember.photoUrl || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, photoUrl: e.target.value })}
                  className="w-full bg-black/60 border border-white/30 rounded p-2.5 text-white focus:border-rosso-sipario outline-none"
                />
                {editingMember.photoUrl && (
                  <img
                    src={editingMember.photoUrl}
                    alt="Anteprima"
                    className="w-10 h-10 object-cover rounded-full border border-white/40 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Incolla l'indirizzo internet della fotografia dell'attore.</p>
            </div>

            <div>
              <label className="block text-gray-200 font-semibold mb-1">Spettacolo / Spettacoli a cui partecipa</label>
              <input
                type="text"
                placeholder="Es. Fiat Voluntas Dei, Miseria e Nobiltà"
                value={editingMember.shows || ''}
                onChange={(e) => setEditingMember({ ...editingMember, shows: e.target.value })}
                className="w-full bg-black/60 border border-white/30 rounded p-2.5 text-white focus:border-rosso-sipario outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-200 font-semibold mb-1">Breve Biografia / Note Teatrali</label>
              <textarea
                rows={3}
                placeholder="Esperienza teatrale, personaggi interpretati..."
                value={editingMember.bio || ''}
                onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                className="w-full bg-black/60 border border-white/30 rounded p-2.5 text-white focus:border-rosso-sipario outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/20">
              <button
                type="submit"
                className="px-6 py-2.5 bg-rosso-sipario hover:bg-red-700 text-white font-semibold rounded border border-white/20 transition"
              >
                Salva Componente Cast
              </button>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-6 py-2.5 bg-black text-gray-300 hover:text-white border border-white/30 rounded"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cast Cards Grid */}
      {loading ? (
        <div className="text-gray-400 text-xs py-8 text-center">Caricamento cast in corso...</div>
      ) : cast.length === 0 ? (
        <div className="bg-[#111] border border-white/20 p-8 rounded-xl text-center text-gray-400 text-xs">
          Nessun componente inserito nel cast. Clicca su "Aggiungi Attore" per iniziare.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cast.map((member) => (
            <div
              key={member.id}
              className="bg-[#0C0C0C] border border-white/20 p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-white/50 transition group"
            >
              <div className="flex items-start gap-4">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-16 h-16 object-cover rounded-full border border-rosso-sipario shrink-0 shadow-md"
                />
                <div className="space-y-1">
                  <h3 className="font-serif-display font-bold text-base text-white">{member.name}</h3>
                  <span className="text-[11px] font-semibold text-rosso-sipario uppercase block">{member.role}</span>
                  {member.shows && (
                    <span className="text-[10px] text-gray-400 block bg-white/5 px-2 py-0.5 rounded border border-white/10 w-fit">
                      🎭 {member.shows}
                    </span>
                  )}
                </div>
              </div>

              {member.bio && (
                <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed border-t border-white/10 pt-3">
                  {member.bio}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => setEditingMember(member)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs flex items-center gap-1 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Modifica
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id, member.name)}
                  className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 rounded text-xs flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
