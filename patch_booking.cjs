const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const turnstileCheck = `
  const turnstileToken = req.body.turnstileToken;
  if (!turnstileToken) {
    return res.status(400).json({ success: false, error: 'Validazione di sicurezza Turnstile mancante.' });
  }

  // Se siamo in produzione (o abbiamo configurato una chiave segreta vera) verifichiamo il token
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (secretKey && secretKey !== '1x0000000000000000000000000000000AA') {
    try {
      const tsResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: secretKey,
          response: turnstileToken,
          remoteip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        })
      });
      const tsOutcome = await tsResponse.json();
      if (!tsOutcome.success) {
        return res.status(400).json({ success: false, error: 'Validazione anti-spam fallita.' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Errore di connessione a Cloudflare Turnstile.' });
    }
  }

`;

code = code.replace("app.post('/api/public/bookings', (req, res) => {", "app.post('/api/public/bookings', async (req, res) => {\n" + turnstileCheck);

fs.writeFileSync('server.ts', code);
