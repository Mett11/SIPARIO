export async function onRequestPost() {
  const isSecure = false;
  return new Response(JSON.stringify({ success: true, message: 'Logout' }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `admin_session=; HttpOnly; ${isSecure ? 'Secure;' : ''} SameSite=Lax; Path=/; Max-Age=0`
    }
  });
}
