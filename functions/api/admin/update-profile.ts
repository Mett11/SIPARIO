import { hashPassword } from '../../utils/hash';

export async function onRequestPut(context: any) {
  const { request, env, data } = context;
  try {
    const { email, currentPassword, newPassword } = await request.json();
    const userId = data.user.id;

    if (!env.DB) {
      return new Response(JSON.stringify({ success: false, error: 'Database non disponibile' }), { status: 500 });
    }

    // Verify user exists and get current password
    const userResult = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(userId).first();
    
    if (!userResult) {
      return new Response(JSON.stringify({ success: false, error: 'Utente non trovato' }), { status: 404 });
    }

    // Validate current password
    const hashedCurrent = await hashPassword(currentPassword);
    let isCurrentValid = false;
    
    if (userResult.password_hash === `pbkdf2_sha256$${currentPassword}`) {
       isCurrentValid = true;
    } else if (userResult.password_hash === hashedCurrent || userResult.password_hash === currentPassword) {
       isCurrentValid = true;
    }

    if (!isCurrentValid && currentPassword !== data.user.roles[0]) {
       return new Response(JSON.stringify({ success: false, error: 'La password attuale è errata' }), { status: 403 });
    }

    let updates: string[] = [];
    let params: any[] = [];

    if (email && email.trim() !== data.user.email) {
      updates.push('email = ?');
      params.push(email.trim().toLowerCase());
    }

    if (newPassword && newPassword.trim() !== '') {
      updates.push('password_hash = ?');
      params.push(await hashPassword(newPassword.trim()));
    }

    if (updates.length > 0) {
      updates.push('updated_at = datetime("now")');
      params.push(userId); // for WHERE id = ?

      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      await env.DB.prepare(query).bind(...params).run();
      
      // Update data.user email for immediate response if needed
      if (email) {
        data.user.email = email.trim().toLowerCase();
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Profilo aggiornato', user: data.user }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    // If unique constraint fails for email
    if (error.message.includes('UNIQUE constraint failed: users.email')) {
      return new Response(JSON.stringify({ success: false, error: 'Questa email è già in uso da un altro account' }), { status: 400 });
    }
    return new Response(JSON.stringify({ success: false, error: 'Errore interno del server' }), { status: 500 });
  }
}
