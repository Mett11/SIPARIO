import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Ticket, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { UserPreferences } from '../../types';

interface HeaderProps {
  siteName: string;
  userPreferences: UserPreferences;
  onTogglePreferences: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  siteName,
  userPreferences,
  onTogglePreferences,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'La Compagnia', path: '/compagnia' },
    { label: 'Spettacoli', path: '/spettacoli' },
    { label: 'Calendario', path: '/calendario' },
    { label: 'Blog', path: '/blog' },
    { label: 'Galleria', path: '/gallery' },
    { label: 'Contatti', path: '/contatti' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-nero-palco/90 backdrop-blur-md border-b border-white/10 transition-colors">
      {/* Top Notification / Quick Contact Strip */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
        <div className="flex items-center gap-4">
          <span>Canicattini Bagni (SR)</span>
          <span className="text-gray-600">•</span>
          <a href="tel:+393394923772" className="flex items-center gap-1 hover:text-white transition-colors">
            <Phone className="w-3 h-3 text-rosso-sipario" /> +39 339 492 3772
          </a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePreferences}
            className="flex items-center gap-1 hover:text-white focus:outline-none transition-colors"
            title="Personalizza Accessibilità e Grafica 3D"
          >
            <Sparkles className="w-3 h-3 text-rosso-sipario" />
            <span>3D: {userPreferences.quality3d} {userPreferences.reducedMotion ? '(No Motion)' : ''}</span>
          </button>
          <span className="text-gray-600">|</span>
          <Link to="/admin" className="hover:text-white transition-colors">Area Riservata</Link>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-white/30 shadow-lg group-hover:scale-105 transition-transform bg-black shrink-0">
            <img src="/logo.svg" alt="Il Sipario Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
          </div>
          <div>
            <span className="font-cinzel text-lg sm:text-xl tracking-widest font-bold text-white block leading-none">
              IL SIPARIO
            </span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest block mt-1 font-bold">
              Compagnia Teatrale A.P.S.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigazione Principale">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors py-1 relative ${
                isActive(link.path)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-rosso-sipario" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions (Area Riservata + Booking CTA + Mobile Menu Button) */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-gray-200 hover:text-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors focus:outline-none rounded-md bg-white/5 hover:bg-white/10"
            title="Accesso Area Riservata Staff / Admin"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rosso-sipario" />
            <span>Area Riservata</span>
          </Link>

          <Link
            to="/prenota"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-rosso-sipario shadow-md rounded-md"
          >
            <Ticket className="w-4 h-4 text-rosso-sipario" />
            <span>Prenota</span>
          </Link>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-white hover:text-gray-300 focus:outline-none"
            aria-label={isMobileOpen ? 'Chiudi menu' : 'Apri menu'}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="lg:hidden bg-nero-palco border-b border-white/10 px-6 py-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`text-[11px] uppercase tracking-widest font-bold py-3 px-4 ${
                  isActive(link.path)
                    ? 'bg-white/5 text-white border-l-2 border-rosso-sipario'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            <button
              onClick={() => {
                onTogglePreferences();
                setIsMobileOpen(false);
              }}
              className="flex items-center gap-1 hover:text-white"
            >
              <Sparkles className="w-3.5 h-3.5 text-rosso-sipario" /> Preferenze 3D
            </button>
            <Link to="/admin" onClick={() => setIsMobileOpen(false)} className="hover:text-white">
              Area Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
