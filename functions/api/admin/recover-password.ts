import { hashPassword } from '../../utils/hash';

export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { email } = await request.json();

    if (!env.DB) {
      return new Response(JSON.stringify({ success: false, error: 'Database non disponibile' }), { status: 500 });
    }

    const userResult = await env.DB.prepare('SELECT id, full_name FROM users WHERE email = ? AND is_active = 1').bind(email.toLowerCase()).first();
    
    if (!userResult) {
      // Don't leak if email exists or not
      return new Response(JSON.stringify({ success: true, message: 'Se l\'email esiste nel sistema, riceverai una nuova password' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const newPassword = Math.random().toString(36).slice(-8); // Generate an 8 char random password
    const newHash = await hashPassword(newPassword);

    await env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?')
      .bind(newHash, userResult.id)
      .run();

    const resendApiKey = env.RESEND_API_KEY;
    if (resendApiKey && resendApiKey.startsWith('re_')) {
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

    return new Response(JSON.stringify({ success: true, message: 'Se l\'email esiste nel sistema, riceverai una nuova password' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: 'Errore interno' }), { status: 500 });
  }
}
