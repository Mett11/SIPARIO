# Guida Migrazioni e Strategia Rollback per Cloudflare D1

## 📄 File di Migrazione
- `0001_sprint2_schema.sql`: Creazione dello schema relazionale per utenti, ruoli, pagine, spettacoli, repliche, blog, media assets e audit logs.
- `0001_sprint2_schema_down.sql`: Script di rollback per ripristinare il database eliminando in modo sicuro le tabelle nell'ordine inverso.
- `seed_demo.sql`: Inserimento dei dati demo per ruoli, utenti di test e categorie del blog.

## 🚀 Esecuzione su Cloudflare D1 (Ambiente di Produzione)

### 1. Applicare la migrazione
```bash
npx wrangler d1 execute il-sipario-db --file=./migrations/0001_sprint2_schema.sql
npx wrangler d1 execute il-sipario-db --file=./migrations/seed_demo.sql
```

### 2. Strategia di Rollback in caso di emergenza
Qualora si riscontrino anomalie critiche durante il deploy:
```bash
npx wrangler d1 execute il-sipario-db --file=./migrations/0001_sprint2_schema_down.sql
```
L'operatore deve assicurarsi che sia stato preventivamente eseguito un export di sicurezza tramite `wrangler d1 backup create il-sipario-db`.
