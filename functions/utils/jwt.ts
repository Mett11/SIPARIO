// Minimal JWT implementation using Web Crypto API for Cloudflare Workers

function base64url(source: Uint8Array): string {
  let encoded = btoa(String.fromCharCode(...source));
  encoded = encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return encoded;
}

export async function signJWT(payload: any, secret: string, expiresInSeconds: number): Promise<string> {
  const enc = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const encodedHeader = base64url(enc.encode(JSON.stringify(header)));
  const payloadWithExp = { ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
  const encodedPayload = base64url(enc.encode(JSON.stringify(payloadWithExp)));
  
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const encodedSignature = base64url(new Uint8Array(signature));
  
  return `${data}.${encodedSignature}`;
}

export async function verifyJWT(token: string, secret: string): Promise<any | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  
  const enc = new TextEncoder();
  const data = `${parts[0]}.${parts[1]}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  // Convert base64url to Uint8Array for verification
  let signatureB64 = parts[2].replace(/-/g, '+').replace(/_/g, '/');
  while (signatureB64.length % 4) signatureB64 += '=';
  const signatureBytes = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
  
  const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, enc.encode(data));
  if (!isValid) return null;
  
  try {
    let payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payloadB64.length % 4) payloadB64 += '=';
    const payloadJson = atob(payloadB64);
    const payload = JSON.parse(payloadJson);
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}
