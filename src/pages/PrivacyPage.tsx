import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-[#FFFFFF]/30 pb-6">
        <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
          Informativa Legale
        </span>
        <h1 className="font-serif-display text-4xl font-bold text-[#FFFFFF] mt-1">
          Privacy e Cookie Policy
        </h1>
        <p className="text-xs text-[#FFFFFF]/70 mt-2">
          Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR)
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#FFFFFF]/85 leading-relaxed font-sans">
        <section className="space-y-2 bg-[#1A0505]/15 border border-[#FFFFFF]/20 p-6 rounded-xl">
          <h2 className="font-serif-display text-lg font-bold text-[#FFFFFF]">
            1. Titolare del Trattamento
          </h2>
          <p>
            Il Titolare del Trattamento dei dati personali è l'Associazione di Promozione Sociale <strong>“Il Sipario – Compagnia Teatrale A.P.S.”</strong>, con sede legale in Via Antonino Uccello 6, 96010 Canicattini Bagni (SR). Email di contatto: <code>ilsipariocompagniateatrale@gmail.com</code>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-[#FFFFFF]">
            2. Tipologia di Dati Raccolti e Finalità
          </h2>
          <p>I dati raccolti tramite i moduli del presente sito includono:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Dati di Prenotazione:</strong> nome, cognome, indirizzo email e numero di telefono utili esclusivamente per la gestione delle prenotazioni e la conferma dei posti a sedere per gli spettacoli teatrali.</li>
            <li><strong>Dati di Contatto:</strong> dati inviati volontariamente dagli utenti tramite i moduli di richiesta informazioni.</li>
            <li><strong>Cookie Tecnici:</strong> cookie strettamente necessari alla navigazione ed al salvataggio delle preferenze di accessibilità visiva e modalità 3D.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-[#FFFFFF]">
            3. Assenza di Transazioni Economiche e Pagamenti Online
          </h2>
          <p>
            Il sito non raccoglie dati bancari, carte di credito o informazioni finanziarie. Nessun pagamento viene effettuato online.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-display text-lg font-bold text-[#FFFFFF]">
            4. Diritti dell'Interessato
          </h2>
          <p>
            L'utente può in qualsiasi momento esercitare i diritti previsti dagli art. 15-22 del GDPR (accesso, rettifica, cancellazione, limitazione del trattamento) scrivendo a <code>ilsipariocompagniateatrale@gmail.com</code>.
          </p>
        </section>
      </div>
    </div>
  );
};
