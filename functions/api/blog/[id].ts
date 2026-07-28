export async function onRequestPut({ request, env, params }: any) {
  const { id } = params;
  try {
    const body = await request.json();
    if (env.DB) {
      await env.DB.prepare(`
        UPDATE blog_posts 
        SET title = ?, excerpt = ?, content = ?, cover_url = ?, published_at = ?, category = ?, author = ?
        WHERE id = ?
      `).bind(
        body.title, body.excerpt, body.content, body.coverUrl, body.publishedAt, body.category || 'Notizie', body.author || 'Compagnia Il Sipario', id
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
      await env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: 'Eliminato' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
