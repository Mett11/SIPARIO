export async function onRequestGet({ env, params }: any) {
  const { id } = params;
  try {
    let booking = null;
    if (env.DB) {
      const row = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
      if (row) {
        booking = {
          id: row.id,
          code: row.code,
          performanceId: row.performance_id,
          fullName: row.full_name,
          email: row.email,
          phone: row.phone,
          seatsCount: row.seats_count,
          notes: row.notes,
          status: row.status,
          createdAt: row.created_at
        };
      }
    }
    
    if (!booking) {
      return new Response(JSON.stringify({ success: false, error: 'Prenotazione non trovata' }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ success: true, data: booking, events: [] }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function onRequestDelete({ env, params }: any) {
  const { id } = params;
  try {
    if (env.DB) {
      await env.DB.prepare('DELETE FROM bookings WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: 'Eliminata' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
