import { BookingRequest } from '../types';

export interface EmailRenderResult {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export function generateBookingEmail(
  type: 'CONFIRMED' | 'WAITLIST' | 'CANCELLED' | 'REMINDER' | 'CHECKED_IN',
  booking: BookingRequest,
  venueInfo?: { name: string; address: string }
): EmailRenderResult {
  const showTitle = booking.showTitle || 'Spettacolo Teatrale';
  const perfDateStr = new Date(booking.performanceDateTime).toLocaleString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const venueName = venueInfo?.name || 'Teatro Comunale G. Verdi';
  const venueAddress = venueInfo?.address || 'Canicattini Bagni (SR)';

  const brandHeader = `
    <div style="background-color: #1A0505; padding: 24px; text-align: center; border-bottom: 3px solid #FFFFFF;">
      <h1 style="color: #FFFFFF; font-family: Georgia, serif; margin: 0; font-size: 24px;">Compagnia Teatrale Il Sipario A.P.S.</h1>
      <p style="color: #FFFFFF; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Canicattini Bagni (SR)</p>
    </div>
  `;

  const brandFooter = `
    <div style="background-color: #050505; color: #FFFFFF; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #FFFFFF; margin-top: 30px;">
      <p style="margin: 0 0 6px 0; color: #FFFFFF; font-weight: bold;">Compagnia Teatrale Il Sipario A.P.S.</p>
      <p style="margin: 0 0 6px 0;">Via Antonino Uccello 6, 96010 Canicattini Bagni (SR) | Tel: +39 339 492 3772</p>
      <p style="margin: 0; color: #888;">Associazione di Promozione Sociale - Nessun pagamento richiesto online.</p>
    </div>
  `;

  if (type === 'CONFIRMED') {
    return {
      subject: `[Il Sipario] Conferma Prenotazione: ${booking.code} - ${showTitle}`,
      textBody: `Gentile ${booking.fullName},\n\nLa tua prenotazione per lo spettacolo "${showTitle}" è CONFERMATA!\n\nCodice Prenotazione: ${booking.code}\nPosti Riservati: ${booking.seatsCount}\nData e Ora: ${perfDateStr}\nLuogo: ${venueName} (${venueAddress})\n\nIstruzioni per il ritiro:\nPresentati alla cassa del teatro almeno 20 minuti prima dell'inizio dello spettacolo esibendo il codice ${booking.code}. Il saldo avverrà direttamente in cassa.\n\nGrazie per sostenere il teatro amatoriale!`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f6f0; padding: 20px; color: #1a1a1a;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2d9c8;">
            ${brandHeader}
            <div style="padding: 30px;">
              <div style="background-color: #e6f4ea; border: 1px solid #34a853; color: #137333; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
                ✓ PRENOTAZIONE CONFERMATA CON SUCCESS
              </div>
              <p>Gentile <strong>${booking.fullName}</strong>,</p>
              <p>siamo lieti di confermare la tua prenotazione per la replica teatrale:</p>
              
              <div style="background: #faf8f5; border-left: 4px solid #FFFFFF; padding: 16px; margin: 20px 0;">
                <h2 style="margin: 0 0 8px 0; font-family: Georgia, serif; color: #1A0505;">${showTitle}</h2>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Codice Prenotazione:</strong> <span style="font-family: monospace; font-size: 18px; color: #E60000; background: #f0e6d2; padding: 2px 8px; border-radius: 4px;">${booking.code}</span></p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Posti Riservati:</strong> ${booking.seatsCount} Posti</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Data e Ora:</strong> ${perfDateStr}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Luogo:</strong> ${venueName} - ${venueAddress}</p>
              </div>

              <div style="background: #fff8e1; border: 1px solid #ffe082; padding: 14px; border-radius: 6px; font-size: 13px; color: #5d4037; margin-bottom: 20px;">
                <strong>📍 Indicazioni e Pagamento in Cassa:</strong><br/>
                Non è stato effettuato alcun addebito online. Ti preghiamo di presentarti alla cassa del teatro almeno <strong>20 minuti prima</strong> dell'orario d'inizio per confermare la presenza e ritirare i tagliandi.
              </div>

              <p style="font-size: 13px; color: #666;">In caso di imprevisti o impossibilità a partecipare, ti chiediamo cortesemente di contattarci al 339 492 3772 o via email per liberare i posti.</p>
            </div>
            ${brandFooter}
          </div>
        </div>
      `,
    };
  }

  if (type === 'WAITLIST') {
    return {
      subject: `[Il Sipario] Inserimento in Lista d'Attesa: ${booking.code} - ${showTitle}`,
      textBody: `Gentile ${booking.fullName},\n\nLa tua richiesta per lo spettacolo "${showTitle}" è stata inserita in LISTA D'ATTESA.\n\nCodice Pratica: ${booking.code}\nPosti Richiesti: ${booking.seatsCount}\nData: ${perfDateStr}\n\nLa capienza ordinaria della sala è attualmente esaurita. Qualora si liberassero posti a seguito di rinunce, verrai contattato tempestivamente dal nostro box office.\n\nCordiali saluti,\nCompagnia Teatrale Il Sipario`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f6f0; padding: 20px; color: #1a1a1a;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2d9c8;">
            ${brandHeader}
            <div style="padding: 30px;">
              <div style="background-color: #fef7e0; border: 1px solid #f9ab00; color: #b06000; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
                ⏳ INSERITO IN LISTA D'ATTESA
              </div>
              <p>Gentile <strong>${booking.fullName}</strong>,</p>
              <p>la tua richiesta di prenotazione per lo spettacolo <strong>${showTitle}</strong> (${perfDateStr}) è stata inserita nella <strong>Lista d'Attesa</strong> del nostro teatro.</p>
              
              <div style="background: #faf8f5; border-left: 4px solid #f9ab00; padding: 16px; margin: 20px 0;">
                <p style="margin: 4px 0; font-size: 14px;"><strong>Codice Pratica:</strong> <span style="font-family: monospace; font-size: 16px;">${booking.code}</span></p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Posti Richiesti:</strong> ${booking.seatsCount}</p>
              </div>

              <p style="font-size: 14px; line-height: 1.6;">I posti disponibili in sala sono temporaneamente esauriti. In caso di disdette o ampliamento della platea, sarai contattato telefonicamente o via email per la conferma immediata.</p>
            </div>
            ${brandFooter}
          </div>
        </div>
      `,
    };
  }

  if (type === 'CANCELLED') {
    return {
      subject: `[Il Sipario] Annullamento Prenotazione: ${booking.code} - ${showTitle}`,
      textBody: `Gentile ${booking.fullName},\n\nTi confermiamo l'ANNULLAMENTO della tua prenotazione (Codice: ${booking.code}) per lo spettacolo "${showTitle}" in data ${perfDateStr}.\n\nI posti riservati sono stati riaffidati alla disponibilità della compagnia.\n\nSperiamo di vederti presto al prossimo appuntamento teatrale!`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f6f0; padding: 20px; color: #1a1a1a;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2d9c8;">
            ${brandHeader}
            <div style="padding: 30px;">
              <div style="background-color: #fce8e6; border: 1px solid #d93025; color: #a50e0e; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
                ✕ PRENOTAZIONE ANNULLATA
              </div>
              <p>Gentile <strong>${booking.fullName}</strong>,</p>
              <p>ti informiamo che la prenotazione <strong>${booking.code}</strong> per lo spettacolo <strong>${showTitle}</strong> del ${perfDateStr} è stata cancellata.</p>
              <p style="font-size: 13px; color: #666; margin-top: 15px;">Se l'annullamento è avvenuto per errore o desideri maggiori informazioni, ti invitiamo a contattare la biglietteria.</p>
            </div>
            ${brandFooter}
          </div>
        </div>
      `,
    };
  }

  // Default REMINDER
  return {
    subject: `[Il Sipario] Promemoria Spettacolo: ${showTitle} - Codice ${booking.code}`,
    textBody: `Gentile ${booking.fullName},\n\nTi ricordiamo che ti aspettiamo a teatro per lo spettacolo "${showTitle}"!\n\nData e Ora: ${perfDateStr}\nLuogo: ${venueName} (${venueAddress})\nCodice Prenotazione: ${booking.code}\nPosti: ${booking.seatsCount}\n\nRicordati di presentarti in cassa almeno 20 minuti prima dello spettacolo.\n\nA presto!`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; background-color: #f8f6f0; padding: 20px; color: #1a1a1a;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2d9c8;">
          ${brandHeader}
          <div style="padding: 30px;">
            <div style="background-color: #e8f0fe; border: 1px solid #1a73e8; color: #174ea6; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
              🔔 PROMEMORIA SPETTACOLO TEATRALE
            </div>
            <p>Gentile <strong>${booking.fullName}</strong>,</p>
            <p>mancano pochi giorni allo spettacolo teatrale <strong>${showTitle}</strong>!</p>
            
            <div style="background: #faf8f5; border-left: 4px solid #1a73e8; padding: 16px; margin: 20px 0;">
              <p style="margin: 4px 0; font-size: 14px;"><strong>Codice Prenotazione:</strong> <span style="font-family: monospace; font-size: 18px; color: #E60000;">${booking.code}</span></p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Data e Ora:</strong> ${perfDateStr}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Luogo:</strong> ${venueName} (${venueAddress})</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Posti Riservati:</strong> ${booking.seatsCount}</p>
            </div>

            <p style="font-size: 13px; color: #555;">Ti ricordiamo di presentarti presso la cassa del teatro 20 minuti prima dell'inizio esibendo il codice per ritirare i tuoi tagliandi.</p>
          </div>
          ${brandFooter}
        </div>
      </div>
    `,
  };
}
