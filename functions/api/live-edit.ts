export async function onRequestGet(context: any) {
  const { env } = context;
  try {
    if (!env.DB) return new Response(JSON.stringify({}), { headers: { 'Content-Type': 'application/json' } });
    
    const result = await env.DB.prepare('SELECT value_json FROM site_config WHERE key = ?').bind('live_edit_overrides').first();
    
    if (result && result.value_json) {
      return new Response(result.value_json as string, { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({}), { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({}), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
