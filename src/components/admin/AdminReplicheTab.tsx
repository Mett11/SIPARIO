import React, { useEffect, useState } from 'react';
import { Performance, Show, Role } from '../../types';
import { TheatreRepository } from '../../lib/repository';
import { Calendar, Plus, Edit2, Trash2, Ticket, Users, AlertCircle, X } from 'lucide-react';

interface AdminReplicheTabProps {
  role: Role;
}

export const AdminReplicheTab: React.FC<AdminReplicheTabProps> = ({ role }) => {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPerf, setEditingPerf] = useState<Partial<Performance> | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [perfsData, showsData] = await Promise.all([
        TheatreRepository.getAllPerformances(),
        TheatreRepository.getAllShows(true),
      ]);
      setPerformances(perfsData);
      setShows(showsData);
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Errore caricamento repliche' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper to safely parse date and time strings
  const parseDateAndFormat = (isoStr?: string) => {
    if (!isoStr) {
      const today = new Date().toISOString().slice(0, 10);
      return { dateStr: today, timeStr: '21:00' };
    }
    if (isoStr.includes('T')) {
      const parts = isoStr.split('T');
      return {
        dateStr: parts[0],
        timeStr: parts[1] ? parts[1].slice(0, 5) : '21:00',
      };
    }
    return { dateStr: isoStr.slice(0, 10), timeStr: '21:00' };
  };

  const handleSavePerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerf || !editingPerf.showId) return;

    const selectedShow = shows.find((s) => s.id === editingPerf.showId);
    const perfToSave = {
      ...editingPerf,
      showTitle: selectedShow?.title || editingPerf.showTitle || 'Spettacolo Teatrale',
    };

    try {
      await TheatreRepository.savePerformance(perfToSave, role);
      setFeedback({ type: 'success', message: 'Replica salvata con successo!' });
      setEditingPerf(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Errore salvataggio replica' });
    }
  };

  const handleDeletePerformance = async (id: string) => {
    // if (!confirm('Sei sicuro di voler eliminare questa replica?')) return;
    try {
      await TheatreRepository.deletePerformance(id, role);
      setFeedback({ type: 'success', message: 'Replica eliminata.' });
      loadData();
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
            <Calendar className="w-6 h-6 text-[#FFFFFF]" /> Repliche & Capienza Sala
          </h2>
          <p className="text-xs text-[#FFFFFF]/80 mt-1">
            Programma date e orari dei prossimi spettacoli, imposta capienze fisiche e stato prenotazioni.
          </p>
        </div>
        <button
          onClick={() =>
            setEditingPerf({
              showId: shows[0]?.id || '',
              dateTime: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
              venueName: 'Teatro Comunale G. Verdi',
              venueAddress: 'Via Iblea 4, Canicattini Bagni (SR)',
              capacityTotal: 150,
              seatsReserved: 0,
              bookingOpenAt: new Date().toISOString().slice(0, 10),
              bookingCloseAt: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
              bookingStatus: 'open',
              seatingMode: 'general_admission',
              ticketPriceDisplay: '',
              instructions: 'Presentarsi 20 minuti prima dell inizio.',
            })
          }
          className="px-4 py-2.5 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] font-semibold text-xs rounded-lg border border-[#FFFFFF]/60 flex items-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4 text-[#FFFFFF]" /> Nuova Replica
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

      {/* Editing Form */}
      {editingPerf && (
        <div className="bg-[#050505] border-2 border-[#FFFFFF] p-6 rounded-xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#FFFFFF]/20 pb-4">
            <h3 className="font-serif-display text-xl font-bold text-[#FFFFFF]">
              {editingPerf.id ? 'Modifica Replica' : 'Nuova Replica'}
            </h3>
            <button onClick={() => setEditingPerf(null)} className="text-[#FFFFFF]/60 hover:text-[#FFFFFF]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSavePerformance} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-[#FFFFFF] font-semibold mb-1">Spettacolo Associato *</label>
                <select
                  required
                  value={editingPerf.showId || ''}
                  onChange={(e) => setEditingPerf({ ...editingPerf, showId: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                >
                  <option value="">-- Seleziona uno spettacolo --</option>
                  {shows.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Data dello Spettacolo *</label>
                <input
                  type="date"
                  required
                  value={parseDateAndFormat(editingPerf.dateTime).dateStr}
                  onChange={(e) => {
                    const current = parseDateAndFormat(editingPerf.dateTime);
                    const newDate = e.target.value;
                    setEditingPerf({
                      ...editingPerf,
                      dateTime: `${newDate}T${current.timeStr}:00`,
                    });
                  }}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Ora Inizio Spettacolo *</label>
                <input
                  type="time"
                  required
                  value={parseDateAndFormat(editingPerf.dateTime).timeStr}
                  onChange={(e) => {
                    const current = parseDateAndFormat(editingPerf.dateTime);
                    const newTime = e.target.value;
                    setEditingPerf({
                      ...editingPerf,
                      dateTime: `${current.dateStr}T${newTime}:00`,
                    });
                  }}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Nome Teatro / Luogo *</label>
                <input
                  type="text"
                  required
                  value={editingPerf.venueName || ''}
                  onChange={(e) => setEditingPerf({ ...editingPerf, venueName: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Indirizzo Sede *</label>
                <input
                  type="text"
                  required
                  value={editingPerf.venueAddress || ''}
                  onChange={(e) => setEditingPerf({ ...editingPerf, venueAddress: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Capienza Totale Posti *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editingPerf.capacityTotal || 150}
                  onChange={(e) => setEditingPerf({ ...editingPerf, capacityTotal: Number(e.target.value) })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Posti Riservati Attuali</label>
                <input
                  type="number"
                  min={0}
                  value={editingPerf.seatsReserved || 0}
                  onChange={(e) => setEditingPerf({ ...editingPerf, seatsReserved: Number(e.target.value) })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Stato Prenotazioni *</label>
                <select
                  value={editingPerf.bookingStatus || 'open'}
                  onChange={(e) => setEditingPerf({ ...editingPerf, bookingStatus: e.target.value as any })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                >
                  <option value="open">Aperte (Prenotabile)</option>
                  <option value="closed">Chiuse</option>
                  <option value="sold_out">Tutto Esaurito (Sold Out)</option>
                  <option value="cancelled">Annullata</option>
                </select>
              </div>
            </div>

            {/* Price section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Prezzo Biglietto Intero (€)</label>
                <input
                  type="text"
                  placeholder="Es. 10.00 €"
                  value={editingPerf.ticketPriceFull || ''}
                  onChange={(e) => setEditingPerf({ ...editingPerf, ticketPriceFull: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Prezzo Ridotto (€)</label>
                <input
                  type="text"
                  placeholder="Es. 7.00 € (Under 18 e Over 65)"
                  value={editingPerf.ticketPriceReduced || ''}
                  onChange={(e) => setEditingPerf({ ...editingPerf, ticketPriceReduced: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Note o Dicitura Prezzo Personalizzata</label>
                <input
                  type="text"
                  value={editingPerf.ticketPriceDisplay || ''}
                  onChange={(e) => setEditingPerf({ ...editingPerf, ticketPriceDisplay: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF]"
                  placeholder="Es. Offerta Libera / Ingresso Gratuito"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#FFFFFF]/20">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] font-semibold rounded border border-[#FFFFFF]/60"
              >
                Salva Replica
              </button>
              <button
                type="button"
                onClick={() => setEditingPerf(null)}
                className="px-6 py-2.5 bg-[#050505] text-[#FFFFFF]/80 hover:text-[#FFFFFF] border border-[#FFFFFF]/30 rounded"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Performances List */}
      <div className="grid grid-cols-1 gap-4">
        {performances.map((perf) => {
          const occupancy = Math.round((perf.seatsReserved / perf.capacityTotal) * 100);
          return (
            <div
              key={perf.id}
              className="bg-[#050505] border border-[#FFFFFF]/30 p-5 rounded-xl space-y-3 hover:border-[#FFFFFF] transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FFFFFF]/20 pb-3">
                <div>
                  <span className="font-serif-display text-lg font-bold text-[#FFFFFF] block">
                    {perf.showTitle || 'Spettacolo Teatrale'}
                  </span>
                  <span className="text-xs text-[#FFFFFF]">
                    {new Date(perf.dateTime).toLocaleString('it-IT', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    — {perf.venueName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded border ${
                      perf.bookingStatus === 'open'
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                        : perf.bookingStatus === 'sold_out'
                        ? 'bg-red-950/80 border-red-500/50 text-red-300'
                        : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                    }`}
                  >
                    {perf.bookingStatus.toUpperCase()}
                  </span>

                  <button
                    onClick={() => setEditingPerf(perf)}
                    className="p-1.5 bg-[#050505] border border-[#FFFFFF]/40 rounded text-[#FFFFFF] hover:bg-[#1A0505]/40"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeletePerformance(perf.id)}
                    className="p-1.5 bg-red-950/40 border border-red-500/40 rounded text-red-300 hover:bg-red-900/60"
                    title="Elimina Replica"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Occupancy Indicator */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#FFFFFF]/80">Occupazione Posti In Sala</span>
                  <span className="font-semibold text-[#FFFFFF]">
                    {perf.seatsReserved} / {perf.capacityTotal} Posti ({occupancy}%)
                  </span>
                </div>
                <div className="w-full bg-black h-2.5 rounded-full overflow-hidden border border-[#FFFFFF]/20">
                  <div
                    className={`h-full transition-all duration-500 ${
                      occupancy > 90 ? 'bg-red-500' : occupancy > 60 ? 'bg-amber-500' : 'bg-[#FFFFFF]'
                    }`}
                    style={{ width: `${Math.min(occupancy, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
