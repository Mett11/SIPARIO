export async function onRequestGet({ request, env }: any) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const publication_status = url.searchParams.get('publication_status');

  let query = 'SELECT * FROM shows WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (publication_status) {
    query += ' AND publication_status = ?';
    params.push(publication_status);
  }

  try {
    let result = { results: [] };
    if (env.DB) {
      const stmt = env.DB.prepare(query);
      result = await stmt.bind(...params).all();
    }
    const data = result.results.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      author: row.author,
      director: row.director,
      category: row.category,
      status: row.status,
      publication_status: row.publication_status,
      synopsis: row.synopsis,
      posterUrl: row.poster_url,
      durationMinutes: row.duration_minutes,
      targetAudience: row.target_audience,
      validation_status: row.validation_status
    }));
    return new Response(JSON.stringify({ success: true, data }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function onRequestPost({ request, env, data }: any) {
  // TODO: Add auth middleware via _middleware.ts in /spettacoli if needed
  try {
    const body = await request.json();
    const newId = `show-${Date.now()}`;
    
    if (env.DB) {
      await env.DB.prepare(
        'INSERT INTO shows (id, slug, title, subtitle, author, director, category, status, publication_status, synopsis, poster_url, duration_minutes, target_audience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(newId, body.slug, body.title, body.subtitle || '', body.author || '', body.director || '', body.category || 'Commedia', body.status || 'in_scena', body.publication_status || 'published', body.synopsis, body.posterUrl || '', body.durationMinutes || 120, body.targetAudience || '').run();
    }
    
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
