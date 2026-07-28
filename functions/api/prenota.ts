import { generateBookingEmail } from '../../src/lib/emailTemplates';

export async function onRequestPost({ request, env }: any) {
  try {
    const body = await request.json();
    const { turnstileToken, honeypot, email, fullName, phone, seatsCount, performanceId, notes } = body;

    // 1. Honeypot check
    if (honeypot && String(honeypot).trim() !== '') {
      return new Response(JSON.stringify({ success: false, error: 'Spam rilevato' }), { status: 400 });
    }

    // 2. Turnstile validation
    if (!turnstileToken) {
      return new Response(JSON.stringify({ success: false, error: 'Validazione di sicurezza mancante.' }), { status: 400 });
    }

    const tsSecret = env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (tsSecret && tsSecret !== '1x0000000000000000000000000000000AA') {
      const tsResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: tsSecret,
          response: turnstileToken,
          remoteip: request.headers.get('CF-Connecting-IP')
        })
      });
      const tsOutcome: any = await tsResponse.json();
      if (!tsOutcome.success) {
        return new Response(JSON.stringify({ success: false, error: 'Validazione anti-spam fallita.' }), { status: 400 });
      }
    }

    // 3. Database operation (Cloudflare D1)
    let assignedStatus = 'confirmed';
    let isWaitlisted = false;
    let performance: any = { title: 'Spettacolo Teatrale', venueName: 'Teatro', venueAddress: 'Indirizzo' };
    const bookingCode = `SIP-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (env.DB) {
      // In a real implementation you would check seats available before inserting
      // This is a simplified D1 insert for the migration
      await env.DB.prepare(`
        INSERT INTO bookings (id, code, performance_id, full_name, email, phone, seats_count, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        `book-${Date.now()}`, bookingCode, performanceId, fullName, email, phone, seatsCount, notes || '', assignedStatus
      ).run();
    }

    const newBooking = {
      code: bookingCode,
      performanceId,
      fullName,
      email,
      phone,
      seatsCount,
      status: assignedStatus
    };

    // 4. Send Email via Resend
    const resendApiKey = env.RESEND_API_KEY;
    let emailPreview = null;
    
    const emailPayload = generateBookingEmail(
      isWaitlisted ? 'WAITLIST' : 'CONFIRMED',
      newBooking as any,
      { name: performance.venueName, address: performance.venueAddress }
    );

    if (resendApiKey && resendApiKey.startsWith('re_')) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Il Sipario <prenotazioni@ilsipario.it>',
          to: [email],
          subject: emailPayload.subject,
          html: emailPayload.htmlBody
        })
      });
      if (!resendResponse.ok) {
        console.error('Errore invio Resend:', await resendResponse.text());
      }
    } else {
      // Return email preview if key is missing (useful for dev)
      emailPreview = emailPayload;
    }

    return new Response(JSON.stringify({
      success: true,
      data: newBooking,
      emailPreview
    }), { headers: { 'Content-Type': 'application/json' } });
    
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
