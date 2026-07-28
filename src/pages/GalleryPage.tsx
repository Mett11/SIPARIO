import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Image, Video, X } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      title: 'Scena da Fiat Voluntas Dei',
      category: 'Foto Spettacolo',
      imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
      caption: 'Momento saliente della commedia Fiat Voluntas Dei al Teatro Comunale di Canicattini Bagni.',
    },
    {
      id: 'g2',
      title: 'Proscenio e Luci di Scena',
      category: 'Dietro le Quinte',
      imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=600&q=80',
      caption: 'Preparazione delle luci prima dell\'apertura del sipario.',
    },
    {
      id: 'g3',
      title: 'Prova del Cast',
      category: 'Prove & Laboratori',
      imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80',
      caption: 'Momento di lettura e memorizzazione del testo durante le prove serali.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-[#FFFFFF]/30 pb-6">
        <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
          Archivio Visuale
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#FFFFFF] mt-1">
          Galleria Foto & Video
        </h1>
        <p className="text-sm text-[#FFFFFF]/80 mt-2 max-w-2xl leading-relaxed">
          I momenti più belli vissuti sul palco e dietro le quinte della Compagnia Teatrale Il Sipario.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedMedia(item)}
            className="group relative aspect-video bg-[#1A0505]/20 border border-[#FFFFFF]/30 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FFFFFF] text-left"
          >
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition" />
            <div className="absolute bottom-3 inset-x-3 space-y-0.5">
              <span className="text-[10px] text-[#FFFFFF] uppercase font-semibold block">
                {item.category}
              </span>
              <h3 className="font-serif-display text-sm font-bold text-[#FFFFFF] truncate">
                {item.title}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-[#050505] border border-[#FFFFFF]/60 rounded-xl overflow-hidden p-4 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#FFFFFF]/20 pb-3">
              <div>
                <span className="text-xs text-[#FFFFFF] uppercase font-semibold">{selectedMedia.category}</span>
                <h2 className="font-serif-display text-lg font-bold text-[#FFFFFF]">{selectedMedia.title}</h2>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 rounded text-[#FFFFFF]/80 hover:text-[#FFFFFF]"
                aria-label="Chiudi finestra"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-hidden rounded border border-[#FFFFFF]/20">
              <img src={selectedMedia.imageUrl} alt={selectedMedia.title} className="w-full h-full object-contain" />
            </div>

            {selectedMedia.caption && (
              <p className="text-xs text-[#FFFFFF]/80 italic">
                {selectedMedia.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
