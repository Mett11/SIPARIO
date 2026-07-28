import React from 'react';
import { Show, BlogPost } from '../../types';
import { X, Eye, ShieldAlert, CheckCircle, Calendar, User, Tag } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'show' | 'blog';
  data: Partial<Show> | Partial<BlogPost> | null;
}

export const AdminPreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, type, data }) => {
  if (!isOpen || !data) return null;

  const showData = type === 'show' ? (data as Partial<Show>) : null;
  const blogData = type === 'blog' ? (data as Partial<BlogPost>) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#050505] border border-[#FFFFFF] w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl text-[#FFFFFF]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1A0505]/40 border-b border-[#FFFFFF]/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
            <Eye className="w-4 h-4" /> Anteprima di Pubblicazione CMS ({type === 'show' ? 'Spettacolo' : 'Articolo'})
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#FFFFFF]/70 hover:text-[#FFFFFF] hover:bg-[#1A0505]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Stage Render */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded text-xs text-amber-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Modalità Anteprima: Questo contenuto non è ancora visibile al pubblico.
            </span>
            <span className="font-semibold uppercase px-2 py-0.5 bg-amber-500/20 rounded border border-amber-500/40">
              {data.status || (data as any).publication_status || 'DRAFT'}
            </span>
          </div>

          {showData && (
            <div className="space-y-6">
              <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden border border-[#FFFFFF]/40">
                <img
                  src={showData.posterUrl || 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf'}
                  alt={showData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
                    {showData.category || 'Teatro'}
                  </span>
                  <h2 className="font-serif-display text-3xl font-bold text-[#FFFFFF]">
                    {showData.title || 'Titolo Bozza'}
                  </h2>
                  {showData.subtitle && (
                    <p className="text-sm text-[#FFFFFF]/80 italic mt-1">{showData.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#1A0505]/20 border border-[#FFFFFF]/20 p-4 rounded-xl">
                <div>
                  <span className="text-[#FFFFFF] block font-semibold">Autore / Testo:</span>
                  <span>{showData.author || 'Non specificato'}</span>
                </div>
                <div>
                  <span className="text-[#FFFFFF] block font-semibold">Regia:</span>
                  <span>{showData.director || 'Non specificata'}</span>
                </div>
              </div>

              <div>
                <h3 className="font-serif-display text-lg font-bold text-[#FFFFFF] mb-2">Sinossi</h3>
                <p className="text-sm text-[#FFFFFF]/90 leading-relaxed whitespace-pre-line">
                  {showData.synopsis || 'Nessuna sinossi inserita.'}
                </p>
              </div>

              {showData.castAndCredits && showData.castAndCredits.length > 0 && (
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-[#FFFFFF] mb-2">Cast e Crediti</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {showData.castAndCredits.map((c, idx) => (
                      <div key={idx} className="p-2 bg-[#050505] border border-[#FFFFFF]/20 rounded">
                        <span className="text-[#FFFFFF] block font-semibold">{c.role}</span>
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {blogData && (
            <div className="space-y-6">
              <div className="relative h-56 rounded-xl overflow-hidden border border-[#FFFFFF]/40">
                <img
                  src={blogData.coverUrl || 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212'}
                  alt={blogData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-3 text-xs text-[#FFFFFF] mb-1">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {blogData.category}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blogData.author}</span>
                  </div>
                  <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF]">
                    {blogData.title || 'Titolo Articolo'}
                  </h2>
                </div>
              </div>

              <div className="p-4 bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-lg text-sm text-[#FFFFFF] italic">
                "{blogData.excerpt}"
              </div>

              <div>
                <h3 className="font-serif-display text-lg font-bold text-[#FFFFFF] mb-2">Contenuto</h3>
                <div className="text-sm text-[#FFFFFF]/90 space-y-3 leading-relaxed whitespace-pre-line">
                  {blogData.content}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#050505] border-t border-[#FFFFFF]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] border border-[#FFFFFF]/60 rounded text-xs font-semibold"
          >
            Chiudi Anteprima
          </button>
        </div>
      </div>
    </div>
  );
};
