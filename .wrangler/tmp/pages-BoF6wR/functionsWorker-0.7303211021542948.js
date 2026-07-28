var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/admin/prenotazioni/[id]/check-in.ts
async function onRequestPost({ env, params }) {
  const { id } = params;
  try {
    let booking = null;
    if (env.DB) {
      await env.DB.prepare('UPDATE bookings SET status = "checked_in" WHERE id = ? OR code = ?').bind(id, id).run();
      const row = await env.DB.prepare("SELECT * FROM bookings WHERE id = ? OR code = ?").bind(id, id).first();
      if (row) {
        booking = { id: row.id, status: row.status };
      }
    }
    return new Response(JSON.stringify({ success: true, message: "Check-in effettuato", data: booking }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost, "onRequestPost");

// api/admin/prenotazioni/[id]/resend-email.ts
async function onRequestPost2({ env, params }) {
  const { id } = params;
  try {
    return new Response(JSON.stringify({
      success: true,
      message: "Email inviata con successo",
      emailPreview: { subject: "Reinvio Prenotazione", htmlBody: "<p>Reinvio</p>" }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost2, "onRequestPost");

// api/admin/prenotazioni/[id]/status.ts
async function onRequestPatch({ request, env, params }) {
  const { id } = params;
  try {
    const { status, reason } = await request.json();
    let booking = null;
    if (env.DB) {
      await env.DB.prepare("UPDATE bookings SET status = ? WHERE id = ?").bind(status, id).run();
      const row = await env.DB.prepare("SELECT * FROM bookings WHERE id = ?").bind(id).first();
      if (row) {
        booking = {
          id: row.id,
          code: row.code,
          status: row.status,
          reason
        };
      }
    }
    return new Response(JSON.stringify({ success: true, data: booking }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPatch, "onRequestPatch");

// api/public/performances/[id]/availability.ts
async function onRequestGet({ env, params }) {
  const { id } = params;
  try {
    let performance = null;
    let bookedSeats = 0;
    if (env.DB) {
      performance = await env.DB.prepare("SELECT * FROM performances WHERE id = ?").bind(id).first();
    }
    if (!performance) {
      return new Response(JSON.stringify({ success: false, error: "Replica non trovata" }), { status: 404 });
    }
    const capacityTotal = performance.capacity_total;
    const available = capacityTotal - bookedSeats;
    return new Response(JSON.stringify({
      success: true,
      data: {
        performanceId: id,
        capacityTotal,
        seatsReserved: bookedSeats,
        available,
        status: available > 0 ? "available" : "sold_out"
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet, "onRequestGet");

// api/admin/prenotazioni/export.ts
async function onRequestPost3({ request, env }) {
  try {
    const filters = await request.json();
    return new Response(JSON.stringify({
      success: true,
      filename: "export.csv",
      csvContent: "id,status\n1,confirmed\n",
      count: 1
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost3, "onRequestPost");

// api/admin/prenotazioni/[id].ts
async function onRequestGet2({ env, params }) {
  const { id } = params;
  try {
    let booking = null;
    if (env.DB) {
      const row = await env.DB.prepare("SELECT * FROM bookings WHERE id = ?").bind(id).first();
      if (row) {
        booking = {
          id: row.id,
          code: row.code,
          performanceId: row.performance_id,
          fullName: row.full_name,
          email: row.email,
          phone: row.phone,
          seatsCount: row.seats_count,
          notes: row.notes,
          status: row.status,
          createdAt: row.created_at
        };
      }
    }
    if (!booking) {
      return new Response(JSON.stringify({ success: false, error: "Prenotazione non trovata" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: booking, events: [] }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet2, "onRequestGet");
async function onRequestDelete({ env, params }) {
  const { id } = params;
  try {
    if (env.DB) {
      await env.DB.prepare("DELETE FROM bookings WHERE id = ?").bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: "Eliminata" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestDelete, "onRequestDelete");

// api/blog/[id]/publish.ts
async function onRequestPost4({ request, env, params }) {
  const { id } = params;
  try {
    const { publish } = await request.json();
    const newStatus = publish ? "published" : "draft";
    if (env.DB) {
      await env.DB.prepare("UPDATE blog_posts SET status = ? WHERE id = ?").bind(newStatus, id).run();
    }
    let updatedPost = null;
    if (env.DB) {
      updatedPost = await env.DB.prepare("SELECT * FROM blog_posts WHERE id = ?").bind(id).first();
    }
    return new Response(JSON.stringify({ success: true, data: updatedPost || { id, status: newStatus } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost4, "onRequestPost");

// api/spettacoli/[id]/publish.ts
async function onRequestPost5({ request, env, params }) {
  const { id } = params;
  try {
    const { publish } = await request.json();
    const newStatus = publish ? "published" : "draft";
    if (env.DB) {
      await env.DB.prepare("UPDATE shows SET publication_status = ? WHERE id = ?").bind(newStatus, id).run();
    }
    let updatedShow = null;
    if (env.DB) {
      updatedShow = await env.DB.prepare("SELECT * FROM shows WHERE id = ?").bind(id).first();
    }
    return new Response(JSON.stringify({ success: true, data: updatedShow || { id, publication_status: newStatus } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost5, "onRequestPost");

// api/admin/booking-settings.ts
async function onRequestGet3({ env }) {
  try {
    let settings = {
      isBookingEnabled: true,
      maxSeatsPerBooking: 4,
      requirePhone: true,
      waitlistEnabled: true,
      autoConfirm: false,
      privacyPolicyUrl: "/privacy",
      termsUrl: "/terms"
    };
    return new Response(JSON.stringify({ success: true, data: settings }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet3, "onRequestGet");
async function onRequestPut({ request, env }) {
  try {
    const body = await request.json();
    return new Response(JSON.stringify({ success: true, data: body }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPut, "onRequestPut");

// utils/jwt.ts
function base64url(source) {
  let encoded = btoa(String.fromCharCode(...source));
  encoded = encoded.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return encoded;
}
__name(base64url, "base64url");
async function signJWT(payload, secret, expiresInSeconds) {
  const enc = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(enc.encode(JSON.stringify(header)));
  const payloadWithExp = { ...payload, exp: Math.floor(Date.now() / 1e3) + expiresInSeconds };
  const encodedPayload = base64url(enc.encode(JSON.stringify(payloadWithExp)));
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const encodedSignature = base64url(new Uint8Array(signature));
  return `${data}.${encodedSignature}`;
}
__name(signJWT, "signJWT");
async function verifyJWT(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const enc = new TextEncoder();
  const data = `${parts[0]}.${parts[1]}`;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  let signatureB64 = parts[2].replace(/-/g, "+").replace(/_/g, "/");
  while (signatureB64.length % 4) signatureB64 += "=";
  const signatureBytes = Uint8Array.from(atob(signatureB64), (c) => c.charCodeAt(0));
  const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, enc.encode(data));
  if (!isValid) return null;
  try {
    let payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payloadB64.length % 4) payloadB64 += "=";
    const payloadJson = atob(payloadB64);
    const payload = JSON.parse(payloadJson);
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1e3)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
__name(verifyJWT, "verifyJWT");

// api/admin/login.ts
async function onRequestPost6(context) {
  const { request, env } = context;
  try {
    const { email, password } = await request.json();
    const mockUsers = [
      { id: "usr-admin-1", email: "admin@ilsipario.it", fullName: "Amministratore Sipario", roles: ["admin"] },
      { id: "usr-editor-1", email: "editor@ilsipario.it", fullName: "Elena Guastella (Editor)", roles: ["editor"] },
      { id: "usr-boxoffice-1", email: "boxoffice@ilsipario.it", fullName: "Operatore Biglietteria", roles: ["box_office"] }
    ];
    const user = mockUsers.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
    if (!user || password !== user.roles[0]) {
      return new Response(JSON.stringify({ success: false, error: "Credenziali non valide" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = await signJWT(
      { id: user.id, email: user.email, roles: user.roles, fullName: user.fullName },
      env.ADMIN_SECRET_KEY,
      8 * 60 * 60
      // 8 hours
    );
    const isSecure = new URL(context.request.url).protocol === "https:";
    return new Response(JSON.stringify({ success: true, user, token }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `admin_session=${token}; HttpOnly; ${isSecure ? "Secure;" : ""} SameSite=Lax; Path=/; Max-Age=${8 * 60 * 60}`
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Errore interno" }), { status: 500 });
  }
}
__name(onRequestPost6, "onRequestPost");

// api/admin/logout.ts
async function onRequestPost7() {
  const isSecure = false;
  return new Response(JSON.stringify({ success: true, message: "Logout" }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `admin_session=; HttpOnly; ${isSecure ? "Secure;" : ""} SameSite=Lax; Path=/; Max-Age=0`
    }
  });
}
__name(onRequestPost7, "onRequestPost");

// api/admin/me.ts
async function onRequestGet4(context) {
  return new Response(JSON.stringify({ success: true, data: context.data.user }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(onRequestGet4, "onRequestGet");

// api/admin/prenotazioni.ts
async function onRequestGet5(context) {
  const { request, env, data } = context;
  const url = new URL(context.request.url);
  const performanceId = url.searchParams.get("performanceId");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search");
  let query = "SELECT * FROM bookings WHERE 1=1";
  const params = [];
  if (performanceId && performanceId !== "all") {
    query += " AND performance_id = ?";
    params.push(performanceId);
  }
  if (status && status !== "all") {
    query += " AND status = ?";
    params.push(status);
  }
  if (search) {
    const q = `%${search.toLowerCase()}%`;
    query += " AND (LOWER(code) LIKE ? OR LOWER(full_name) LIKE ? OR LOWER(email) LIKE ? OR phone LIKE ?)";
    params.push(q, q, q, q);
  }
  try {
    let result = { results: [] };
    if (env.DB) {
      const stmt = env.DB.prepare(query);
      result = await stmt.bind(...params).all();
    }
    const data2 = result.results.map((row) => ({
      id: row.id,
      code: row.code,
      performanceId: row.performance_id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      seatsCount: row.seats_count,
      notes: row.notes,
      status: row.status,
      createdAt: row.created_at
    }));
    return new Response(JSON.stringify({
      success: true,
      data: data2,
      metrics: {
        totalBookings: data2.length
        // compute other metrics based on result...
      }
    }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet5, "onRequestGet");

// api/media/upload.ts
async function onRequestPost8({ request, env }) {
  try {
    const body = await request.json();
    const newId = `media-${Date.now()}`;
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO media_assets (id, filename, file_path, file_size, mime_type, alt_text, r2_key)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newId,
        body.filename,
        body.filename,
        1024,
        "image/jpeg",
        body.altText || "",
        `r2/uploads/${body.filename}`
      ).run();
    }
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost8, "onRequestPost");

// api/blog/[id].ts
async function onRequestPut2({ request, env, params }) {
  const { id } = params;
  try {
    const body = await request.json();
    if (env.DB) {
      await env.DB.prepare(`
        UPDATE blog_posts 
        SET title = ?, excerpt = ?, content = ?, cover_url = ?, published_at = ?, category = ?, author = ?
        WHERE id = ?
      `).bind(
        body.title,
        body.excerpt,
        body.content,
        body.coverUrl,
        body.publishedAt,
        body.category || "Notizie",
        body.author || "Compagnia Il Sipario",
        id
      ).run();
    }
    return new Response(JSON.stringify({ success: true, data: { id, ...body } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPut2, "onRequestPut");
async function onRequestDelete2({ env, params }) {
  const { id } = params;
  try {
    if (env.DB) {
      await env.DB.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: "Eliminato" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestDelete2, "onRequestDelete");

// api/cast/[id].ts
async function onRequestPut3({ request, env, params }) {
  const { id } = params;
  try {
    const body = await request.json();
    if (env.DB) {
      await env.DB.prepare(`
        UPDATE company_cast 
        SET name = ?, role = ?, photo_url = ?, bio = ?, shows = ?
        WHERE id = ?
      `).bind(
        body.name,
        body.role,
        body.photoUrl || "",
        body.bio || "",
        body.shows || "",
        id
      ).run();
    }
    return new Response(JSON.stringify({ success: true, data: { id, ...body } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPut3, "onRequestPut");
async function onRequestDelete3({ env, params }) {
  const { id } = params;
  try {
    if (env.DB) {
      await env.DB.prepare("DELETE FROM company_cast WHERE id = ?").bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: "Eliminato" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestDelete3, "onRequestDelete");

// api/media/[id].ts
async function onRequestDelete4({ env, params }) {
  const { id } = params;
  try {
    if (env.DB) {
      await env.DB.prepare("DELETE FROM media_assets WHERE id = ?").bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: "Eliminato" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestDelete4, "onRequestDelete");

// api/performances/[id].ts
async function onRequestPut4({ request, env, params }) {
  const { id } = params;
  try {
    const body = await request.json();
    if (env.DB) {
      await env.DB.prepare(`
        UPDATE performances 
        SET show_id = ?, date_time = ?, venue_name = ?, venue_address = ?, capacity_total = ?, 
            booking_open_at = ?, booking_close_at = ?, ticket_price_display = ?, instructions = ?
        WHERE id = ?
      `).bind(
        body.showId,
        body.dateTime,
        body.venueName,
        body.venueAddress,
        body.capacityTotal,
        body.bookingOpenAt,
        body.bookingCloseAt,
        body.ticketPriceDisplay || "",
        body.instructions || "",
        id
      ).run();
    }
    return new Response(JSON.stringify({ success: true, data: { id, ...body } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPut4, "onRequestPut");
async function onRequestDelete5({ env, params }) {
  const { id } = params;
  try {
    if (env.DB) {
      await env.DB.prepare("DELETE FROM performances WHERE id = ?").bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: "Eliminato" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestDelete5, "onRequestDelete");

// api/spettacoli/[id].ts
async function onRequestGet6({ request, env, params }) {
  const { id } = params;
  try {
    let show = null;
    if (env.DB) {
      show = await env.DB.prepare("SELECT * FROM shows WHERE id = ? OR slug = ?").bind(id, id).first();
    }
    if (!show) {
      return new Response(JSON.stringify({ success: false, error: "Spettacolo non trovato" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
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
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet6, "onRequestGet");
async function onRequestPut5({ request, env, params }) {
  const { id } = params;
  try {
    const body = await request.json();
    if (env.DB) {
      await env.DB.prepare("UPDATE shows SET title = ?, subtitle = ?, author = ?, director = ?, category = ?, status = ?, publication_status = ?, synopsis = ?, poster_url = ?, duration_minutes = ?, target_audience = ? WHERE id = ?").bind(body.title, body.subtitle || "", body.author || "", body.director || "", body.category || "Commedia", body.status || "in_scena", body.publication_status || "published", body.synopsis, body.posterUrl || "", body.durationMinutes || 120, body.targetAudience || "", id).run();
    }
    return new Response(JSON.stringify({ success: true, data: { id, ...body } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPut5, "onRequestPut");
async function onRequestDelete6({ request, env, params }) {
  const { id } = params;
  try {
    if (env.DB) {
      await env.DB.prepare("DELETE FROM shows WHERE id = ?").bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: "Eliminato" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestDelete6, "onRequestDelete");

// api/audit-logs/index.ts
async function onRequestGet7({ env }) {
  try {
    let result = { results: [] };
    if (env.DB) {
      result = await env.DB.prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100").all();
    }
    return new Response(JSON.stringify({ success: true, data: result.results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet7, "onRequestGet");

// api/blog/index.ts
async function onRequestGet8({ env }) {
  try {
    let result = { results: [] };
    if (env.DB) {
      result = await env.DB.prepare("SELECT * FROM blog_posts").all();
    }
    const data = result.results.map((row) => ({
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
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet8, "onRequestGet");
async function onRequestPost9({ request, env }) {
  try {
    const body = await request.json();
    const newId = `post-${Date.now()}`;
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO blog_posts (id, slug, title, excerpt, content, cover_url, published_at, category, author)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newId,
        body.slug,
        body.title,
        body.excerpt,
        body.content,
        body.coverUrl,
        body.publishedAt,
        body.category || "Notizie",
        body.author || "Compagnia Il Sipario"
      ).run();
    }
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost9, "onRequestPost");

// api/cast/index.ts
async function onRequestGet9({ env }) {
  try {
    let result = { results: [] };
    if (env.DB) {
      result = await env.DB.prepare("SELECT * FROM company_cast").all();
    }
    const data = result.results.map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      photoUrl: row.photo_url,
      bio: row.bio,
      shows: row.shows
    }));
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet9, "onRequestGet");
async function onRequestPost10({ request, env }) {
  try {
    const body = await request.json();
    const newId = `cast-${Date.now()}`;
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO company_cast (id, name, role, photo_url, bio, shows)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        newId,
        body.name,
        body.role,
        body.photoUrl || "",
        body.bio || "",
        body.shows || ""
      ).run();
    }
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost10, "onRequestPost");

// api/media/index.ts
async function onRequestGet10({ env }) {
  try {
    let result = { results: [] };
    if (env.DB) {
      result = await env.DB.prepare("SELECT * FROM media_assets").all();
    }
    return new Response(JSON.stringify({ success: true, data: result.results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet10, "onRequestGet");

// api/performances/index.ts
async function onRequestGet11({ env }) {
  try {
    let result = { results: [] };
    if (env.DB) {
      result = await env.DB.prepare("SELECT * FROM performances").all();
    }
    const data = result.results.map((row) => ({
      id: row.id,
      showId: row.show_id,
      dateTime: row.date_time,
      venueName: row.venue_name,
      venueAddress: row.venue_address,
      capacityTotal: row.capacity_total,
      seatsReserved: row.seats_reserved,
      bookingOpenAt: row.booking_open_at,
      bookingCloseAt: row.booking_close_at,
      bookingStatus: row.booking_status,
      seatingMode: row.seating_mode,
      ticketPriceDisplay: row.ticket_price_display,
      instructions: row.instructions
    }));
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet11, "onRequestGet");
async function onRequestPost11({ request, env }) {
  try {
    const body = await request.json();
    const newId = `perf-${Date.now()}`;
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO performances 
        (id, show_id, date_time, venue_name, venue_address, capacity_total, booking_open_at, booking_close_at, ticket_price_display, instructions) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newId,
        body.showId,
        body.dateTime,
        body.venueName,
        body.venueAddress,
        body.capacityTotal,
        body.bookingOpenAt,
        body.bookingCloseAt,
        body.ticketPriceDisplay || "",
        body.instructions || ""
      ).run();
    }
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost11, "onRequestPost");

// ../src/lib/emailTemplates.ts
function generateBookingEmail(type, booking, venueInfo) {
  const showTitle = booking.showTitle || "Spettacolo Teatrale";
  const perfDateStr = new Date(booking.performanceDateTime).toLocaleString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const venueName = venueInfo?.name || "Teatro Comunale G. Verdi";
  const venueAddress = venueInfo?.address || "Canicattini Bagni (SR)";
  const brandHeader = `
    <div style="background-color: #1A0505; padding: 24px; text-align: center; border-bottom: 3px solid #FFFFFF;">
      <h1 style="color: #FFFFFF; font-family: Georgia, serif; margin: 0; font-size: 24px;">Compagnia Teatrale Il Sipario A.P.S.</h1>
      <p style="color: #FFFFFF; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Canicattini Bagni (SR)</p>
    </div>
  `;
  const brandFooter = `
    <div style="background-color: #050505; color: #FFFFFF; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #FFFFFF; margin-top: 30px;">
      <p style="margin: 0 0 6px 0; color: #FFFFFF; font-weight: bold;">Compagnia Teatrale Il Sipario A.P.S.</p>
      <p style="margin: 0 0 6px 0;">Via Antonino Uccello 6, 96010 Canicattini Bagni (SR) | Tel: +39 339 492 3772</p>
      <p style="margin: 0; color: #888;">Associazione di Promozione Sociale - Nessun pagamento richiesto online.</p>
    </div>
  `;
  if (type === "CONFIRMED") {
    return {
      subject: `[Il Sipario] Conferma Prenotazione: ${booking.code} - ${showTitle}`,
      textBody: `Gentile ${booking.fullName},

La tua prenotazione per lo spettacolo "${showTitle}" \xE8 CONFERMATA!

Codice Prenotazione: ${booking.code}
Posti Riservati: ${booking.seatsCount}
Data e Ora: ${perfDateStr}
Luogo: ${venueName} (${venueAddress})

Istruzioni per il ritiro:
Presentati alla cassa del teatro almeno 20 minuti prima dell'inizio dello spettacolo esibendo il codice ${booking.code}. Il saldo avverr\xE0 direttamente in cassa.

Grazie per sostenere il teatro amatoriale!`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f6f0; padding: 20px; color: #1a1a1a;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2d9c8;">
            ${brandHeader}
            <div style="padding: 30px;">
              <div style="background-color: #e6f4ea; border: 1px solid #34a853; color: #137333; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
                \u2713 PRENOTAZIONE CONFERMATA CON SUCCESS
              </div>
              <p>Gentile <strong>${booking.fullName}</strong>,</p>
              <p>siamo lieti di confermare la tua prenotazione per la replica teatrale:</p>
              
              <div style="background: #faf8f5; border-left: 4px solid #FFFFFF; padding: 16px; margin: 20px 0;">
                <h2 style="margin: 0 0 8px 0; font-family: Georgia, serif; color: #1A0505;">${showTitle}</h2>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Codice Prenotazione:</strong> <span style="font-family: monospace; font-size: 18px; color: #E60000; background: #f0e6d2; padding: 2px 8px; border-radius: 4px;">${booking.code}</span></p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Posti Riservati:</strong> ${booking.seatsCount} Posti</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Data e Ora:</strong> ${perfDateStr}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Luogo:</strong> ${venueName} - ${venueAddress}</p>
              </div>

              <div style="background: #fff8e1; border: 1px solid #ffe082; padding: 14px; border-radius: 6px; font-size: 13px; color: #5d4037; margin-bottom: 20px;">
                <strong>\u{1F4CD} Indicazioni e Pagamento in Cassa:</strong><br/>
                Non \xE8 stato effettuato alcun addebito online. Ti preghiamo di presentarti alla cassa del teatro almeno <strong>20 minuti prima</strong> dell'orario d'inizio per confermare la presenza e ritirare i tagliandi.
              </div>

              <p style="font-size: 13px; color: #666;">In caso di imprevisti o impossibilit\xE0 a partecipare, ti chiediamo cortesemente di contattarci al 339 492 3772 o via email per liberare i posti.</p>
            </div>
            ${brandFooter}
          </div>
        </div>
      `
    };
  }
  if (type === "WAITLIST") {
    return {
      subject: `[Il Sipario] Inserimento in Lista d'Attesa: ${booking.code} - ${showTitle}`,
      textBody: `Gentile ${booking.fullName},

La tua richiesta per lo spettacolo "${showTitle}" \xE8 stata inserita in LISTA D'ATTESA.

Codice Pratica: ${booking.code}
Posti Richiesti: ${booking.seatsCount}
Data: ${perfDateStr}

La capienza ordinaria della sala \xE8 attualmente esaurita. Qualora si liberassero posti a seguito di rinunce, verrai contattato tempestivamente dal nostro box office.

Cordiali saluti,
Compagnia Teatrale Il Sipario`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f6f0; padding: 20px; color: #1a1a1a;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2d9c8;">
            ${brandHeader}
            <div style="padding: 30px;">
              <div style="background-color: #fef7e0; border: 1px solid #f9ab00; color: #b06000; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
                \u23F3 INSERITO IN LISTA D'ATTESA
              </div>
              <p>Gentile <strong>${booking.fullName}</strong>,</p>
              <p>la tua richiesta di prenotazione per lo spettacolo <strong>${showTitle}</strong> (${perfDateStr}) \xE8 stata inserita nella <strong>Lista d'Attesa</strong> del nostro teatro.</p>
              
              <div style="background: #faf8f5; border-left: 4px solid #f9ab00; padding: 16px; margin: 20px 0;">
                <p style="margin: 4px 0; font-size: 14px;"><strong>Codice Pratica:</strong> <span style="font-family: monospace; font-size: 16px;">${booking.code}</span></p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Posti Richiesti:</strong> ${booking.seatsCount}</p>
              </div>

              <p style="font-size: 14px; line-height: 1.6;">I posti disponibili in sala sono temporaneamente esauriti. In caso di disdette o ampliamento della platea, sarai contattato telefonicamente o via email per la conferma immediata.</p>
            </div>
            ${brandFooter}
          </div>
        </div>
      `
    };
  }
  if (type === "CANCELLED") {
    return {
      subject: `[Il Sipario] Annullamento Prenotazione: ${booking.code} - ${showTitle}`,
      textBody: `Gentile ${booking.fullName},

Ti confermiamo l'ANNULLAMENTO della tua prenotazione (Codice: ${booking.code}) per lo spettacolo "${showTitle}" in data ${perfDateStr}.

I posti riservati sono stati riaffidati alla disponibilit\xE0 della compagnia.

Speriamo di vederti presto al prossimo appuntamento teatrale!`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f6f0; padding: 20px; color: #1a1a1a;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2d9c8;">
            ${brandHeader}
            <div style="padding: 30px;">
              <div style="background-color: #fce8e6; border: 1px solid #d93025; color: #a50e0e; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
                \u2715 PRENOTAZIONE ANNULLATA
              </div>
              <p>Gentile <strong>${booking.fullName}</strong>,</p>
              <p>ti informiamo che la prenotazione <strong>${booking.code}</strong> per lo spettacolo <strong>${showTitle}</strong> del ${perfDateStr} \xE8 stata cancellata.</p>
              <p style="font-size: 13px; color: #666; margin-top: 15px;">Se l'annullamento \xE8 avvenuto per errore o desideri maggiori informazioni, ti invitiamo a contattare la biglietteria.</p>
            </div>
            ${brandFooter}
          </div>
        </div>
      `
    };
  }
  return {
    subject: `[Il Sipario] Promemoria Spettacolo: ${showTitle} - Codice ${booking.code}`,
    textBody: `Gentile ${booking.fullName},

Ti ricordiamo che ti aspettiamo a teatro per lo spettacolo "${showTitle}"!

Data e Ora: ${perfDateStr}
Luogo: ${venueName} (${venueAddress})
Codice Prenotazione: ${booking.code}
Posti: ${booking.seatsCount}

Ricordati di presentarti in cassa almeno 20 minuti prima dello spettacolo.

A presto!`,
    htmlBody: `
      <div style="font-family: Arial, sans-serif; background-color: #f8f6f0; padding: 20px; color: #1a1a1a;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2d9c8;">
          ${brandHeader}
          <div style="padding: 30px;">
            <div style="background-color: #e8f0fe; border: 1px solid #1a73e8; color: #174ea6; padding: 12px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
              \u{1F514} PROMEMORIA SPETTACOLO TEATRALE
            </div>
            <p>Gentile <strong>${booking.fullName}</strong>,</p>
            <p>mancano pochi giorni allo spettacolo teatrale <strong>${showTitle}</strong>!</p>
            
            <div style="background: #faf8f5; border-left: 4px solid #1a73e8; padding: 16px; margin: 20px 0;">
              <p style="margin: 4px 0; font-size: 14px;"><strong>Codice Prenotazione:</strong> <span style="font-family: monospace; font-size: 18px; color: #E60000;">${booking.code}</span></p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Data e Ora:</strong> ${perfDateStr}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Luogo:</strong> ${venueName} (${venueAddress})</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Posti Riservati:</strong> ${booking.seatsCount}</p>
            </div>

            <p style="font-size: 13px; color: #555;">Ti ricordiamo di presentarti presso la cassa del teatro 20 minuti prima dell'inizio esibendo il codice per ritirare i tuoi tagliandi.</p>
          </div>
          ${brandFooter}
        </div>
      </div>
    `
  };
}
__name(generateBookingEmail, "generateBookingEmail");

// api/prenota.ts
async function onRequestPost12({ request, env }) {
  try {
    const body = await request.json();
    const { turnstileToken, honeypot, email, fullName, phone, seatsCount, performanceId, notes } = body;
    if (honeypot && String(honeypot).trim() !== "") {
      return new Response(JSON.stringify({ success: false, error: "Spam rilevato" }), { status: 400 });
    }
    if (!turnstileToken) {
      return new Response(JSON.stringify({ success: false, error: "Validazione di sicurezza mancante." }), { status: 400 });
    }
    const tsSecret = env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (tsSecret && tsSecret !== "1x0000000000000000000000000000000AA") {
      const tsResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: tsSecret,
          response: turnstileToken,
          remoteip: request.headers.get("CF-Connecting-IP")
        })
      });
      const tsOutcome = await tsResponse.json();
      if (!tsOutcome.success) {
        return new Response(JSON.stringify({ success: false, error: "Validazione anti-spam fallita." }), { status: 400 });
      }
    }
    let assignedStatus = "confirmed";
    let isWaitlisted = false;
    let performance = { title: "Spettacolo Teatrale", venueName: "Teatro", venueAddress: "Indirizzo" };
    const bookingCode = `SIP-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO bookings (id, code, performance_id, full_name, email, phone, seats_count, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        `book-${Date.now()}`,
        bookingCode,
        performanceId,
        fullName,
        email,
        phone,
        seatsCount,
        notes || "",
        assignedStatus
      ).run();
    }
    const newBooking = {
      code: bookingCode,
      performanceId,
      fullName,
      email,
      phone,
      seatsCount,
      status: assignedStatus
    };
    const resendApiKey = env.RESEND_API_KEY;
    let emailPreview = null;
    const emailPayload = generateBookingEmail(
      isWaitlisted ? "WAITLIST" : "CONFIRMED",
      newBooking,
      { name: performance.venueName, address: performance.venueAddress }
    );
    if (resendApiKey && resendApiKey.startsWith("re_")) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Il Sipario <prenotazioni@ilsipario.it>",
          to: [email],
          subject: emailPayload.subject,
          html: emailPayload.htmlBody
        })
      });
      if (!resendResponse.ok) {
        console.error("Errore invio Resend:", await resendResponse.text());
      }
    } else {
      emailPreview = emailPayload;
    }
    return new Response(JSON.stringify({
      success: true,
      data: newBooking,
      emailPreview
    }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost12, "onRequestPost");

// api/site-config/index.ts
async function onRequestGet12({ env }) {
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
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet12, "onRequestGet");
async function onRequestPut6({ request, env }) {
  try {
    const body = await request.json();
    if (env.DB) {
      await env.DB.prepare(
        "INSERT INTO site_config (id, key, value_json) VALUES ('config-1', 'main', ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json"
      ).bind(JSON.stringify(body)).run();
    }
    return new Response(JSON.stringify({ success: true, data: body }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPut6, "onRequestPut");

// api/spettacoli/index.ts
async function onRequestGet13(context) {
  const { request, env } = context;
  const url = new URL(context.request.url);
  const status = url.searchParams.get("status");
  const publication_status = url.searchParams.get("publication_status");
  let query = "SELECT * FROM shows WHERE 1=1";
  const params = [];
  if (status) {
    query += " AND status = ?";
    params.push(status);
  }
  if (publication_status) {
    query += " AND publication_status = ?";
    params.push(publication_status);
  }
  try {
    let result = { results: [] };
    if (env.DB) {
      const stmt = env.DB.prepare(query);
      result = await stmt.bind(...params).all();
    }
    const data = result.results.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      author: row.author,
      director: row.director,
      category: row.category,
      status: row.status,
      publication_status: row.publication_status,
      synopsis: row.synopsis,
      posterUrl: row.poster_url,
      durationMinutes: row.duration_minutes,
      targetAudience: row.target_audience,
      validation_status: row.validation_status
    }));
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestGet13, "onRequestGet");
async function onRequestPost13(context) {
  const { request, env, data } = context;
  try {
    const body = await request.json();
    const newId = `show-${Date.now()}`;
    if (env.DB) {
      await env.DB.prepare(
        "INSERT INTO shows (id, slug, title, subtitle, author, director, category, status, publication_status, synopsis, poster_url, duration_minutes, target_audience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(newId, body.slug, body.title, body.subtitle || "", body.author || "", body.director || "", body.category || "Commedia", body.status || "in_scena", body.publication_status || "published", body.synopsis, body.posterUrl || "", body.durationMinutes || 120, body.targetAudience || "").run();
    }
    return new Response(JSON.stringify({ success: true, data: { ...body, id: newId } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
__name(onRequestPost13, "onRequestPost");

// api/admin/_middleware.ts
async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(context.request.url);
  if (url.pathname.endsWith("/login")) {
    return next();
  }
  const cookieHeader = request.headers.get("Cookie") || "";
  const match2 = cookieHeader.match(/admin_session=([^;]+)/);
  const tokenFromCookie = match2 ? match2[1] : null;
  const authHeader = request.headers.get("Authorization") || "";
  const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = tokenFromCookie || tokenFromHeader;
  if (!token) {
    return new Response(JSON.stringify({ success: false, error: "Non autorizzato" }), { status: 401 });
  }
  const user = await verifyJWT(token, env.ADMIN_SECRET_KEY);
  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "Sessione scaduta o non valida" }), { status: 401 });
  }
  context.data.user = user;
  return next();
}
__name(onRequest, "onRequest");

// ../.wrangler/tmp/pages-BoF6wR/functionsRoutes-0.6875412304371518.mjs
var routes = [
  {
    routePath: "/api/admin/prenotazioni/:id/check-in",
    mountPath: "/api/admin/prenotazioni/:id",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/admin/prenotazioni/:id/resend-email",
    mountPath: "/api/admin/prenotazioni/:id",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/admin/prenotazioni/:id/status",
    mountPath: "/api/admin/prenotazioni/:id",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch]
  },
  {
    routePath: "/api/public/performances/:id/availability",
    mountPath: "/api/public/performances/:id",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/admin/prenotazioni/export",
    mountPath: "/api/admin/prenotazioni",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/admin/prenotazioni/:id",
    mountPath: "/api/admin/prenotazioni",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/admin/prenotazioni/:id",
    mountPath: "/api/admin/prenotazioni",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/blog/:id/publish",
    mountPath: "/api/blog/:id",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/spettacoli/:id/publish",
    mountPath: "/api/spettacoli/:id",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/admin/booking-settings",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/admin/booking-settings",
    mountPath: "/api/admin",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/admin/login",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/admin/logout",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/admin/me",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/admin/prenotazioni",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/media/upload",
    mountPath: "/api/media",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost8]
  },
  {
    routePath: "/api/blog/:id",
    mountPath: "/api/blog",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/blog/:id",
    mountPath: "/api/blog",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut2]
  },
  {
    routePath: "/api/cast/:id",
    mountPath: "/api/cast",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete3]
  },
  {
    routePath: "/api/cast/:id",
    mountPath: "/api/cast",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut3]
  },
  {
    routePath: "/api/media/:id",
    mountPath: "/api/media",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete4]
  },
  {
    routePath: "/api/performances/:id",
    mountPath: "/api/performances",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete5]
  },
  {
    routePath: "/api/performances/:id",
    mountPath: "/api/performances",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut4]
  },
  {
    routePath: "/api/spettacoli/:id",
    mountPath: "/api/spettacoli",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete6]
  },
  {
    routePath: "/api/spettacoli/:id",
    mountPath: "/api/spettacoli",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/spettacoli/:id",
    mountPath: "/api/spettacoli",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut5]
  },
  {
    routePath: "/api/audit-logs",
    mountPath: "/api/audit-logs",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/blog",
    mountPath: "/api/blog",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/api/blog",
    mountPath: "/api/blog",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost9]
  },
  {
    routePath: "/api/cast",
    mountPath: "/api/cast",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet9]
  },
  {
    routePath: "/api/cast",
    mountPath: "/api/cast",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost10]
  },
  {
    routePath: "/api/media",
    mountPath: "/api/media",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet10]
  },
  {
    routePath: "/api/performances",
    mountPath: "/api/performances",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet11]
  },
  {
    routePath: "/api/performances",
    mountPath: "/api/performances",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost11]
  },
  {
    routePath: "/api/prenota",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost12]
  },
  {
    routePath: "/api/site-config",
    mountPath: "/api/site-config",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet12]
  },
  {
    routePath: "/api/site-config",
    mountPath: "/api/site-config",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut6]
  },
  {
    routePath: "/api/spettacoli",
    mountPath: "/api/spettacoli",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet13]
  },
  {
    routePath: "/api/spettacoli",
    mountPath: "/api/spettacoli",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost13]
  },
  {
    routePath: "/api/admin",
    mountPath: "/api/admin",
    method: "",
    middlewares: [onRequest],
    modules: []
  }
];

// ../node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
