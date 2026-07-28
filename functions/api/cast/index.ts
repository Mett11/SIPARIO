export async function onRequestGet({ env }: any) {
  try {
    let result = { results: [] };
    if (env.DB) {
      result = await env.DB.prepare('SELECT * FROM company_cast').all();
    }
    const data = result.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      photoUrl: row.photo_url,
      bio: row.bio,
      shows: row.shows,
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
    const newId = `cast-${Date.now()}`;
    
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO company_cast (id, name, role, photo_url, bio, shows)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        newId, body.name, body.role, body.photoUrl || '', body.bio || '', body.shows || ''
      ).run();
    }
    
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
