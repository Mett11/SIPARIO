export async function onRequestGet({ request, env, params }: any) {
  const { id } = params;
  try {
    let show = null;
    if (env.DB) {
      show = await env.DB.prepare('SELECT * FROM shows WHERE id = ? OR slug = ?')
        .bind(id, id)
        .first();
    }
    
    if (!show) {
      return new Response(JSON.stringify({ success: false, error: 'Spettacolo non trovato' }), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const data = {
      id: show.id,
      slug: show.slug,
      title: show.title,
      subtitle: show.subtitle,
      author: show.author,
      director: show.director,
      category: show.category,
      status: show.status,
      publication_status: show.publication_status,
      synopsis: show.synopsis,
      posterUrl: show.poster_url,
      durationMinutes: show.duration_minutes,
      targetAudience: show.target_audience,
      validation_status: show.validation_status
    };
    
    return new Response(JSON.stringify({ success: true, data }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function onRequestPut({ request, env, params }: any) {
  const { id } = params;
  try {
    const body = await request.json();
    if (env.DB) {
      await env.DB.prepare('UPDATE shows SET title = ?, subtitle = ?, author = ?, director = ?, category = ?, status = ?, publication_status = ?, synopsis = ?, poster_url = ?, duration_minutes = ?, target_audience = ? WHERE id = ?')
        .bind(body.title, body.subtitle || '', body.author || '', body.director || '', body.category || 'Commedia', body.status || 'in_scena', body.publication_status || 'published', body.synopsis, body.posterUrl || '', body.durationMinutes || 120, body.targetAudience || '', id)
        .run();
    }
    return new Response(JSON.stringify({ success: true, data: { id, ...body } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function onRequestDelete({ request, env, params }: any) {
  const { id } = params;
  try {
    if (env.DB) {
      await env.DB.prepare('DELETE FROM shows WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: 'Eliminato' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
