export async function onRequestGet({ env }: any) {
  try {
    let result = { results: [] };
    if (env.DB) {
      result = await env.DB.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
    }
    return new Response(JSON.stringify({ success: true, data: result.results }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
