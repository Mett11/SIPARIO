export async function onRequestGet({ env, params }: any) {
  const { id } = params;
  try {
    let performance = null;
    let bookedSeats = 0;
    
    if (env.DB) {
      performance = await env.DB.prepare('SELECT * FROM performances WHERE id = ?').bind(id).first();
      // In a real scenario you would count the booked seats from bookings table
      // e.g. await env.DB.prepare('SELECT SUM(seats_count) as total FROM bookings WHERE performance_id = ? AND status != "cancelled"').bind(id).first();
    }
    
    if (!performance) {
      return new Response(JSON.stringify({ success: false, error: 'Replica non trovata' }), { status: 404 });
    }
    
    const capacityTotal = performance.capacity_total;
    const available = capacityTotal - bookedSeats;
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        performanceId: id,
        capacityTotal,
        seatsReserved: bookedSeats,
        available,
        status: available > 0 ? 'available' : 'sold_out'
      } 
    }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
