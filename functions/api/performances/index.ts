export async function onRequestGet({ env }: any) {
  try {
    let result = { results: [] };
    if (env.DB) {
      result = await env.DB.prepare('SELECT * FROM performances').all();
    }
    const data = result.results.map((row: any) => ({
      id: row.id,
      showId: row.show_id,
      dateTime: row.date_time,
      venueName: row.venue_name,
      venueAddress: row.venue_address,
      capacityTotal: row.capacity_total,
      seatsReserved: row.seats_reserved,
      bookingOpenAt: row.booking_open_at,
      bookingCloseAt: row.booking_close_at,
      bookingStatus: row.booking_status,
      seatingMode: row.seating_mode,
      ticketPriceDisplay: row.ticket_price_display,
      instructions: row.instructions,
    }));
    return new Response(JSON.stringify({ success: true, data }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function onRequestPost({ request, env }: any) {
  try {
    const body = await request.json();
    const newId = `perf-${Date.now()}`;
    
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO performances 
        (id, show_id, date_time, venue_name, venue_address, capacity_total, booking_open_at, booking_close_at, ticket_price_display, instructions) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newId, body.showId, body.dateTime, body.venueName, body.venueAddress, body.capacityTotal, 
        body.bookingOpenAt, body.bookingCloseAt, body.ticketPriceDisplay || '', body.instructions || ''
      ).run();
    }
    
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
