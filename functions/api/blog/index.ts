export async function onRequestGet({ env }: any) {
  try {
    let result = { results: [] };
    if (env.DB) {
      result = await env.DB.prepare('SELECT * FROM blog_posts').all();
    }
    const data = result.results.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      coverUrl: row.cover_url,
      category: row.category,
      publishedAt: row.published_at,
      author: row.author,
      status: row.status,
      validationStatus: row.validation_status
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
    const newId = `post-${Date.now()}`;
    
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO blog_posts (id, slug, title, excerpt, content, cover_url, published_at, category, author)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newId, body.slug, body.title, body.excerpt, body.content, body.coverUrl, body.publishedAt, body.category || 'Notizie', body.author || 'Compagnia Il Sipario'
      ).run();
    }
    
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
