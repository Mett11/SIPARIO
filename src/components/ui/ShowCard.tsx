import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Show, Performance } from '../../types';

interface ShowCardProps {
  show: Show;
  nextPerformance?: Performance;
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, nextPerformance }) => {
  const statusColors = {
    in_scena: 'bg-rosso-sipario text-white border-rosso-sipario',
    in_arrivo: 'bg-white text-black border-white',
    archivio: 'bg-white/5 text-gray-400 border-white/10',
  };

  const statusLabels = {
    in_scena: 'In Scena',
    in_arrivo: 'In Arrivo',
    archivio: 'In Archivio',
  };

  return (
    <article className="group bg-nero-palco border border-white/10 rounded-none flex flex-col h-full hover:border-white/30 transition-all duration-300">
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
        <img
          src={show.posterUrl}
          alt={`Locandina dello spettacolo ${show.title}`}
          className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${statusColors[show.status]}`}>
            {statusLabels[show.status]}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-black/80 border border-white/20 text-white text-[10px] uppercase font-bold tracking-widest backdrop-blur-md">
            {show.category}
          </span>
        </div>

        {/* Validation Marker */}
        {show.validationStatus === 'DA_VALIDARE_CON_LA_COMPAGNIA' && (
          <div className="absolute bottom-2 inset-x-2 z-10 bg-amber-950/90 border border-amber-500/40 p-1 text-[10px] text-amber-200 flex items-center gap-1 justify-center uppercase font-bold">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Da validare</span>
          </div>
        )}
      </div>

      {/* Accessible HTML Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          {show.author && (
            <span className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-widest">
              Di {show.author}
            </span>
          )}
          <h3 className="font-serif-display text-2xl font-bold text-avorio group-hover:text-white transition-colors line-clamp-2">
            {show.title}
          </h3>
          {show.subtitle && (
            <p className="text-xs text-gray-400 italic mt-1 line-clamp-1">
              {show.subtitle}
            </p>
          )}

          <p className="text-sm text-gray-400 mt-4 line-clamp-3 leading-relaxed font-light">
            {show.synopsis}
          </p>
        </div>

        {/* Performance details & CTAs */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          {nextPerformance ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-white">
                <Calendar className="w-4 h-4 shrink-0 text-rosso-sipario" />
                <span className="font-medium">
                  {new Date(nextPerformance.dateTime).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} - Ore {new Date(nextPerformance.dateTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {(nextPerformance.ticketPriceDisplay || show.ticketPriceDisplay || nextPerformance.ticketPriceFull || show.ticketPriceFull) && (
                <div className="text-xs text-amber-200 font-semibold">
                  🎟️ {nextPerformance.ticketPriceDisplay || show.ticketPriceDisplay || `Biglietto: ${nextPerformance.ticketPriceFull || show.ticketPriceFull}`}
                </div>
              )}
            </div>
          ) : show.durationMinutes ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Durata: {show.durationMinutes} min</span>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              to={`/spettacoli/${show.slug}`}
              className="flex-1 w-full py-3 px-3 border border-white/20 text-center text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              Dettagli
            </Link>

            {show.status !== 'archivio' && nextPerformance && (
              <Link
                to={`/prenota?perf=${nextPerformance.id}`}
                className="flex-1 w-full py-3 px-3 bg-rosso-sipario hover:bg-red-700 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-white shadow-[0_0_15px_rgba(230,0,0,0.3)]"
              >
                <Ticket className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Prenota</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
