import React, { useState, useEffect } from 'react';
import { BookingRequest, BookingRequestStatus, Performance, Role, BookingEvent, BookingSettings } from '../../types';
import { TheatreRepository } from '../../lib/repository';
import {
  Ticket,
  Search,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  UserCheck,
  Mail,
  RefreshCw,
  Eye,
  Settings,
  Check,
  Trash2,
} from 'lucide-react';

interface Props {
  role: Role;
}

export const AdminPrenotazioniTab: React.FC<Props> = ({ role }) => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    totalConfirmedSeats: 0,
    totalCheckedInSeats: 0,
    totalWaitlistSeats: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedPerformanceId, setSelectedPerformanceId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick Check-in Code
  const [quickCheckInCode, setQuickCheckInCode] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string } | null>(null);

  // Detail / History Modal
  const [activeBookingDetail, setActiveBookingDetail] = useState<{
    booking: BookingRequest;
    events: BookingEvent[];
  } | null>(null);

  // Status Change Modal
  const [statusModalBooking, setStatusModalBooking] = useState<BookingRequest | null>(null);
  const [newStatus, setNewStatus] = useState<BookingRequestStatus>('confirmed');
  const [statusReason, setStatusReason] = useState('');

  // Settings Modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<BookingSettings | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const perfs = await TheatreRepository.getAllPerformances();
      setPerformances(perfs);

      const res = await TheatreRepository.getAdminBookings(
        {
          performanceId: selectedPerformanceId !== 'all' ? selectedPerformanceId : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          search: searchQuery ? searchQuery : undefined,
        },
        role
      );
      setBookings(res.data);
      setMetrics(res.metrics);
    } catch (err: any) {
      setError(err.message || 'Errore durante il caricamento delle prenotazioni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPerformanceId, selectedStatus, searchQuery, role]);

  const handleQuickCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCheckInCode.trim()) return;
    try {
      const res = await TheatreRepository.checkInBooking(quickCheckInCode.trim(), role);
      setCheckInResult({ success: true, message: res.message });
      setQuickCheckInCode('');
      loadData();
    } catch (err: any) {
      setCheckInResult({ success: false, message: err.message || 'Errore check-in' });
    }
  };

  const handleOpenDetail = async (booking: BookingRequest) => {
    try {
      const res = await TheatreRepository.getBookingDetail(booking.id, role);
      setActiveBookingDetail({ booking: res.data, events: res.events });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalBooking) return;
    try {
      await TheatreRepository.updateBookingStatus(statusModalBooking.id, newStatus, statusReason, role);
      setStatusModalBooking(null);
      setStatusReason('');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResendEmail = async (booking: BookingRequest) => {
    try {
      await TheatreRepository.resendBookingEmail(booking.id, role);
    } catch (err: any) {
      setError(`Errore durante il reinvio dell'email: ${err.message}`);
    }
  };

  const handleDeleteBooking = async (booking: BookingRequest) => {
    // if (!confirm(`Sei sicuro di voler eliminare la prenotazione ${booking.code} di "${booking.fullName}"?`)) return;
    try {
      await TheatreRepository.deleteBooking(booking.id, role);
      loadData();
    } catch (err: any) {
      setError(`Errore eliminazione: ${err.message}`);
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await TheatreRepository.exportBookingsCsv(
        {
          performanceId: selectedPerformanceId !== 'all' ? selectedPerformanceId : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
        },
        role
      );
      const blob = new Blob([res.csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', res.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOpenSettings = async () => {
    try {
      const settings = await TheatreRepository.getBookingSettings(role);
      setSettingsForm(settings);
      setIsSettingsModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      await TheatreRepository.updateBookingSettings(settingsForm, role);
      setIsSettingsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status: BookingRequestStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"><CheckCircle className="w-3 h-3"/> Confermata</span>;
      case 'checked_in':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-500/40"><UserCheck className="w-3 h-3"/> Ingresso Effettuato</span>;
      case 'waitlist':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40"><Clock className="w-3 h-3"/> Lista d'Attesa</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-950/80 text-yellow-300 border border-yellow-500/40"><AlertTriangle className="w-3 h-3"/> In Lavorazione</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-500/40"><XCircle className="w-3 h-3"/> Annullata</span>;
      case 'expired':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-900 text-gray-400 border border-gray-700"><Clock className="w-3 h-3"/> Scaduta</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">{status}</span>;
    }
  };

  const formatEventName = (type: string) => {
    switch (type) {
      case 'CREATED': return 'Richiesta Creata';
      case 'EMAIL_SENT': return 'Email Inviata';
      case 'STATUS_CHANGED': return 'Stato Modificato';
      case 'CHECKED_IN': return 'Ingresso Effettuato';
      default: return type;
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFFFFF]/30 pb-6">
        <div>
          <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
            Gestione Biglietteria & Cassa
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#FFFFFF] mt-1 flex items-center gap-3">
            <Ticket className="w-8 h-8 text-[#FFFFFF]" /> Prenotazioni & Accoglienza Spettatori
          </h1>
          <p className="text-xs text-[#FFFFFF]/80 mt-1">
            Gestione delle prenotazioni, verifica posti, ingressi in cassa ed esportazione elenchi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <button
              onClick={handleOpenSettings}
              className="px-3.5 py-2 bg-[#1A0505]/40 border border-[#FFFFFF]/40 text-[#FFFFFF] text-xs font-semibold rounded-lg hover:bg-[#1A0505] transition flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-[#FFFFFF]" /> Impostazioni Regole
            </button>
          )}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-xl space-y-1">
          <span className="text-[11px] text-[#FFFFFF] uppercase font-semibold block">Prenotazioni Totali</span>
          <span className="font-serif-display text-2xl font-bold text-[#FFFFFF]">{metrics.totalBookings}</span>
          <span className="text-[10px] text-[#FFFFFF]/60 block">Richieste registrate</span>
        </div>

        <div className="p-4 bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-xl space-y-1">
          <span className="text-[11px] text-emerald-400 uppercase font-semibold block">Posti Confermati</span>
          <span className="font-serif-display text-2xl font-bold text-emerald-300">{metrics.totalConfirmedSeats}</span>
          <span className="text-[10px] text-[#FFFFFF]/60 block">In attesa di ingresso</span>
        </div>

        <div className="p-4 bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-xl space-y-1">
          <span className="text-[11px] text-purple-400 uppercase font-semibold block">Posti Entrati in Sala</span>
          <span className="font-serif-display text-2xl font-bold text-purple-300">{metrics.totalCheckedInSeats}</span>
          <span className="text-[10px] text-[#FFFFFF]/60 block">Spettatori accomodati</span>
        </div>

        <div className="p-4 bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-xl space-y-1">
          <span className="text-[11px] text-amber-400 uppercase font-semibold block">In Lista d'Attesa</span>
          <span className="font-serif-display text-2xl font-bold text-amber-300">{metrics.totalWaitlistSeats}</span>
          <span className="text-[10px] text-[#FFFFFF]/60 block">In attesa di disponibilità</span>
        </div>
      </div>

      {/* Quick Check-in Bar */}
      <div className="bg-[#050505] border border-[#FFFFFF]/40 p-5 rounded-xl space-y-3">
        <h2 className="text-sm font-semibold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
          <UserCheck className="w-4 h-4" /> Ingresso Veloce Cassa (Check-in)
        </h2>
        <form onSubmit={handleQuickCheckIn} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickCheckInCode}
              onChange={(e) => setQuickCheckInCode(e.target.value.toUpperCase())}
              placeholder="Inserisci o scansiona Codice Prenotazione (es. SIP-2026-X7K9P2)"
              className="w-full bg-[#1A1212] border border-[#FFFFFF]/40 rounded-lg px-3.5 py-2.5 text-sm text-[#FFFFFF] placeholder-[#FFFFFF]/40 focus:outline-none focus:border-[#FFFFFF] font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#E60000] text-[#FFFFFF] font-semibold text-xs rounded-lg border border-[#FFFFFF]/60 hover:bg-[#1A0505] transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-[#FFFFFF]" /> Conferma Ingresso
          </button>
        </form>

        {checkInResult && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 ${
              checkInResult.success
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/80 border border-red-500/50 text-red-300'
            }`}
          >
            <span>{checkInResult.message}</span>
            <button onClick={() => setCheckInResult(null)} className="text-xs opacity-60 hover:opacity-100">
              Chiudi
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#1A0505]/10 border border-[#FFFFFF]/20 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {/* Performance Filter */}
          <select
            value={selectedPerformanceId}
            onChange={(e) => setSelectedPerformanceId(e.target.value)}
            className="bg-[#050505] border border-[#FFFFFF]/30 rounded-lg p-2 text-xs text-[#FFFFFF]"
          >
            <option value="all">Tutte le Repliche in Cartellone</option>
            {performances.map((p) => (
              <option key={p.id} value={p.id}>
                {p.showTitle} ({new Date(p.dateTime).toLocaleDateString('it-IT')})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#050505] border border-[#FFFFFF]/30 rounded-lg p-2 text-xs text-[#FFFFFF]"
          >
            <option value="all">Tutti gli Stati</option>
            <option value="confirmed">Confermate</option>
            <option value="checked_in">Ingresso Effettuato</option>
            <option value="waitlist">Lista d'Attesa</option>
            <option value="pending">In Lavorazione</option>
            <option value="cancelled">Annullate</option>
          </select>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#FFFFFF] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca nome, email, codice, telefono..."
              className="w-full bg-[#050505] border border-[#FFFFFF]/30 rounded-lg pl-9 pr-3 py-2 text-xs text-[#FFFFFF] placeholder-[#FFFFFF]/40 focus:outline-none focus:border-[#FFFFFF]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            title="Ricarica elenco"
            className="p-2 bg-[#050505] border border-[#FFFFFF]/30 rounded-lg text-[#FFFFFF] hover:bg-[#1A0505]/30"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-[#1A0505]/40 border border-[#FFFFFF]/40 rounded-lg text-xs font-semibold text-[#FFFFFF] hover:bg-[#1A0505] transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#FFFFFF]" /> Esporta per la Cassa (CSV)
          </button>
        </div>
      </div>

      {/* Bookings Data Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#FFFFFF]/60">Caricamento registro prenotazioni in corso...</div>
      ) : error ? (
        <div className="p-4 bg-red-950/80 border border-red-500/40 text-red-300 rounded-lg text-xs">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center bg-[#050505] border border-[#FFFFFF]/20 rounded-xl space-y-2">
          <Ticket className="w-8 h-8 text-[#FFFFFF]/40 mx-auto" />
          <p className="text-sm text-[#FFFFFF]/70">Nessuna prenotazione trovata con i filtri selezionati.</p>
        </div>
      ) : (
        <div className="bg-[#050505] border border-[#FFFFFF]/30 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#FFFFFF]/90">
              <thead className="bg-[#1A0505]/30 text-[#FFFFFF] uppercase text-[10px] tracking-wider border-b border-[#FFFFFF]/30 font-semibold">
                <tr>
                  <th className="p-3.5">Codice</th>
                  <th className="p-3.5">Spettatore</th>
                  <th className="p-3.5">Spettacolo & Replica</th>
                  <th className="p-3.5 text-center">Posti</th>
                  <th className="p-3.5">Stato</th>
                  <th className="p-3.5">Data Richiesta</th>
                  <th className="p-3.5 text-right">Azioni Cassa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFFFFF]/15">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#1A0505]/10 transition">
                    <td className="p-3.5 font-mono font-bold text-[#FFFFFF]">
                      {b.code}
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <div className="font-semibold text-[#FFFFFF]">{b.fullName}</div>
                      <div className="text-[10px] text-[#FFFFFF]/60">{b.email} • {b.phone}</div>
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <div className="font-medium text-[#FFFFFF]">{b.showTitle}</div>
                      <div className="text-[10px] text-[#FFFFFF]">
                        {new Date(b.performanceDateTime).toLocaleString('it-IT', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-bold text-sm text-[#FFFFFF]">
                      {b.seatsCount}
                    </td>
                    <td className="p-3.5">{getStatusBadge(b.status)}</td>
                    <td className="p-3.5 text-[11px] text-[#FFFFFF]/60">
                      {new Date(b.createdAt).toLocaleDateString('it-IT')}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {b.status === 'confirmed' && (
                        <button
                          onClick={async () => {
                            try {
                              await TheatreRepository.checkInBooking(b.code, role);
                              loadData();
                            } catch (e: any) {
                              setError(e.message);
                            }
                          }}
                          className="px-2 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 rounded text-[10px] font-semibold hover:bg-purple-900"
                          title="Conferma ingresso dello spettatore alla cassa"
                        >
                          Check-in
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenDetail(b)}
                        className="px-2 py-1 bg-[#1A0505]/30 border border-[#FFFFFF]/30 text-[#FFFFFF] rounded text-[10px] hover:bg-[#1A0505]"
                        title="Vedi dettagli della prenotazione"
                      >
                        <Eye className="w-3 h-3 inline mr-1" /> Dettagli
                      </button>

                      <button
                        onClick={() => {
                          setStatusModalBooking(b);
                          setNewStatus(b.status);
                        }}
                        className="px-2 py-1 bg-[#1A0505]/30 border border-[#FFFFFF]/30 text-[#FFFFFF] rounded text-[10px] hover:bg-[#1A0505]"
                        title="Cambia Stato"
                      >
                        Stato
                      </button>

                      <button
                        onClick={() => handleResendEmail(b)}
                        className="px-2 py-1 bg-[#1A0505]/30 border border-[#FFFFFF]/30 text-[#FFFFFF] rounded text-[10px] hover:bg-[#1A0505]"
                        title="Reinvia Email Notifica"
                      >
                        <Mail className="w-3 h-3 inline mr-1" /> Reinvia Email
                      </button>

                      <button
                        onClick={() => handleDeleteBooking(b)}
                        className="px-2 py-1 bg-red-950/60 border border-red-500/40 text-red-200 rounded text-[10px] hover:bg-red-900"
                        title="Elimina Prenotazione"
                      >
                        <Trash2 className="w-3 h-3 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Booking Detail & History Timeline */}
      {activeBookingDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#050505] border border-[#FFFFFF] rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#FFFFFF]/30 pb-4">
              <div>
                <span className="text-xs font-mono text-[#FFFFFF] uppercase block">
                  Codice Prenotazione: {activeBookingDetail.booking.code}
                </span>
                <h3 className="font-serif-display text-2xl font-bold text-[#FFFFFF]">
                  {activeBookingDetail.booking.fullName}
                </h3>
              </div>
              <button
                onClick={() => setActiveBookingDetail(null)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#1A0505]/10 border border-[#FFFFFF]/20 rounded-lg space-y-1">
                <span className="text-[10px] text-[#FFFFFF] uppercase font-semibold block">Spettacolo & Data</span>
                <div className="font-semibold text-[#FFFFFF]">{activeBookingDetail.booking.showTitle}</div>
                <div className="text-[#FFFFFF]/70">
                  {new Date(activeBookingDetail.booking.performanceDateTime).toLocaleString('it-IT')}
                </div>
              </div>

              <div className="p-3 bg-[#1A0505]/10 border border-[#FFFFFF]/20 rounded-lg space-y-1">
                <span className="text-[10px] text-[#FFFFFF] uppercase font-semibold block">Contatti & Posti</span>
                <div className="text-[#FFFFFF]">{activeBookingDetail.booking.email}</div>
                <div className="text-[#FFFFFF]">{activeBookingDetail.booking.phone}</div>
                <div className="font-bold text-[#FFFFFF]">{activeBookingDetail.booking.seatsCount} Posti Riservati</div>
              </div>
            </div>

            {/* Privacy Consent Tag */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Consenso Privacy e Condizioni Accettato
              </div>
              <div className="text-[10px] opacity-80">
                Data consenso: {new Date(activeBookingDetail.booking.privacyConsentedAt || activeBookingDetail.booking.createdAt).toLocaleString('it-IT')}
              </div>
            </div>

            {/* Note Spettatore */}
            {activeBookingDetail.booking.notes && (
              <div className="p-3 bg-[#1A1212] border border-[#FFFFFF]/30 rounded-lg text-xs space-y-1">
                <span className="text-[10px] text-[#FFFFFF] uppercase font-semibold block">Note dello Spettatore</span>
                <p className="italic text-[#FFFFFF]/80">"{activeBookingDetail.booking.notes}"</p>
              </div>
            )}

            {/* Timeline Booking Events */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
                Storico Attività della Prenotazione
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {activeBookingDetail.events.map((evt) => (
                  <div key={evt.id} className="p-2.5 bg-[#120E0E] border border-[#FFFFFF]/20 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#FFFFFF]">
                      <span className="font-bold text-rosso-sipario">{formatEventName(evt.eventType)}</span>
                      <span className="text-[10px] text-gray-400">{new Date(evt.createdAt).toLocaleString('it-IT')}</span>
                    </div>
                    <div className="text-[#FFFFFF]/90 text-[11px]">
                      Operatore: <strong>{evt.actor}</strong>
                      {evt.previousStatus && evt.newStatus && (
                        <span> | Stato: {evt.previousStatus} ➔ <strong>{evt.newStatus}</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveBookingDetail(null)}
                className="px-4 py-2 bg-[#1A0505] text-[#FFFFFF] text-xs font-semibold rounded-lg hover:bg-[#E60000]"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Status Change */}
      {statusModalBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateStatusSubmit}
            className="bg-[#050505] border border-[#FFFFFF] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-serif-display text-xl font-bold text-[#FFFFFF]">
              Aggiorna Stato Prenotazione {statusModalBooking.code}
            </h3>
            <p className="text-xs text-[#FFFFFF]/70">
              Spettatore: <strong>{statusModalBooking.fullName}</strong> ({statusModalBooking.seatsCount} posti)
            </p>

            <div className="space-y-1">
              <label className="text-xs text-[#FFFFFF] font-semibold block">Nuovo Stato</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as BookingRequestStatus)}
                className="w-full bg-[#1A1212] border border-[#FFFFFF]/40 rounded p-2 text-xs text-[#FFFFFF]"
              >
                <option value="confirmed">Confermata (Invia Notifica Email)</option>
                <option value="checked_in">Ingresso Effettuato (Accolto in Cassa)</option>
                <option value="waitlist">Lista d'Attesa</option>
                <option value="pending">In Lavorazione</option>
                <option value="cancelled">Annullata (Rilascia Capienza)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#FFFFFF] font-semibold block">Motivazione (Opzionale)</label>
              <input
                type="text"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Es. Richiesta telefonica dello spettatore"
                className="w-full bg-[#1A1212] border border-[#FFFFFF]/40 rounded p-2 text-xs text-[#FFFFFF]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusModalBooking(null)}
                className="px-3 py-2 bg-gray-800 text-gray-300 text-xs rounded hover:bg-gray-700"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#E60000] text-[#FFFFFF] text-xs font-semibold rounded hover:bg-[#1A0505]"
              >
                Salva Stato
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 3: Settings Modal */}
      {isSettingsModalOpen && settingsForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSettings}
            className="bg-[#050505] border border-[#FFFFFF] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-serif-display text-xl font-bold text-[#FFFFFF]">
              Configurazione Regole Prenotazione Cassa
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#FFFFFF] font-semibold block">Max Posti per Richiesta</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settingsForm.maxSeatsPerBooking}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, maxSeatsPerBooking: parseInt(e.target.value) || 8 })
                  }
                  className="w-full bg-[#1A1212] border border-[#FFFFFF]/40 rounded p-2 text-[#FFFFFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#FFFFFF] font-semibold block">Durata Riserva (Minuti)</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={settingsForm.holdDurationMinutes}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, holdDurationMinutes: parseInt(e.target.value) || 15 })
                  }
                  className="w-full bg-[#1A1212] border border-[#FFFFFF]/40 rounded p-2 text-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.waitlistEnabled}
                  onChange={(e) => setSettingsForm({ ...settingsForm, waitlistEnabled: e.target.checked })}
                  className="accent-[#FFFFFF]"
                />
                <span className="text-[#FFFFFF]">Abilita Lista d'Attesa Automatica a Capienza Esaurita</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.autoConfirm}
                  onChange={(e) => setSettingsForm({ ...settingsForm, autoConfirm: e.target.checked })}
                  className="accent-[#FFFFFF]"
                />
                <span className="text-[#FFFFFF]">Conferma Automatica Immediata</span>
              </label>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[#FFFFFF] font-semibold block">Avviso Personale Cassa</label>
              <textarea
                value={settingsForm.noticeText}
                onChange={(e) => setSettingsForm({ ...settingsForm, noticeText: e.target.value })}
                rows={2}
                className="w-full bg-[#1A1212] border border-[#FFFFFF]/40 rounded p-2 text-[#FFFFFF]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-3 py-2 bg-gray-800 text-gray-300 text-xs rounded hover:bg-gray-700"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#E60000] text-[#FFFFFF] text-xs font-semibold rounded hover:bg-[#1A0505]"
              >
                Salva Impostazioni
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
