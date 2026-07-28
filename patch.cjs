const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importCookie = `import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';\n`;

code = code.replace("import express, { Request, Response, NextFunction } from 'express';", "import express, { Request, Response, NextFunction } from 'express';\n" + importCookie);

const jwtSecretStr = `
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'sipario_admin_secret_key_2026';
`;
code = code.replace("const app = express.Router();", "const app = express.Router();\n" + jwtSecretStr);


const mockUsersStr = `  roles: Array<'admin' | 'editor' | 'box_office'>;
}> = [
  { id: 'usr-admin-1', email: 'admin@ilsipario.it', fullName: 'Amministratore Sipario', roles: ['admin'] },
  { id: 'usr-editor-1', email: 'editor@ilsipario.it', fullName: 'Elena Guastella (Editor)', roles: ['editor'] },
  { id: 'usr-boxoffice-1', email: 'boxoffice@ilsipario.it', fullName: 'Operatore Biglietteria', roles: ['box_office'] },
];

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  // Simple hardcoded password check for prototype
  const user = mockUsers.find((u) => u.email === email);
  if (!user || password !== user.roles[0]) {
    return res.status(401).json({ success: false, error: 'Credenziali non valide' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, roles: user.roles, fullName: user.fullName },
    ADMIN_SECRET_KEY,
    { expiresIn: '8h' }
  );

  res.cookie('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  });

  res.json({ success: true, user });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_session');
  res.json({ success: true });
});

app.get('/api/admin/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, user: req.user });
});
`;

code = code.replace(/  roles: Array<'admin' \| 'editor' \| 'box_office'>;\s*}> = \[[\s\S]*?\];/, mockUsersStr);

const authMiddlewareStr = `function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies.admin_session;
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Non autorizzato. Effettua il login.' });
  }

  try {
    const decoded = jwt.verify(token, ADMIN_SECRET_KEY) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
      roles: decoded.roles,
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Sessione scaduta o non valida.' });
  }
}`;

code = code.replace(/function authMiddleware\([\s\S]*?next\(\);\n}/, authMiddlewareStr);

code = code.replace("appExpress.use(express.json({ limit: '10mb' }));", "appExpress.use(express.json({ limit: '10mb' }));\n  appExpress.use(cookieParser());");

fs.writeFileSync('server.ts', code);
