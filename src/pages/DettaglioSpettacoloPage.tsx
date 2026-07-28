import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TheatreRepository } from '../lib/repository';
import { Show, Performance } from '../types';
import { Calendar, MapPin, Ticket, Clock, ArrowLeft, Users, AlertTriangle } from 'lucide-react';

export const DettaglioSpettacoloPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [show, setShow] = useState<Show | null>(null);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!slug) return;
      try {
        const foundShow = await TheatreRepository.getShowBySlug(slug);
        if (foundShow) {
          setShow(foundShow);
          const perfs = await TheatreRepository.getPerformancesByShowId(foundShow.id);
          setPerformances(perfs);
        }
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 text-xs text-[#FFFFFF]">Caricamento scheda spettacolo...</div>;
  }

  if (!show) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif-display text-2xl font-bold text-[#FFFFFF]">Spettacolo non trovato</h1>
        <Link to="/spettacoli" className="inline-flex items-center gap-2 text-xs text-[#FFFFFF] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Torna all'archivio spettacoli
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Back Link */}
      <Link to="/spettacoli" className="inline-flex items-center gap-2 text-xs text-[#FFFFFF] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Torna al cartellone
      </Link>

      {/* Hero / Main Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Poster Image */}
        <div className="relative rounded-xl overflow-hidden border border-[#FFFFFF]/40 shadow-2xl bg-[#1A0505]/20">
          <img src={show.posterUrl} alt={`Locandina ${show.title}`} className="w-full h-auto object-cover" />
          {show.validationStatus === 'DA_VALIDARE_CON_LA_COMPAGNIA' && (
            <div className="p-2 bg-amber-950/90 text-amber-200 border-t border-amber-500/40 text-[10px] text-center flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Dati spettacolo in attesa di validazione formale</span>
            </div>
          )}
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#FFFFFF] uppercase font-semibold mb-2">
              <span>{show.category}</span>
              <span>•</span>
              <span className="capitalize">{show.status.replace('_', ' ')}</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#FFFFFF]">
              {show.title}
            </h1>
            {show.subtitle && (
              <p className="text-base text-[#FFFFFF]/70 italic mt-1">{show.subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[#1A0505]/20 border border-[#FFFFFF]/25 rounded-lg text-xs">
            {show.author && (
              <div>
                <span className="text-[#FFFFFF] block uppercase font-medium">Autore</span>
                <span className="text-[#FFFFFF] font-semibold">{show.author}</span>
              </div>
            )}
            {show.director && (
              <div>
                <span className="text-[#FFFFFF] block uppercase font-medium">Regia</span>
                <span className="text-[#FFFFFF] font-semibold">{show.director}</span>
              </div>
            )}
            {show.durationMinutes && (
              <div>
                <span className="text-[#FFFFFF] block uppercase font-medium">Durata</span>
                <span className="text-[#FFFFFF] font-semibold">{show.durationMinutes} minuti</span>
              </div>
            )}
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h2 className="font-serif-display text-xl font-bold text-[#FFFFFF]">Sinossi</h2>
            <p className="text-sm text-[#FFFFFF]/90 leading-relaxed whitespace-pre-line">
              {show.synopsis}
            </p>
          </div>

          {/* Cast & Credits */}
          {show.castAndCredits && show.castAndCredits.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#FFFFFF]/20">
              <h2 className="font-serif-display text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FFFFFF]" /> Cast e Crediti
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {show.castAndCredits.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#050505] border border-[#FFFFFF]/20 rounded flex justify-between items-center">
                    <span className="text-[#FFFFFF]/70 font-medium">{item.role}</span>
                    <span className="text-[#FFFFFF] font-semibold">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performances & Booking Schedule Section */}
      <section className="space-y-6 pt-6 border-t border-[#FFFFFF]/30">
        <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF] flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#FFFFFF]" /> Repliche & Disponibilità Posti
        </h2>

        {performances.length === 0 ? (
          <div className="p-6 bg-[#050505] border border-[#FFFFFF]/20 rounded-lg text-xs text-[#FFFFFF]/70">
            Nessuna replica attualmente programmata per questo spettacolo. Consulta il calendario per le prossime date.
          </div>
        ) : (
          <div className="space-y-4">
            {performances.map((perf) => (
              <div
                key={perf.id}
                className="bg-[#050505] border border-[#FFFFFF]/40 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-[#1A0505] text-[#FFFFFF] border border-[#FFFFFF]/50 text-xs font-semibold rounded uppercase">
                      {perf.bookingStatus === 'open' ? 'Prenotabile' : perf.bookingStatus}
                    </span>
                    <span className="text-xs text-[#FFFFFF] font-medium">
                      {perf.ticketPriceDisplay}
                    </span>
                  </div>

                  <h3 className="font-serif-display text-xl font-bold text-[#FFFFFF]">
                    {new Date(perf.dateTime).toLocaleDateString('it-IT', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-[#FFFFFF]/80">
                    <MapPin className="w-4 h-4 text-[#FFFFFF] shrink-0" />
                    <span>{perf.venueName} — {perf.venueAddress}</span>
                  </div>

                  <p className="text-[11px] text-[#FFFFFF]/60 italic">
                    {perf.instructions}
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto text-right space-y-2">
                  <div className="text-xs text-[#FFFFFF]">
                    Capienza: {perf.seatsReserved} / {perf.capacityTotal} posti prenotati
                  </div>
                  {perf.bookingStatus === 'open' && (
                    <Link
                      to={`/prenota?perf=${perf.id}`}
                      className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] border border-[#FFFFFF]/70 rounded-lg text-xs font-semibold transition shadow"
                    >
                      <Ticket className="w-4 h-4 text-[#FFFFFF]" />
                      <span>Richiedi Prenotazione</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gallery Section */}
      {show.galleryUrls && show.galleryUrls.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-[#FFFFFF]/20">
          <h2 className="font-serif-display text-xl font-bold text-[#FFFFFF]">Galleria Fotografica</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {show.galleryUrls.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(url)}
                className="aspect-video rounded-lg overflow-hidden border border-[#FFFFFF]/30 group focus:outline-none"
              >
                <img
                  src={url}
                  alt={`Foto ${idx + 1} da ${show.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img src={selectedImage} alt="Ingrandimento" className="w-full max-h-[85vh] object-contain rounded-lg border border-[#FFFFFF]" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-black/70 px-3 py-1 rounded text-xs"
            >
              Chiudi (ESC)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
