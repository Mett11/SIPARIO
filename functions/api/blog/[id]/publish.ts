export async function onRequestPost({ request, env, params }: any) {
  const { id } = params;
  try {
    const { publish } = await request.json();
    const newStatus = publish ? 'published' : 'draft';

    if (env.DB) {
      await env.DB.prepare('UPDATE blog_posts SET status = ? WHERE id = ?')
        .bind(newStatus, id)
        .run();
    }
    
    let updatedPost = null;
    if (env.DB) {
       updatedPost = await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first();
    }

    return new Response(JSON.stringify({ success: true, data: updatedPost || { id, status: newStatus } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
