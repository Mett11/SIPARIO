export async function onRequestPost({ request, env, params }: any) {
  const { id } = params;
  try {
    const { publish } = await request.json();
    const newStatus = publish ? 'published' : 'draft';

    if (env.DB) {
      await env.DB.prepare('UPDATE shows SET publication_status = ? WHERE id = ?')
        .bind(newStatus, id)
        .run();
    }
    
    // Fetch updated show
    let updatedShow = null;
    if (env.DB) {
       updatedShow = await env.DB.prepare('SELECT * FROM shows WHERE id = ?').bind(id).first();
    }

    return new Response(JSON.stringify({ success: true, data: updatedShow || { id, publication_status: newStatus } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
