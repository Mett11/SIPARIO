import { hashPassword } from '../../utils/hash';

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { email } = await request.json();

    if (!env.DB) {
      return new Response(JSON.stringify({ success: false, error: 'Database non disponibile' }), { status: 500 });
    }

    const userResult = await env.DB.prepare('SELECT id, full_name FROM users WHERE LOWER(email) = ? AND is_active = 1').bind((email || '').toLowerCase()).first();
    
    if (!userResult) {
      return new Response(JSON.stringify({ success: true, message: 'Se l\'email esiste nel sistema, riceverai una nuova password' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const resendApiKey = env.RESEND_API_KEY;
    const isMockResend = !resendApiKey || resendApiKey === 're_123456789' || !resendApiKey.startsWith('re_');

    // In demo / mock mode, reset password back to 'admin'
    const newPassword = isMockResend ? 'admin' : Math.random().toString(36).slice(-8);
    const newHash = await hashPassword(newPassword);

    await env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?')
      .bind(newHash, userResult.id)
      .run();

    if (!isMockResend) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Il Sipario <admin@ilsipario.it>',
          to: [email],
          subject: 'Recupero Password - Il Sipario A.P.S.',
          html: `<p>Ciao ${userResult.full_name},</p><p>La tua nuova password per accedere al gestionale è: <strong>${newPassword}</strong></p><p>Ti consigliamo di cambiarla subito dopo il login nel tuo profilo.</p>`
        })
      });
      if (!resendResponse.ok) {
        console.error('Errore invio Resend:', await resendResponse.text());
      }
    }

    const message = isMockResend
      ? `Password ripristinata con successo a: admin`
      : 'Se l\'email esiste nel sistema, riceverai una nuova password via email';

    return new Response(JSON.stringify({ success: true, message }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: 'Errore interno' }), { status: 500 });
  }
}

