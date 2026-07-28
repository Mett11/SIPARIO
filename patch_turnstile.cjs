const fs = require('fs');
let code = fs.readFileSync('src/pages/PrenotaPage.tsx', 'utf8');

const importTurnstile = `import { Turnstile } from '@marsidev/react-turnstile';\n`;
code = code.replace("import React, { useEffect, useState } from 'react';", "import React, { useEffect, useState } from 'react';\n" + importTurnstile);

// Add turnstile state
code = code.replace("  const [marketingConsented, setMarketingConsented] = useState(false);", "  const [marketingConsented, setMarketingConsented] = useState(false);\n  const [turnstileToken, setTurnstileToken] = useState<string>('');");

// Update handleBook to pass the token
code = code.replace("privacyConsented,", "privacyConsented,\n        turnstileToken,");

// Update the TSX
code = code.replace(/<div className="pt-2 flex items-center justify-between text-\[10px\] text-\[#FFFFFF\]">[\s\S]*?<\/div>/, `<div className="pt-2">
              <Turnstile 
                siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                onSuccess={(token) => setTurnstileToken(token)}
                options={{ theme: 'dark', size: 'normal' }}
              />
            </div>`);

// Also we need to make sure the submit button is disabled if token is empty
code = code.replace(/disabled=\{isSubmitting \|\| !privacyConsented\}/, "disabled={isSubmitting || !privacyConsented || !turnstileToken}");

fs.writeFileSync('src/pages/PrenotaPage.tsx', code);
