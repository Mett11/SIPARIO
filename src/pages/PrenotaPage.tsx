import React, { useEffect, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

import { useSearchParams, Link } from 'react-router-dom';
import { TheatreRepository } from '../lib/repository';
import { Performance, BookingRequest, AvailabilityResponse } from '../types';
import { Ticket, Calendar, MapPin, CheckCircle, AlertTriangle, ShieldCheck, Info, Clock, Copy, Check } from 'lucide-react';

export const PrenotaPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const perfIdFromQuery = searchParams.get('perf');

  const [performances, setPerformances] = useState<Performance[]>([]);
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [seatsCount, setSeatsCount] = useState(2);
  const [notes, setNotes] = useState('');
  const [privacyConsented, setPrivacyConsented] = useState(false);
  const [marketingConsented, setMarketingConsented] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [honeypot, setHoneypot] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<BookingRequest | null>(null);
  const [submittedEmailPreview, setSubmittedEmailPreview] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function loadPerfs() {
      try {
        const allPerfs = await TheatreRepository.getAllPerformances();
        setPerformances(allPerfs);

        let initialPerf: Performance | undefined = undefined;
        if (perfIdFromQuery) {
          initialPerf = allPerfs.find((p) => p.id === perfIdFromQuery);
        }
        if (!initialPerf && allPerfs.length > 0) {
          initialPerf = allPerfs[0];
        }

        if (initialPerf) {
          setSelectedPerformance(initialPerf);
          fetchAvailability(initialPerf.id);
        }
      } finally {
        setLoading(false);
      }
    }
    loadPerfs();
  }, [perfIdFromQuery]);

  const fetchAvailability = async (perfId: string) => {
    try {
      const res = await TheatreRepository.getPerformanceAvailability(perfId);
      setAvailability(res);
    } catch (e) {
      console.warn('Errore verifica disponibilità', e);
    }
  };

  const handleSelectPerf = (perf: Performance) => {
    setSelectedPerformance(perf);
    setAvailability(null);
    fetchAvailability(perf.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (!selectedPerformance) {
      setErrorMessage('Seleziona una replica valida.');
      return;
    }

    if (!privacyConsented) {
      setErrorMessage('È necessario accettare l\'Informativa sulla Privacy per proseguire.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await TheatreRepository.createPublicBooking({
        performanceId: selectedPerformance.id,
        fullName,
        email,
        phone,
        seatsCount,
        notes,
        honeypot,
        privacyConsented,
        turnstileToken,
        marketingConsented,
        privacyPolicyVersion: availability?.privacyPolicyVersion || 'v1.2-2026',
      });

      if (res.success && res.data) {
        setSubmittedBooking(res.data);
        setSubmittedEmailPreview(res.emailPreview);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Errore durante l\'invio della prenotazione.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCodeToClipboard = () => {
    if (!submittedBooking) return;
    navigator.clipboard.writeText(submittedBooking.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  if (loading) {
    return <div className="text-center py-20 text-xs text-[#FFFFFF]">Caricamento sistema prenotazioni...</div>;
  }

  // Success Confirmation Pass Screen
  if (submittedBooking) {
    const isWaitlist = submittedBooking.status === 'waitlist';
    return (
      <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
        <div className="bg-[#1A0505]/30 border-2 border-[#FFFFFF] p-8 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-3">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                isWaitlist
                  ? 'bg-amber-950 border border-amber-500 text-amber-400'
                  : 'bg-[#E60000] border border-[#FFFFFF] text-[#FFFFFF]'
              }`}
            >
              {isWaitlist ? <Clock className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
            </div>

            <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-widest block">
              {isWaitlist ? 'Richiesta Inserita in Lista d\'Attesa' : 'Prenotazione Registrata con Successo'}
            </span>

            <h1 className="font-serif-display text-3xl font-bold text-[#FFFFFF]">
              Codice Pratica:{' '}
              <span className="text-[#FFFFFF] font-mono tracking-wider">{submittedBooking.code}</span>
            </h1>

            <button
              onClick={copyCodeToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#050505] border border-[#FFFFFF]/40 rounded text-xs text-[#FFFFFF] hover:bg-[#1A0505]"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copiato!' : 'Copia Codice'}
            </button>
          </div>

          <div className="bg-[#050505] border border-[#FFFFFF]/40 p-5 rounded-xl text-xs space-y-3 text-left">
            <div className="flex justify-between border-b border-[#FFFFFF]/20 pb-2">
              <span className="text-[#FFFFFF]">Spettacolo:</span>
              <span className="font-semibold text-[#FFFFFF]">{submittedBooking.showTitle}</span>
            </div>
            <div className="flex justify-between border-b border-[#FFFFFF]/20 pb-2">
              <span className="text-[#FFFFFF]">Data e Ora Replica:</span>
              <span>{new Date(submittedBooking.performanceDateTime).toLocaleString('it-IT')}</span>
            </div>
            <div className="flex justify-between border-b border-[#FFFFFF]/20 pb-2">
              <span className="text-[#FFFFFF]">Posti Richiesti:</span>
              <span className="font-bold text-[#FFFFFF]">{submittedBooking.seatsCount} Posti</span>
            </div>
            <div className="flex justify-between border-b border-[#FFFFFF]/20 pb-2">
              <span className="text-[#FFFFFF]">Intestatario:</span>
              <span>{submittedBooking.fullName} ({submittedBooking.email})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#FFFFFF]">Stato Pratica:</span>
              <span className="font-bold uppercase text-[#FFFFFF]">{submittedBooking.status}</span>
            </div>
          </div>

          <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-lg text-xs text-amber-200 text-left space-y-1.5">
            <span className="font-semibold block flex items-center gap-1 text-amber-300">
              <Info className="w-4 h-4 text-amber-400" /> Istruzioni e Saldo in Cassa:
            </span>
            <p className="text-[11px] leading-relaxed">
              Nessun pagamento è stato effettuato online. Presentati alla cassa del teatro almeno 20 minuti prima dell'inizio dello spettacolo esibendo il codice <strong>{submittedBooking.code}</strong>.
            </p>
          </div>

          {/* Email Simulation Preview Box */}
          {submittedEmailPreview && (
            <div className="p-4 bg-[#120D0D] border border-[#FFFFFF]/30 rounded-lg text-xs text-left space-y-2">
              <span className="text-[10px] text-[#FFFFFF] font-semibold uppercase block flex items-center gap-1">
                ✓ Notifica Transazionale Generata
              </span>
              <div className="font-semibold text-[#FFFFFF]">{submittedEmailPreview.subject}</div>
              <p className="text-[11px] text-[#FFFFFF]/70 italic">
                Un'email di conferma è stata registrata nel sistema ed inviata all'indirizzo {submittedBooking.email}.
              </p>
            </div>
          )}

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-2.5 bg-[#E60000] text-[#FFFFFF] border border-[#FFFFFF]/60 rounded-lg text-xs font-semibold hover:bg-[#1A0505] transition"
            >
              Torna alla Home
            </Link>
            <button
              onClick={() => {
                setSubmittedBooking(null);
                setFullName('');
                setEmail('');
                setPhone('');
              }}
              className="px-6 py-2.5 bg-[#050505] border border-[#FFFFFF]/40 text-[#FFFFFF] rounded-lg text-xs font-semibold hover:bg-[#1A0505]/30 transition"
            >
              Nuova Prenotazione
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-[#FFFFFF]/30 pb-6">
        <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
          Servizio Biglietteria Senza Carte di Credito
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#FFFFFF] mt-1">
          Prenotazione Posti Teatrali
        </h1>
        <p className="text-sm text-[#FFFFFF]/80 mt-2 max-w-2xl leading-relaxed">
          Seleziona la replica in cartellone, verifica la disponibilità in tempo reale e riserva i posti in sala senza alcun pagamento online.
        </p>
      </div>

      {/* Transparent Banner Notice */}
      <div className="p-4 bg-[#1A0505]/30 border border-[#FFFFFF]/50 rounded-xl flex items-start gap-3 text-xs text-[#FFFFFF]">
        <Info className="w-5 h-5 text-[#FFFFFF] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#FFFFFF] block">Prenoti Ora, Paghi e Ritiri alla Cassa del Teatro</strong>
          <p className="text-[11px] text-[#FFFFFF]/80 mt-0.5">
            L'invio del modulo garantisce la riserva dei posti. Nessuna carta di credito richiesta. Il saldo avviene direttamente in cassa prima dello spettacolo.
          </p>
        </div>
      </div>

      {performances.length === 0 ? (
        <div className="p-8 border border-dashed border-[#FFFFFF]/30 rounded-xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-[#FFFFFF] mx-auto" />
          <h2 className="font-serif-display text-xl font-bold text-[#FFFFFF]">Nessuna replica in cartellone al momento</h2>
          <p className="text-xs text-[#FFFFFF]/70">Rimani aggiornato sul nostro blog o consulta il calendario.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#050505] border border-[#FFFFFF]/30 p-8 rounded-xl space-y-6 shadow-xl">
          {/* Honeypot hidden field */}
          <input
            type="text"
            name="website_url_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Step 1: Performance Selection & Real-Time Availability Badge */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
              1. Seleziona la Replica *
            </label>

            <div className="grid grid-cols-1 gap-3">
              {performances.map((perf) => (
                <button
                  type="button"
                  key={perf.id}
                  onClick={() => handleSelectPerf(perf)}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition ${
                    selectedPerformance?.id === perf.id
                      ? 'bg-[#1A0505]/50 border-[#FFFFFF] text-[#FFFFFF] shadow-lg'
                      : 'border-[#FFFFFF]/25 bg-[#050505] hover:bg-[#1A0505]/20 text-[#FFFFFF]/80'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-serif-display font-bold text-base block text-[#FFFFFF]">
                      {perf.showTitle}
                    </span>
                    <span className="text-xs text-[#FFFFFF] block">
                      {new Date(perf.dateTime).toLocaleString('it-IT', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      — {perf.venueName}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-[#FFFFFF] block">
                      {perf.ticketPriceDisplay}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Live Availability Status Badge */}
            {availability && selectedPerformance && (
              <div className="p-3.5 bg-[#1A1212] border border-[#FFFFFF]/40 rounded-lg text-xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[#FFFFFF] font-semibold block">Disponibilità In Tempo Reale:</span>
                  <span className="text-[#FFFFFF]/80 text-[11px]">
                    Capienza Totale: {availability.capacityTotal} Posti | Prenotati: {availability.seatsReservedBlocking} Posti
                  </span>
                </div>

                <div>
                  {availability.seatsAvailable > 0 ? (
                    <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/50 text-emerald-300 rounded-full font-semibold">
                      ✓ {availability.seatsAvailable} Posti Disponibili
                    </span>
                  ) : availability.waitlistActive ? (
                    <span className="px-3 py-1 bg-amber-950 border border-amber-500/50 text-amber-300 rounded-full font-semibold">
                      ⏳ Capienza Esaurita — Lista d'Attesa Attiva
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-950 border border-red-500/50 text-red-300 rounded-full font-semibold">
                      ✕ Sold Out
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Contact Form */}
          <div className="space-y-4 pt-4 border-t border-[#FFFFFF]/20 text-xs">
            <label className="block text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
              2. I Tuoi Dati per il Ritiro in Cassa
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#FFFFFF]/90 font-medium mb-1">Nome e Cognome *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Es. Mario Rossi"
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded-lg p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF]/90 font-medium mb-1">Indirizzo Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mario.rossi@email.it"
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded-lg p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#FFFFFF]/90 font-medium mb-1">Numero di Telefono *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 339 0000000"
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded-lg p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF]/90 font-medium mb-1">Numero Posti *</label>
                <select
                  value={seatsCount}
                  onChange={(e) => setSeatsCount(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded-lg p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
                >
                  {Array.from({ length: availability?.maxSeatsPerBooking || 8 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Posto' : 'Posti'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#FFFFFF]/90 font-medium mb-1">
                Note Opzionali (es. sedia a rotelle o persona anziana)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indica eventuali preferenze o esigenze specifiche..."
                className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded-lg p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
              />
            </div>
          </div>

          {/* Consents & Security Badge */}
          <div className="space-y-3 pt-4 border-t border-[#FFFFFF]/20 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={privacyConsented}
                onChange={(e) => setPrivacyConsented(e.target.checked)}
                className="mt-0.5 accent-[#FFFFFF] w-4 h-4"
              />
              <span className="text-[#FFFFFF]/80">
                Accetto l'
                <Link to="/privacy" target="_blank" className="text-[#FFFFFF] underline">
                  Informativa sulla Privacy ({availability?.privacyPolicyVersion || 'v1.2-2026'})
                </Link>{' '}
                ai fini della gestione della prenotazione e del ritiro in cassa. *
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsented}
                onChange={(e) => setMarketingConsented(e.target.checked)}
                className="mt-0.5 accent-[#FFFFFF] w-4 h-4"
              />
              <span className="text-[#FFFFFF]/70">
                Desidero ricevere inviti ed aggiornamenti per le prossime stagioni de Il Sipario (opzionale).
              </span>
            </label>

            {/* Turnstile / Anti-spam Badge */}
            <div className="pt-2">
              <Turnstile 
                siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                onSuccess={(token) => setTurnstileToken(token)}
                options={{ theme: 'dark', size: 'normal' }}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-xs text-red-200">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#E60000] hover:bg-[#1A0505] disabled:opacity-50 text-[#FFFFFF] font-semibold text-sm rounded-lg border border-[#FFFFFF]/60 transition shadow-lg flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4 text-[#FFFFFF]" />
            <span>
              {isSubmitting
                ? 'Elaborazione in corso...'
                : availability?.seatsAvailable && availability.seatsAvailable > 0
                ? 'Conferma e Invia Prenotazione'
                : 'Invia Richiesta per Lista d\'Attesa'}
            </span>
          </button>
        </form>
      )}
    </div>
  );
};

