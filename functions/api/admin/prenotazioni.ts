export async function onRequestGet({ request, env, data }: any) {
  const url = new URL(request.url);
  const performanceId = url.searchParams.get('performanceId');
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');

  // We are assuming `env.DB` is configured in wrangler.toml
  // We'll mock the query building process for D1
  let query = 'SELECT * FROM bookings WHERE 1=1';
  const params: any[] = [];

  if (performanceId && performanceId !== 'all') {
    query += ' AND performance_id = ?';
    params.push(performanceId);
  }

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    const q = `%${search.toLowerCase()}%`;
    query += ' AND (LOWER(code) LIKE ? OR LOWER(full_name) LIKE ? OR LOWER(email) LIKE ? OR phone LIKE ?)';
    params.push(q, q, q, q);
  }

  try {
    // In a real scenario we use env.DB.prepare(query).bind(...params).all()
    // However since we don't have the D1 bindings set up in this preview, 
    // we'll try/catch and return an empty array if DB is not available
    let result = { results: [] };
    if (env.DB) {
      const stmt = env.DB.prepare(query);
      result = await stmt.bind(...params).all();
    }

    const data = result.results.map((row: any) => ({
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
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      data: data,
      metrics: {
        totalBookings: data.length,
        // compute other metrics based on result...
      }
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
