import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Heart } from 'lucide-react';

interface FooterProps {
  siteConfig: {
    name: string;
    subName?: string;
    address: string;
    phone: string;
    email: string;
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
  };
}

export const Footer: React.FC<FooterProps> = ({ siteConfig }) => {
  return (
    <footer className="bg-[#050505] border-t border-[#FFFFFF]/30 text-[#FFFFFF] pt-12 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FFFFFF]/40 shadow-md bg-black shrink-0">
                <img src="/logo.svg" alt="Il Sipario Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              </div>
              <span className="font-cinzel text-lg tracking-wider font-semibold text-[#FFFFFF]">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-xs text-[#FFFFFF]/80 leading-relaxed font-sans">
              Promuoviamo la cultura teatrale e le tradizioni della Sicilia con passione popolare e sguardo contemporaneo a Canicattini Bagni.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-[#1A0505]/40 border border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#050505] transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-[#1A0505]/40 border border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#050505] transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-[#1A0505]/40 border border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#050505] transition"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-serif-display text-sm font-semibold text-[#FFFFFF] uppercase tracking-wider mb-4">
              Navigazione
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/spettacoli" className="hover:text-[#FFFFFF] transition">Archivio Spettacoli</Link></li>
              <li><Link to="/calendario" className="hover:text-[#FFFFFF] transition">Prossime Repliche</Link></li>
              <li><Link to="/prenota" className="hover:text-[#FFFFFF] transition">Prenota Posti</Link></li>
              <li><Link to="/compagnia" className="hover:text-[#FFFFFF] transition">La Compagnia</Link></li>
              <li><Link to="/blog" className="hover:text-[#FFFFFF] transition">Notizie & Articoli</Link></li>
              <li><Link to="/gallery" className="hover:text-[#FFFFFF] transition">Galleria Foto & Video</Link></li>
            </ul>
          </div>

          {/* Official Contacts */}
          <div>
            <h3 className="font-serif-display text-sm font-semibold text-[#FFFFFF] uppercase tracking-wider mb-4">
              Sede e Contatti
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFFFFF] shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFFFFF] shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-[#FFFFFF] transition">{siteConfig.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFFFFF] shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[#FFFFFF] transition truncate">{siteConfig.email}</a>
              </li>
            </ul>
          </div>

          {/* Transparent Ticketing Info */}
          <div className="bg-[#1A0505]/20 border border-[#FFFFFF]/20 p-4 rounded-md">
            <h3 className="font-serif-display text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-2">
              Informazioni Biglietti
            </h3>
            <p className="text-[11px] text-[#FFFFFF]/80 leading-normal">
              Nessun pagamento avviene online. Le prenotazioni sul sito costituiscono richiesta di posto. La conferma ed eventuale saldo avvengono direttamente presso la cassa del teatro prima dello spettacolo.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#FFFFFF]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FFFFFF]/60 gap-4">
          <div>
            © {new Date().getFullYear()} {siteConfig.name} - Tutti i diritti riservati.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-[#FFFFFF] transition">Privacy & Cookie Policy</Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-[#FFFFFF] transition">Pannello Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
