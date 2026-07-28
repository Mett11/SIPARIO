export async function onRequestGet({ env }: any) {
  try {
    let result = null;
    if (env.DB) {
      result = await env.DB.prepare("SELECT value_json FROM site_config WHERE key = 'main'").first();
    }
    
    let config = {
      name: "Il Sipario",
      city: "Canicattini Bagni",
      address: "Via Test",
      phone: "123",
      email: "test@test.com",
      facebookUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      toneOfVoice: ["Accogliente"]
    };

    if (result && result.value_json) {
      config = JSON.parse(result.value_json);
    }

    return new Response(JSON.stringify({ success: true, data: config }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function onRequestPut({ request, env }: any) {
  try {
    const body = await request.json();
    if (env.DB) {
      // In SQLite, UPSERT is ON CONFLICT DO UPDATE
      await env.DB.prepare(
        "INSERT INTO site_config (id, key, value_json) VALUES ('config-1', 'main', ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json"
      ).bind(JSON.stringify(body)).run();
    }
    return new Response(JSON.stringify({ success: true, data: body }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
