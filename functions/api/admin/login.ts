import { signJWT } from '../../utils/jwt';

export async function onRequestPost({ request, env }: any) {
  try {
    const { email, password } = await request.json();

    // Mock Users / Fetch from DB in a real scenario
    const mockUsers = [
      { id: 'usr-admin-1', email: 'admin@ilsipario.it', fullName: 'Amministratore Sipario', roles: ['admin'] },
      { id: 'usr-editor-1', email: 'editor@ilsipario.it', fullName: 'Elena Guastella (Editor)', roles: ['editor'] },
      { id: 'usr-boxoffice-1', email: 'boxoffice@ilsipario.it', fullName: 'Operatore Biglietteria', roles: ['box_office'] },
    ];

    const user = mockUsers.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    
    // Very simple check: password = role name (e.g., admin)
    if (!user || password !== user.roles[0]) {
      return new Response(JSON.stringify({ success: false, error: 'Credenziali non valide' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = await signJWT(
      { id: user.id, email: user.email, roles: user.roles, fullName: user.fullName },
      env.ADMIN_SECRET_KEY,
      8 * 60 * 60 // 8 hours
    );

    const isSecure = (new URL(request.url)).protocol === 'https:';
    
    return new Response(JSON.stringify({ success: true, user, token }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `admin_session=${token}; HttpOnly; ${isSecure ? 'Secure;' : ''} SameSite=Lax; Path=/; Max-Age=${8 * 60 * 60}`
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Errore interno' }), { status: 500 });
  }
}
