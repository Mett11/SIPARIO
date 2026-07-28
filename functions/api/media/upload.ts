export async function onRequestPost({ request, env }: any) {
  try {
    const body = await request.json();
    const newId = `media-${Date.now()}`;
    
    // In a real scenario, you'd upload the base64 or file data to R2 here
    // and then save the metadata to D1.
    // For this migration, we'll just insert metadata into D1.
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO media_assets (id, filename, file_path, file_size, mime_type, alt_text, r2_key)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newId, body.filename, body.filename, 1024, 'image/jpeg', body.altText || '', `r2/uploads/${body.filename}`
      ).run();
    }
    
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
