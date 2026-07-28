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
    
    return new Response(JSON.stringify({ success: true, data: show }), { 
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
      await env.DB.prepare('UPDATE shows SET title = ?, synopsis = ? WHERE id = ?')
        .bind(body.title, body.synopsis, id)
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
