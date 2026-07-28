export async function onRequestPut({ request, env, params }: any) {
  const { id } = params;
  try {
    const body = await request.json();
    if (env.DB) {
      await env.DB.prepare(`
        UPDATE performances 
        SET show_id = ?, date_time = ?, venue_name = ?, venue_address = ?, capacity_total = ?, 
            booking_open_at = ?, booking_close_at = ?, ticket_price_display = ?, instructions = ?
        WHERE id = ?
      `).bind(
        body.showId, body.dateTime, body.venueName, body.venueAddress, body.capacityTotal, 
        body.bookingOpenAt, body.bookingCloseAt, body.ticketPriceDisplay || '', body.instructions || '', id
      ).run();
    }
    return new Response(JSON.stringify({ success: true, data: { id, ...body } }), {
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
      await env.DB.prepare('DELETE FROM performances WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: 'Eliminato' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
