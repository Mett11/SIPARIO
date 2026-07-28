import { verifyJWT } from '../../utils/jwt';

export async function onRequest({ request, env, next }: any) {
  // Skip middleware for login route itself
  const url = new URL(request.url);
  if (url.pathname.endsWith('/login')) {
    return next();
  }

  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  const tokenFromCookie = match ? match[1] : null;

  const authHeader = request.headers.get('Authorization') || '';
  const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return new Response(JSON.stringify({ success: false, error: 'Non autorizzato' }), { status: 401 });
  }

  const user = await verifyJWT(token, env.ADMIN_SECRET_KEY);
  if (!user) {
    return new Response(JSON.stringify({ success: false, error: 'Sessione scaduta o non valida' }), { status: 401 });
  }

  // Pass user info to the next handlers via context.data
  return next({
    data: { user }
  });
}
