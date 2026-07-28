# Il Sipario – Compagnia Teatrale A.P.S. (Canicattini Bagni, SR)

Sito ufficiale e piattaforma di prenotazione integrata per la compagnia teatrale "Il Sipario A.P.S." di Canicattini Bagni (Siracusa).

## 🎭 Caratteristiche Tecniche e Design
- **3D Teatrale Immersivo & Accessibile:** Scena React Three Fiber (sipario bordeaux, riflettori di scena, particelle e cornice) con degradazione progressiva automatica (CSS fallback per assenza WebGL o modalità `prefers-reduced-motion`).
- **HTML-First & SEO:** Tutti i testi, form e CTA vivono nel DOM HTML, senza intercettazioni di click da parte del Canvas 3D.
- **Prenotazione Posti Chiara:** Flusso guidato senza pagamenti online. L'utente invia una richiesta ed ottiene un codice univoco (es. `SIP-2026-AB12CD`) per il saldo e ritiro diretto alla cassa del teatro.
- **CMS Admin Scaffold:** Area protetta `/admin` con ruoli (`admin`, `editor`, `box_office`).

## 🛠️ Stack Tecnologico
- **Frontend:** React 19, TypeScript, React Router 7, Tailwind CSS v4, Lucide Icons
- **3D & Animazioni:** Three.js, `@react-three/fiber`, `@react-three/drei`, Motion
- **Architettura Cloud (Target Cloudflare):**
  - Frontend: Cloudflare Pages
  - Backend API: Cloudflare Workers
  - Database Relazionale: Cloudflare D1 (Drizzle ORM)
  - Archiviazione Media: Cloudflare R2
  - Protezione Form: Cloudflare Turnstile

---

## 🚀 Guida all'Avvio Locale

### 1. Installazione Dipendenze
```bash
npm install
```

### 2. Avvio del Server di Sviluppo
```bash
npm run dev
```
L'applicazione sarà accessibile all'indirizzo `http://localhost:3000`.

### 3. Verifica Tipi e Linting
```bash
npm run lint
```

---

## 📋 Variabili d'Ambiente (`.env.example`)

| Variabile | Descrizione |
| :--- | :--- |
| `GEMINI_API_KEY` | Chiave API per integrazioni AI facoltative server-side |
| `APP_URL` | URL pubblico dell'applicazione |
| `CLOUDFLARE_TURNSTILE_SITE_KEY` | Chiave pubblica per Turnstile antispam |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Chiave segreta per verifica server-side Turnstile |

---

## 🗄️ Piano Migrazioni Cloudflare D1 & R2 (Sprint Successivi)

1. **Inizializzazione D1 Database:**
   ```bash
   npx wrangler d1 create il-sipario-db
   ```
2. **Esecuzione Migrazioni:**
   ```bash
   npx wrangler d1 migrations apply il-sipario-db --local
   ```
3. **Collegamento R2 Bucket per Locandine e Galleria:**
   ```bash
   npx wrangler r2 bucket create il-sipario-media
   ```
