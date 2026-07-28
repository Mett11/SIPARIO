# SKILL.md — Three.js / React Three Fiber per Il Sipario

## Obiettivo
Costruire un sito teatrale immersivo, elegante e accessibile.
Il 3D deve migliorare il racconto del brand, mai ostacolare lettura,
prenotazione, SEO, performance o uso mobile.

## Stack
- React + TypeScript
- Three.js tramite @react-three/fiber e @react-three/drei
- Animazioni HTML/UI con Framer Motion
- Tailwind CSS per UI 2D e design tokens
- Cloudflare Pages + Workers + D1 + R2
- Nessun pagamento online

## Principi non negoziabili
1. HTML-first: tutti i testi, CTA, form, dati di spettacoli e prenotazioni
   devono esistere come HTML semantico esterno al canvas.
2. Canvas progressivo: il sito deve funzionare integralmente anche se WebGL
   non è disponibile, se JavaScript è limitato o se l'utente sceglie
   "esperienza ridotta".
3. Mobile-first: il 3D su mobile deve essere più leggero e meno interattivo.
4. Rispetta prefers-reduced-motion: disabilita o riduci animazioni, camera
   movement, particelle e parallasse.
5. Non usare scene 3D pesanti o modelli GLTF non indispensabili.
6. Non renderizzare testo importante come texture o testo dentro il canvas.
7. Il canvas non deve catturare click/tap destinati alle UI HTML.
8. Una scena deve avere sempre fallback statico: immagine, gradiente,
   texture CSS o video leggero solo se strettamente necessario.
9. Il 3D non deve ritardare LCP, interazione del form o caricamento contenuti.
10. Non usare autoplay audio.

## Direzione artistica
Tema: teatro contemporaneo siciliano, caldo, materico, umano.
Palette:
- nero palco: #0D0A0A
- velluto bordeaux: #6E1423
- rosso sipario: #9D1C31
- ottone: #C7A15A
- carta avorio: #F4EBDC
- luce fredda: #A7C7E7

Elementi 3D ammessi:
- sipario a due teli con apertura lenta
- fasci di luce volumetrici simulati, non costosi
- particelle di polvere molto limitate
- locandine o cornici sospese
- silhouette di platea, quinte, proscenio
- leggere transizioni di camera, sempre disattivabili

Evita:
- look sci-fi, neon cyberpunk, controlli da videogame
- camera orbit libera nell'area prenotazioni
- eccesso di post-processing
- testo 3D di grandi dimensioni
- scene con fisica, shader complessi o file enormi

## Architettura componenti
src/
  components/
    three/
      TheatreScene.tsx
      Curtain.tsx
      StageLights.tsx
      FloatingPoster.tsx
      SceneFallback.tsx
      useQualityProfile.ts
    ui/
      Header.tsx
      Footer.tsx
      BookingForm.tsx
      ShowCard.tsx
  content/
    site-config.json
    shows.example.json
  pages/
  lib/
  styles/

## Quality profiles
Definisci low, medium, high in useQualityProfile().
La scelta deve dipendere da:
- prefers-reduced-motion
- touch device
- devicePixelRatio
- dimensioni viewport
- WebGL capability

Profilo low:
- dpr massimo 1
- niente particelle
- niente post-processing
- luci minime
- canvas statico o animazione molto lenta

Profilo medium:
- dpr massimo 1.5
- poche particelle
- ombre disabilitate o molto limitate

Profilo high:
- dpr massimo 2
- particelle limitate
- nessuna pipeline pesante di post-processing salvo necessità visiva reale

## Performance
- Lazy-load della scena Three.js dopo il primo contenuto HTML della home.
- Usa dynamic import e Suspense.
- Mantieni draw calls e geometrie al minimo.
- Riutilizza geometrie e materiali.
- Limita le texture e comprimi le immagini.
- Usa frameloop="demand" quando la scena non richiede rendering continuo.
- Non bloccare il thread principale durante la navigazione.
- Misura LCP, INP e CLS.
- Il form prenotazione non dipende mai dal caricamento del canvas.

## Accessibilità
- Canvas aria-hidden se decorativo.
- Fornisci descrizioni testuali degli elementi narrativi quando sono significativi.
- Focus visibile su ogni controllo UI.
- Contrasto AA minimo per il testo HTML.
- Tastiera pienamente supportata.
- La scena non deve essere necessaria per raggiungere nessuna pagina.
- La modalità ridotta va salvata nelle preferenze utente.

## Regole di implementazione
- TypeScript strict, componenti piccoli e riusabili.
- Nessun any.
- Non inventare API: dichiarare contratti request/response.
- Non mescolare logica API, 3D e UI nello stesso componente.
- Non introdurre dipendenze pesanti senza motivazione.
- Ogni nuovo componente Three.js deve avere fallback e cleanup.
- Non modificare l'architettura esistente senza prima ispezionarla.

## Criteri di accettazione
- Il sito è pienamente navigabile senza WebGL.
- La home mostra il primo contenuto utile prima della scena 3D completa.
- La prenotazione funziona su mobile lento.
- Reduced motion elimina aperture di sipario, camera motion e particelle.
- Nessun dato di prenotazione vive nel client oltre il necessario.