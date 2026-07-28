export async function onRequestPut({ request, env, params }: any) {
  const { id } = params;
  try {
    const body = await request.json();
    if (env.DB) {
      await env.DB.prepare(`
        UPDATE company_cast 
        SET name = ?, role = ?, photo_url = ?, bio = ?, shows = ?
        WHERE id = ?
      `).bind(
        body.name, body.role, body.photoUrl || '', body.bio || '', body.shows || '', id
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
      await env.DB.prepare('DELETE FROM company_cast WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: 'Eliminato' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
