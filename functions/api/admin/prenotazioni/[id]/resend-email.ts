export async function onRequestPost({ env, params }: any) {
  const { id } = params;
  try {
    // Re-send logic here
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email inviata con successo',
      emailPreview: { subject: 'Reinvio Prenotazione', htmlBody: '<p>Reinvio</p>' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
