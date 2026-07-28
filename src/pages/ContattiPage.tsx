import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Send, CheckCircle } from 'lucide-react';

export const ContattiPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="border-b border-[#FFFFFF]/30 pb-6">
        <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
          Restiamo in Contatto
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#FFFFFF] mt-1">
          Contatti & Sede Sociale
        </h1>
        <p className="text-sm text-[#FFFFFF]/80 mt-2 max-w-2xl leading-relaxed">
          Hai domande sugli spettacoli, vuoi maggiori informazioni o sei interessato a collaborare con noi? Scrivici o chiamaci direttamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info & Socials */}
        <div className="space-y-8 bg-[#1A0505]/15 border border-[#FFFFFF]/30 p-8 rounded-xl">
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF]">
            Recapiti Ufficiali
          </h2>

          <ul className="space-y-6 text-sm">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A0505] border border-[#FFFFFF] flex items-center justify-center text-[#FFFFFF] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#FFFFFF] uppercase font-semibold block">Indirizzo Sede</span>
                <span className="text-[#FFFFFF] font-medium">Via Antonino Uccello 6, 96010 Canicattini Bagni (SR)</span>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A0505] border border-[#FFFFFF] flex items-center justify-center text-[#FFFFFF] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#FFFFFF] uppercase font-semibold block">Telefono</span>
                <a href="tel:+393394923772" className="text-[#FFFFFF] font-medium hover:text-[#FFFFFF] transition">
                  +39 339 492 3772
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A0505] border border-[#FFFFFF] flex items-center justify-center text-[#FFFFFF] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#FFFFFF] uppercase font-semibold block">Email</span>
                <a href="mailto:ilsipariocompagniateatrale@gmail.com" className="text-[#FFFFFF] font-medium hover:text-[#FFFFFF] transition">
                  ilsipariocompagniateatrale@gmail.com
                </a>
              </div>
            </li>
          </ul>

          <div className="pt-6 border-t border-[#FFFFFF]/20">
            <span className="text-xs text-[#FFFFFF] uppercase font-semibold block mb-3">Seguici sui Social Network</span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/ilsipariocanicattinibagni/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-[#050505] border border-[#FFFFFF]/40 text-xs text-[#FFFFFF] hover:text-[#FFFFFF] flex items-center gap-2 transition"
              >
                <Facebook className="w-4 h-4 text-[#FFFFFF]" /> Facebook
              </a>
              <a
                href="https://www.instagram.com/compagnia_ilsipario/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-[#050505] border border-[#FFFFFF]/40 text-xs text-[#FFFFFF] hover:text-[#FFFFFF] flex items-center gap-2 transition"
              >
                <Instagram className="w-4 h-4 text-[#FFFFFF]" /> Instagram
              </a>
              <a
                href="https://www.youtube.com/channel/UC9CEjFQvC9LgSfypbaP5LfA"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded bg-[#050505] border border-[#FFFFFF]/40 text-xs text-[#FFFFFF] hover:text-[#FFFFFF] flex items-center gap-2 transition"
              >
                <Youtube className="w-4 h-4 text-[#FFFFFF]" /> YouTube
              </a>
            </div>
          </div>

          {/* Non-blocking External Map Card */}
          <div className="p-4 bg-[#050505] border border-[#FFFFFF]/30 rounded-lg text-xs space-y-2">
            <span className="font-semibold text-[#FFFFFF]">Mappa e Indicazioni Stradali</span>
            <p className="text-[#FFFFFF]/80">
              Siamo situati nel centro storico di Canicattini Bagni (SR). Puoi aprire la mappa esterna senza caricamenti bloccanti.
            </p>
            <a
              href="https://maps.google.com/?q=Via+Antonino+Uccello+6+Canicattini+Bagni"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold text-[#FFFFFF] hover:underline"
            >
              Apri su Google Maps →
            </a>
          </div>
        </div>

        {/* Interactive Contact Form */}
        <div className="bg-[#050505] border border-[#FFFFFF]/30 p-8 rounded-xl shadow-xl space-y-6">
          <h2 className="font-serif-display text-2xl font-bold text-[#FFFFFF]">
            Invia un Messaggio
          </h2>

          {submitted ? (
            <div className="p-6 bg-[#1A0505]/40 border border-[#FFFFFF] rounded-lg text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-[#FFFFFF] mx-auto" />
              <h3 className="font-serif-display text-lg font-bold text-[#FFFFFF]">Messaggio Inviato</h3>
              <p className="text-xs text-[#FFFFFF]/80">
                Grazie per averci contattato. Risponderemo al più presto.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#FFFFFF] underline hover:text-[#FFFFFF]"
              >
                Invia un altro messaggio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Nome e Cognome *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
                  placeholder="Es. Mario Rossi"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Indirizzo Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
                  placeholder="mario.rossi@email.it"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Telefono (opzionale)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
                  placeholder="+39 333 1234567"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">Messaggio *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#050505] border border-[#FFFFFF]/40 rounded p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
                  placeholder="Scrivi qui il tuo messaggio..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E60000] hover:bg-[#1A0505] text-[#FFFFFF] font-semibold rounded border border-[#FFFFFF]/60 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4 text-[#FFFFFF]" />
                <span>Invia Messaggio</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
