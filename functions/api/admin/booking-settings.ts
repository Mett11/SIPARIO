export async function onRequestGet({ env }: any) {
  try {
    let settings = {
      isBookingEnabled: true,
      maxSeatsPerBooking: 4,
      requirePhone: true,
      waitlistEnabled: true,
      autoConfirm: false,
      privacyPolicyUrl: '/privacy',
      termsUrl: '/terms'
    };
    
    // In a real scenario read from DB site_config
    
    return new Response(JSON.stringify({ success: true, data: settings }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function onRequestPut({ request, env }: any) {
  try {
    const body = await request.json();
    
    // Logic to save
    
    return new Response(JSON.stringify({ success: true, data: body }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
