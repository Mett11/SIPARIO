import { verifyJWT } from '../../utils/jwt';

export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  try {
    await verifyJWT(token, env.ADMIN_SECRET_KEY || 'sipario_admin_secret_key_2026');
  } catch (e) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { overrides } = await request.json();
    if (!env.DB) throw new Error('Database non disponibile');
    
    await env.DB.prepare(
      'INSERT INTO site_config (id, key, value_json) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json'
    ).bind('config-live-edit', 'live_edit_overrides', JSON.stringify(overrides)).run();

    return new Response(JSON.stringify({ success: true }));
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
