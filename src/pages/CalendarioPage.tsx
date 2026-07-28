import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TheatreRepository } from '../lib/repository';
import { Performance } from '../types';
import { Calendar as CalendarIcon, MapPin, Ticket, Clock, AlertCircle } from 'lucide-react';

export const CalendarioPage: React.FC = () => {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCalendar() {
      try {
        const perfs = await TheatreRepository.getAllPerformances();
        // Sort chronologically
        const sorted = perfs.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        setPerformances(sorted);
      } finally {
        setLoading(false);
      }
    }
    loadCalendar();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-[#FFFFFF]/30 pb-6">
        <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
          Programmazione
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#FFFFFF] mt-1">
          Calendario Repliche
        </h1>
        <p className="text-sm text-[#FFFFFF]/80 mt-2 max-w-2xl leading-relaxed">
          Tutti gli appuntamenti teatrali in programma a Canicattini Bagni e nelle tappe della tournée.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-[#FFFFFF]">Caricamento calendario...</div>
      ) : performances.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#FFFFFF]/30 rounded-xl space-y-2">
          <AlertCircle className="w-8 h-8 text-[#FFFFFF] mx-auto" />
          <p className="text-sm text-[#FFFFFF]/80">Nessuna replica in programma al momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {performances.map((perf) => {
            const dateObj = new Date(perf.dateTime);
            const dayNum = dateObj.getDate();
            const monthStr = dateObj.toLocaleDateString('it-IT', { month: 'short' }).toUpperCase();
            const yearNum = dateObj.getFullYear();
            const timeStr = dateObj.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={perf.id}
                className="bg-[#050505] border border-[#FFFFFF]/30 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#FFFFFF] transition shadow-lg"
              >
                {/* Date Badge */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-b from-[#E60000] to-[#1A0505] border border-[#FFFFFF]/60 flex flex-col items-center justify-center text-center shadow">
                    <span className="text-xs text-[#FFFFFF] font-bold uppercase">{monthStr}</span>
                    <span className="font-serif-display text-2xl font-bold text-[#FFFFFF] leading-none">{dayNum}</span>
                    <span className="text-[10px] text-[#FFFFFF]/60">{yearNum}</span>
                  </div>

                  <div>
                    <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF]">
                      {perf.showTitle}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-[#FFFFFF] mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Ore {timeStr}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {perf.venueName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Venue & Booking CTA */}
                <div className="shrink-0 w-full md:w-auto flex flex-col md:items-end gap-2">
                  <span className="text-xs text-[#FFFFFF]/70">
                    {perf.venueAddress}
                  </span>
                  {perf.bookingStatus === 'open' ? (
                    <Link
                      to={`/prenota?perf=${perf.id}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] border border-[#FFFFFF]/60 rounded-md text-xs font-semibold tracking-wide transition shadow"
                    >
                      <Ticket className="w-4 h-4 text-[#FFFFFF]" />
                      <span>Richiedi Prenotazione Posto</span>
                    </Link>
                  ) : (
                    <span className="px-3 py-1 bg-[#1A0505]/40 border border-[#FFFFFF]/30 text-xs text-[#FFFFFF] rounded">
                      Prenotazioni Chiuse
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
