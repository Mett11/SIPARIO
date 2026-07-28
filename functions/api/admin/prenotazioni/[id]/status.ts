export async function onRequestPatch({ request, env, params }: any) {
  const { id } = params;
  try {
    const { status, reason } = await request.json();
    
    let booking = null;
    if (env.DB) {
      await env.DB.prepare('UPDATE bookings SET status = ? WHERE id = ?').bind(status, id).run();
      const row = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
      if (row) {
        booking = {
          id: row.id,
          code: row.code,
          status: row.status,
          reason: reason
        };
      }
    }

    return new Response(JSON.stringify({ success: true, data: booking }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
