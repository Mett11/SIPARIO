const fs = require('fs');
let code = fs.readFileSync('src/lib/repository.ts', 'utf8');

// Use regex to completely replace getAuthHeaders
code = code.replace(/function getAuthHeaders[\s\S]*?export const TheatreRepository = \{/, `function getAuthHeaders(role?: Role) {
  return { 'Content-Type': 'application/json' };
}

export const TheatreRepository = {`);

fs.writeFileSync('src/lib/repository.ts', code);
