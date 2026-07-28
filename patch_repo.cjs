const fs = require('fs');
let code = fs.readFileSync('src/lib/repository.ts', 'utf8');

const loginMethods = `
  async login(email, password) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Login fallito');
    return data.user;
  },

  async logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
  },

  async getMe() {
    const res = await fetch('/api/admin/me');
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error('Non autenticato');
    return data.user;
  },
`;

code = code.replace("export const TheatreRepository = {", "export const TheatreRepository = {\n" + loginMethods);

// Fix getAuthHeaders since we now use cookies
// Wait, we don't need getAuthHeaders to append x-admin-role anymore since it uses cookies!
code = code.replace(/function getAuthHeaders\(role\?: Role\) \{[\s\S]*?\}/, `function getAuthHeaders(role?: Role) {
  return { 'Content-Type': 'application/json' };
}`);

fs.writeFileSync('src/lib/repository.ts', code);
