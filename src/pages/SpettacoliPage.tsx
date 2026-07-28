import React, { useState, useEffect } from 'react';
import { TheatreRepository } from '../lib/repository';
import { Show, Performance } from '../types';
import { ShowCard } from '../components/ui/ShowCard';
import { Search, Filter } from 'lucide-react';

export const SpettacoliPage: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [activeFilter, setActiveFilter] = useState<'tutti' | 'in_scena' | 'in_arrivo' | 'archivio'>('tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allShows, allPerfs] = await Promise.all([
          TheatreRepository.getAllShows(),
          TheatreRepository.getAllPerformances(),
        ]);
        setShows(allShows);
        setPerformances(allPerfs);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredShows = shows.filter((show) => {
    const matchesFilter = activeFilter === 'tutti' || show.status === activeFilter;
    const matchesSearch =
      show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (show.author && show.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      show.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Title Header */}
      <div className="border-b border-[#FFFFFF]/30 pb-6">
        <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
          Repertorio & Produzioni
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#FFFFFF] mt-1">
          Archivio Spettacoli
        </h1>
        <p className="text-sm text-[#FFFFFF]/80 mt-2 max-w-2xl leading-relaxed">
          Sfoglia tutte le produzioni teatrali della compagnia Il Sipario: dalle commedie in scena fino agli spettacoli in arrivo e alle produzioni storiche.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#1A0505]/10 border border-[#FFFFFF]/25 p-4 rounded-xl">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'tutti', label: 'Tutti gli Spettacoli' },
            { key: 'in_scena', label: 'In Scena Ora' },
            { key: 'in_arrivo', label: 'In Arrivo' },
            { key: 'archivio', label: 'Archivio Storico' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as any)}
              className={`px-3.5 py-1.5 rounded text-xs font-medium transition ${
                activeFilter === tab.key
                  ? 'bg-[#E60000] text-[#FFFFFF] border border-[#FFFFFF]'
                  : 'text-[#FFFFFF]/70 hover:bg-[#1A0505]/30 hover:text-[#FFFFFF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#FFFFFF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cerca per titolo, autore..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#FFFFFF] placeholder-[#FFFFFF]/50 focus:outline-none focus:border-[#FFFFFF]"
          />
        </div>
      </div>

      {/* Show Grid */}
      {loading ? (
        <div className="text-center py-20 text-xs text-[#FFFFFF]">Caricamento spettacoli in corso...</div>
      ) : filteredShows.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#FFFFFF]/30 rounded-xl space-y-2">
          <p className="text-sm text-[#FFFFFF]/80">Nessuno spettacolo trovato con i filtri selezionati.</p>

          <button
            onClick={() => {
              setActiveFilter('tutti');
              setSearchQuery('');
            }}
            className="text-xs text-[#FFFFFF] underline hover:text-[#FFFFFF]"
          >
            Ripristina filtri
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredShows.map((show) => {
            const perf = performances.find((p) => p.showId === show.id);
            return <ShowCard key={show.id} show={show} nextPerformance={perf} />;
          })}
        </div>
      )}
    </div>
  );
};
