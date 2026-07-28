import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Award, MapPin, AlertTriangle } from 'lucide-react';
import { CompanyCastMember } from '../types';
import { TheatreRepository } from '../lib/repository';

export const CompagniaPage: React.FC = () => {
  const [cast, setCast] = useState<CompanyCastMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TheatreRepository.getCompanyCast()
      .then((data) => setCast(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="border-b border-[#FFFFFF]/30 pb-6">
        <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
          Chi Siamo
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#FFFFFF] mt-1">
          La Compagnia Teatrale “Il Sipario”
        </h1>
        <p className="text-sm text-[#FFFFFF]/80 mt-2 max-w-2xl leading-relaxed">
          Associazione di Promozione Sociale con sede a Canicattini Bagni (Siracusa). Coltiviamo la tradizione del teatro amatoriale e popolare con passione e impegno sociale.
        </p>
      </div>

      {/* Story & Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-[#1A0505]/20 border border-[#FFFFFF]/30 p-8 rounded-xl space-y-4">
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF]">
            La Nostra Storia
          </h2>
          <p className="text-xs sm:text-sm text-[#FFFFFF]/85 leading-relaxed">
            Fondata a Canicattini Bagni, l'A.P.S. “Il Sipario” riunisce persone unite dall'amore per le tavole del palcoscenico. Nel corso degli anni la compagnia ha portato in scena capolavori del teatro dialettale siciliano, commedie brillanti e produzioni originali, diventando un punto di riferimento culturale per la comunità iblea.
          </p>
          <div className="p-3 bg-[#050505] border border-amber-500/40 rounded text-[11px] text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Note storiche in corso di validazione formale con la compagnia.</span>
          </div>
        </div>

        <div className="bg-[#050505] border border-[#FFFFFF]/30 p-8 rounded-xl space-y-4">
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF]">
            Missione e Valori
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-[#FFFFFF]/85">
            <li className="flex items-start gap-2">
              <span className="text-[#FFFFFF] font-bold">•</span>
              <span><strong>Promozione Sociale:</strong> Il teatro come strumento di inclusione, aggregazione per i giovani e valorizzazione della terza età.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FFFFFF] font-bold">•</span>
              <span><strong>Identità Territoriale:</strong> Tutela della lingua e della memoria popolare di Canicattini Bagni e del territorio siracusano.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FFFFFF] font-bold">•</span>
              <span><strong>Accessibilità:</strong> Spettacoli aperti a tutti con prenotazioni trasparenti e senza costi nascosti.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* People / Team Modulo */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FFFFFF]/20 pb-4">
          <div>
            <h2 className="font-serif-display text-3xl font-bold text-[#FFFFFF]">
              Gli Attori e il Cast del Sipario
            </h2>
            <p className="text-xs text-[#FFFFFF]/70 mt-1">
              I protagonisti, la regia e le maestranze che danno vita agli spettacoli della nostra compagnia.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-xs text-gray-400 py-8 text-center">Caricamento componenti in corso...</div>
        ) : cast.length === 0 ? (
          <div className="text-xs text-gray-400 py-8 text-center">Nessun attore attualmente a registro.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cast.map((member) => (
              <div
                key={member.id}
                className="bg-[#080808] border border-[#FFFFFF]/30 p-6 rounded-xl space-y-4 hover:border-rosso-sipario transition group shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-rosso-sipario shrink-0 shadow-md"
                  />
                  <div>
                    <h3 className="font-serif-display font-bold text-lg text-[#FFFFFF]">
                      {member.name}
                    </h3>
                    <span className="text-xs text-rosso-sipario font-semibold block uppercase">
                      {member.role}
                    </span>
                  </div>
                </div>

                {member.shows && (
                  <div className="text-[11px] text-gray-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded w-fit">
                    🎭 Spettacoli: <strong className="text-white">{member.shows}</strong>
                  </div>
                )}

                {member.bio && (
                  <p className="text-xs text-[#FFFFFF]/80 leading-relaxed border-t border-white/10 pt-3">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Contact */}
      <div className="border-t border-[#FFFFFF]/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-xl font-bold text-[#FFFFFF]">
            Vuoi collaborare o unirti alla compagnia?
          </h3>
          <p className="text-xs text-[#FFFFFF]/70">
            Siamo sempre felici di accogliere nuovi appassionati, attori e maestranze.
          </p>
        </div>
        <Link
          to="/contatti"
          className="px-6 py-2.5 bg-[#E60000] hover:bg-[#1A0505] border border-[#FFFFFF]/60 text-[#FFFFFF] rounded text-xs font-semibold tracking-wide transition shadow"
        >
          Contatta la Direzione
        </Link>
      </div>
    </div>
  );
};
