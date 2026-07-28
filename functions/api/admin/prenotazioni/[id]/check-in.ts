export async function onRequestPost({ env, params }: any) {
  const { id } = params;
  try {
    let booking = null;
    if (env.DB) {
      await env.DB.prepare('UPDATE bookings SET status = "checked_in" WHERE id = ? OR code = ?').bind(id, id).run();
      const row = await env.DB.prepare('SELECT * FROM bookings WHERE id = ? OR code = ?').bind(id, id).first();
      if (row) {
        booking = { id: row.id, status: row.status };
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Check-in effettuato', data: booking }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
