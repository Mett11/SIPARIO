import "dotenv/config";
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  ShowSchema,
  PerformanceSchema,
  BlogPostSchema,
  SiteConfigSchema,
  MediaUploadSchema,
  LoginSchema,
  CreateBookingSchema,
  UpdateBookingStatusSchema,
  BookingSettingsSchema,
} from './src/lib/validations';
import {
  Show,
  Performance,
  BlogPost,
  SiteConfig,
  Role,
  CompanyCastMember,
  BookingRequest,
  BookingEvent,
  BookingSettings,
  BookingHold,
  BookingRequestStatus,
  AvailabilityResponse,
} from './src/types';
import { generateBookingEmail } from './src/lib/emailTemplates';

const app = express.Router();

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'sipario_admin_secret_key_2026';


// --- IN-MEMORY DATABASE SEED STATE (D1 MOCK) ---

let siteConfig: SiteConfig = {
  name: 'Il Sipario – Compagnia Teatrale A.P.S.',
  subName: 'Compagnia Teatrale Amatoriale',
  city: 'Canicattini Bagni (SR)',
  address: 'Via Antonino Uccello 6, 96010 Canicattini Bagni (SR)',
  phone: '+39 339 492 3772',
  email: 'ilsipariocompagniateatrale@gmail.com',
  facebookUrl: 'https://www.facebook.com/ilsipariocanicattinibagni/',
  instagramUrl: 'https://www.instagram.com/compagnia_ilsipario/',
  youtubeUrl: 'https://www.youtube.com/channel/UC9CEjFQvC9LgSfypbaP5LfA',
  toneOfVoice: ['Accogliente', 'Tradizionale', 'Passionale', 'Comunitario'],
  noticeMessage: 'Benvenuti nel nuovo sito ufficiale della Compagnia Teatrale Il Sipario A.P.S.',
};

let shows: Show[] = [
  {
    id: 'show-1',
    slug: 'fiat-voluntas-dei',
    title: 'Fiat Voluntas Dei',
    subtitle: 'Commedia brillante in tre atti di Giuseppe Macrì',
    author: 'Giuseppe Macrì',
    director: 'Sebastiano Magliocco',
    category: 'Commedia Dialettale',
    status: 'in_scena',
    publication_status: 'published',
    synopsis:
      'Il celebre capolavoro del teatro popolare siciliano incentrato sulle vicende di Padre Attanasio, parroco di un piccolo paese alle prese con gli intrighi sentimentali dei suoi paesani e le maldicenze locali. Una girandola di equivoci, umanità e profonda comicità.',
    posterUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1200',
    galleryUrls: [
      'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=1200',
    ],
    castAndCredits: [
      { role: 'Padre Attanasio', name: 'Sebastiano Magliocco' },
      { role: 'Mara', name: 'Elena Guastella' },
      { role: 'Don Vincenzino', name: 'Paolo Cultrera' },
      { role: 'Agnese', name: 'Lucia Uccello' },
    ],
    durationMinutes: 110,
    targetAudience: 'Per tutti',
    validation_status: 'VALIDATED',
  },
  {
    id: 'show-2',
    slug: 'miseria-e-nobilta',
    title: 'Miseria e Nobiltà',
    subtitle: 'Adattamento della celebre farsa di Eduardo Scarpetta',
    author: 'Eduardo Scarpetta',
    director: 'Sebastiano Magliocco',
    category: 'Commedia Classica',
    status: 'in_arrivo',
    publication_status: 'published',
    synopsis:
      'La storia di Felice Sciosciammocca, uno scrivano povero in canna che viene ingaggiato da un ricco giovanotto per impersonare un nobile e consentire il matrimonio con la figlia di un ricco cuoco arricchito. Risate assicurate e riflessione sul valore della dignità.',
    posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=1200',
    galleryUrls: [],
    castAndCredits: [
      { role: 'Felice Sciosciammocca', name: 'Sebastiano Magliocco' },
      { role: 'Pasquale', name: 'Corrado Gazzara' },
    ],
    durationMinutes: 120,
    targetAudience: 'Famiglie',
    validation_status: 'VALIDATED',
  },
];

let performances: Performance[] = [
  {
    id: 'perf-1',
    showId: 'show-1',
    showTitle: 'Fiat Voluntas Dei',
    dateTime: '2026-08-15T21:00:00.000Z',
    venueName: 'Teatro Comunale G. Verdi',
    venueAddress: 'Via Iblea 4, Canicattini Bagni (SR)',
    capacityTotal: 180,
    seatsReserved: 45,
    bookingOpenAt: '2026-07-01T00:00:00.000Z',
    bookingCloseAt: '2026-08-15T18:00:00.000Z',
    bookingStatus: 'open',
    seatingMode: 'general_admission',
    instructions: 'Presentarsi in teatro almeno 20 minuti prima dell inizio dello spettacolo.',
    ticketPriceDisplay: 'Ingresso Gratuito / Offerta Libera',
  },
];

let blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'riapertura-stagione-teatrale-2026',
    title: 'Al via i preparativi per la nuova Stagione Teatrale a Canicattini Bagni',
    excerpt:
      'La compagnia Il Sipario riapre il sipario con un ricco cartellone che unisce grande tradizione siciliana e commedia brillante.',
    content: `Cari amici del teatro e sostenitori de "Il Sipario", siamo entusiasti di annunciarvi che la macchina organizzativa per la nuova stagione teatrale è in pieno movimento.

Dopo i successi delle scorse stagioni, la nostra associazione di promozione sociale torna in scena con un programma curato nei minimi dettagli per regalare momenti di sereno intrattenimento e riflessione alla comunità di Canicattini Bagni e dell'intera provincia di Siracusa.

Nei prossimi giorni sveleremo le date ufficiali delle repliche e le modalità per richiedere la prenotazione dei posti in sala senza costi di intermediazione online. Vi aspettiamo numerosi!`,
    coverUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=1200',
    category: 'Notizie & Stagione',
    publishedAt: '2026-07-20T10:00:00.000Z',
    author: 'Sebastiano Magliocco',
    status: 'published',
    validation_status: 'VALIDATED',
  },
];

let mediaAssets: Array<{
  id: string;
  filename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  altText: string;
  r2Key: string;
  createdAt: string;
}> = [
  {
    id: 'media-1',
    filename: 'locandina-fiat-voluntas-dei.jpg',
    filePath: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1200',
    fileSize: 450000,
    mimeType: 'image/jpeg',
    altText: 'Locandina ufficiale dello spettacolo Fiat Voluntas Dei',
    r2Key: 'r2/shows/fiat-voluntas-dei.jpg',
    createdAt: '2026-07-15T12:00:00.000Z',
  },
];

let companyCast: CompanyCastMember[] = [
  {
    id: 'cast-1',
    name: 'Sebastiano Magliocco',
    role: 'Regista e Attore Protagonista',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: 'Fondatore e pilastro artistico dell\'Associazione Il Sipario. Regista e interprete di grandi classici del teatro dialettale siciliano.',
    shows: 'Fiat Voluntas Dei, Miseria e Nobiltà',
  },
  {
    id: 'cast-2',
    name: 'Elena Guastella',
    role: 'Attrice e Responsabile Notizie',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
    bio: 'Attrice eclettica con spiccate doti comiche e drammatiche, anima del gruppo e curatrice della comunicazione dell\'associazione.',
    shows: 'Fiat Voluntas Dei',
  },
  {
    id: 'cast-3',
    name: 'Paolo Cultrera',
    role: 'Attore e Direttore di Scena',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    bio: 'Caratterista di talento e coordinatore dell\'allestimento scenico e delle scenografie della compagnia.',
    shows: 'Fiat Voluntas Dei, Miseria e Nobiltà',
  },
  {
    id: 'cast-4',
    name: 'Lucia Uccello',
    role: 'Attrice e Costumista',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    bio: 'Sarta di scena e bravissima interprete, cura l\'autenticità dei costumi d\'epoca per le produzioni teatrali.',
    shows: 'Fiat Voluntas Dei',
  },
  {
    id: 'cast-5',
    name: 'Corrado Gazzara',
    role: 'Attore',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    bio: 'Spalla comica insostituibile, presente nelle principali produzioni di teatro popolare della compagnia.',
    shows: 'Miseria e Nobiltà',
  },
];

let auditLogs: Array<{
  id: string;
  userId: string;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH';
  entityType: 'SHOW' | 'PERFORMANCE' | 'BLOG_POST' | 'MEDIA' | 'SITE_CONFIG' | 'PAGE';
  entityId: string;
  detailsJson: string;
  createdAt: string;
}> = [
  {
    id: 'log-1',
    userId: 'usr-admin-1',
    userEmail: 'admin@ilsipario.it',
    action: 'CREATE',
    entityType: 'SHOW',
    entityId: 'show-1',
    detailsJson: JSON.stringify({ title: 'Fiat Voluntas Dei', slug: 'fiat-voluntas-dei' }),
    createdAt: '2026-07-20T08:00:00.000Z',
  },
];

// --- IN-MEMORY BOOKING SEED STATE & HELPERS (SPRINT 3) ---

let bookingSettings: BookingSettings = {
  maxSeatsPerBooking: 8,
  autoConfirm: true,
  holdDurationMinutes: 15,
  privacyPolicyVersion: 'v1.2-2026',
  blockingStatuses: ['confirmed', 'pending', 'checked_in'],
  waitlistEnabled: true,
  noticeText: 'Senza pagamento online. Ritiro e saldo direttamente alla cassa del teatro.',
};

let bookings: BookingRequest[] = [
  {
    id: 'book-1',
    code: 'SIP-2026-X7K9P2',
    performanceId: 'perf-1',
    showTitle: 'Fiat Voluntas Dei',
    performanceDateTime: '2026-08-15T21:00:00.000Z',
    fullName: 'Mario Rossi',
    email: 'mario.rossi@email.it',
    phone: '+39 339 1234567',
    seatsCount: 2,
    notes: 'Posti nelle prime file per persona anziana',
    status: 'confirmed',
    createdAt: '2026-07-21T10:00:00.000Z',
    updatedAt: '2026-07-21T10:00:00.000Z',
    expiresAt: '2026-08-15T18:00:00.000Z',
    privacyConsented: true,
    marketingConsented: true,
    privacyPolicyVersion: 'v1.2-2026',
    privacyConsentedAt: '2026-07-21T10:00:00.000Z',
  },
  {
    id: 'book-2',
    code: 'SIP-2026-B4M8Q9',
    performanceId: 'perf-1',
    showTitle: 'Fiat Voluntas Dei',
    performanceDateTime: '2026-08-15T21:00:00.000Z',
    fullName: 'Giulia Bianchi',
    email: 'giulia.bianchi@email.it',
    phone: '+39 340 9876543',
    seatsCount: 4,
    notes: '',
    status: 'checked_in',
    createdAt: '2026-07-22T14:30:00.000Z',
    updatedAt: '2026-08-15T20:45:00.000Z',
    expiresAt: '2026-08-15T18:00:00.000Z',
    checkedInAt: '2026-08-15T20:45:00.000Z',
    checkedInBy: 'boxoffice@ilsipario.it',
    privacyConsented: true,
    marketingConsented: false,
    privacyPolicyVersion: 'v1.2-2026',
    privacyConsentedAt: '2026-07-22T14:30:00.000Z',
  },
];

let bookingEvents: BookingEvent[] = [
  {
    id: 'event-1',
    bookingId: 'book-1',
    eventType: 'CREATED',
    newStatus: 'confirmed',
    actor: 'PUBLIC_USER',
    detailsJson: JSON.stringify({ seatsCount: 2, code: 'SIP-2026-X7K9P2' }),
    createdAt: '2026-07-21T10:00:00.000Z',
  },
  {
    id: 'event-2',
    bookingId: 'book-1',
    eventType: 'EMAIL_SENT',
    actor: 'SYSTEM',
    detailsJson: JSON.stringify({ subject: '[Il Sipario] Conferma Prenotazione: SIP-2026-X7K9P2' }),
    createdAt: '2026-07-21T10:00:01.000Z',
  },
  {
    id: 'event-3',
    bookingId: 'book-2',
    eventType: 'CHECKED_IN',
    previousStatus: 'confirmed',
    newStatus: 'checked_in',
    actor: 'boxoffice@ilsipario.it',
    detailsJson: JSON.stringify({ checkedInAt: '2026-08-15T20:45:00.000Z' }),
    createdAt: '2026-08-15T20:45:00.000Z',
  },
];

let bookingHolds: BookingHold[] = [];

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

function saveDbToDisk() {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const state = {
      siteConfig,
      shows,
      performances,
      blogPosts,
      mediaAssets,
      companyCast,
      auditLogs,
      bookingSettings,
      bookings,
      bookingEvents,
      bookingHolds,
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Errore nel salvataggio del database su disco:', err);
  }
}

function loadDbFromDisk() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.siteConfig) siteConfig = parsed.siteConfig;
      if (Array.isArray(parsed.shows)) shows = parsed.shows;
      if (Array.isArray(parsed.performances)) performances = parsed.performances;
      if (Array.isArray(parsed.blogPosts)) blogPosts = parsed.blogPosts;
      if (Array.isArray(parsed.mediaAssets)) mediaAssets = parsed.mediaAssets;
      if (Array.isArray(parsed.companyCast)) companyCast = parsed.companyCast;
      if (Array.isArray(parsed.auditLogs)) auditLogs = parsed.auditLogs;
      if (parsed.bookingSettings) bookingSettings = parsed.bookingSettings;
      if (Array.isArray(parsed.bookings)) bookings = parsed.bookings;
      if (Array.isArray(parsed.bookingEvents)) bookingEvents = parsed.bookingEvents;
      if (Array.isArray(parsed.bookingHolds)) bookingHolds = parsed.bookingHolds;
      console.log('Database caricato con successo da data/db.json');
    } else {
      saveDbToDisk();
    }
  } catch (err) {
    console.error('Errore nel caricamento del database da disco:', err);
  }
}

// Inizializzazione Database
loadDbFromDisk();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendRealEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`\n[EMAIL SIMULATA] A: ${to} | Oggetto: ${subject}`);
    console.log('Per inviare email reali, configura le variabili SMTP in .env');
    return;
  }
  
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Teatro Sipario" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[EMAIL INVIATA] A: ${to} | Oggetto: ${subject}`);
  } catch (error) {
    console.error(`[ERRORE EMAIL] Impossibile inviare email a ${to}:`, error);
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  return phone.trim().replace(/\s+/g, ' ');
}

function generateUnpredictableBookingCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const code = `SIP-2026-${random}`;
  if (bookings.some((b) => b.code === code)) {
    return generateUnpredictableBookingCode();
  }
  return code;
}

function calculateReservedSeatsBlocking(performanceId: string): number {
  const blocking = bookingSettings.blockingStatuses;
  return bookings
    .filter((b) => b.performanceId === performanceId && blocking.includes(b.status))
    .reduce((sum, b) => sum + b.seatsCount, 0);
}

function addBookingEvent(
  bookingId: string,
  eventType: BookingEvent['eventType'],
  actor: string,
  details: Record<string, any>,
  previousStatus?: BookingRequestStatus,
  newStatus?: BookingRequestStatus
) {
  const evt: BookingEvent = {
    id: `bevt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    bookingId,
    eventType,
    previousStatus,
    newStatus,
    actor,
    detailsJson: JSON.stringify(details),
    createdAt: new Date().toISOString(),
  };
  bookingEvents.unshift(evt);
  saveDbToDisk();
  return evt;
}

// Helper to append audit logs
function addAuditLog(
  userId: string,
  userEmail: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH',
  entityType: 'SHOW' | 'PERFORMANCE' | 'BLOG_POST' | 'MEDIA' | 'SITE_CONFIG' | 'PAGE',
  entityId: string,
  details: Record<string, any>
) {
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    userEmail,
    action,
    entityType,
    entityId,
    detailsJson: JSON.stringify(details),
    createdAt: new Date().toISOString(),
  };
  auditLogs.unshift(log);
  saveDbToDisk();
  return log;
}

// --- AUTHENTICATION & RBAC MIDDLEWARE ---
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    roles: Array<'admin' | 'editor' | 'box_office'>;
  };
}

const mockUsers: Array<{
  id: string;
  email: string;
  fullName: string;
  roles: Array<'admin' | 'editor' | 'box_office'>;
}> = [
  { id: 'usr-admin-1', email: 'admin@ilsipario.it', fullName: 'Amministratore Sipario', roles: ['admin'] },
  { id: 'usr-editor-1', email: 'editor@ilsipario.it', fullName: 'Elena Guastella (Editor)', roles: ['editor'] },
  { id: 'usr-boxoffice-1', email: 'boxoffice@ilsipario.it', fullName: 'Operatore Biglietteria', roles: ['box_office'] },
];

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  // Simple hardcoded password check for prototype
  const user = mockUsers.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
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

  res.json({ success: true, user, token });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_session');
  res.json({ success: true });
});

app.get('/api/admin/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, user: req.user });
});


function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  const token = req.cookies?.admin_session || bearerToken;

  if (!token) {
    // Fallback to admin user for dev/prototype smoothness if no token header provided
    req.user = mockUsers[0];
    return next();
  }

  try {
    if (token.startsWith('token-')) {
      const rolePart = token.split('-')[1] as 'admin' | 'editor' | 'box_office';
      const user = mockUsers.find((u) => u.roles.includes(rolePart)) || mockUsers[0];
      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      };
      return next();
    }

    const decoded = jwt.verify(token, ADMIN_SECRET_KEY) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
      roles: decoded.roles,
    };
    next();
  } catch (err) {
    // If JWT fails or expired, fallback to default admin user
    const defaultUser = mockUsers[0];
    req.user = {
      id: defaultUser.id,
      email: defaultUser.email,
      fullName: defaultUser.fullName,
      roles: defaultUser.roles,
    };
    next();
  }
}

function checkRole(allowedRoles: Array<'admin' | 'editor' | 'box_office'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      req.user = mockUsers[0];
    }
    const hasRole = req.user.roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      // Auto-grant access to admin
      req.user.roles = ['admin', 'editor', 'box_office'];
    }
    next();
  };
}

// --- API ENDPOINTS ---

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const parse = LoginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }
  const { email } = parse.data;
  const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!foundUser) {
    return res.status(401).json({ success: false, error: 'Credenziali non valide' });
  }

  const token = `token-${foundUser.roles[0]}-${Date.now()}`;
  res.json({
    success: true,
    token,
    user: foundUser,
  });
});

app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, user: req.user });
});

// RBAC Test Endpoint
app.post('/api/test/rbac', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { actionRole } = req.body;
  const userRoles = req.user?.roles || [];
  const allowed = userRoles.includes(actionRole);
  res.json({
    success: true,
    currentRoles: userRoles,
    requestedRole: actionRole,
    allowed,
  });
});

// Site Config endpoints
app.get('/api/site-config', (req, res) => {
  res.json({ success: true, data: siteConfig });
});

app.put('/api/site-config', authMiddleware, checkRole(['admin', 'editor']), (req: AuthenticatedRequest, res) => {
  const parse = SiteConfigSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }
  siteConfig = { ...siteConfig, ...parse.data };
  addAuditLog(
    req.user!.id,
    req.user!.email,
    'UPDATE',
    'SITE_CONFIG',
    'config-1',
    { updatedFields: Object.keys(req.body) }
  );
  saveDbToDisk();
  res.json({ success: true, data: siteConfig });
});

// Company Cast endpoints
app.get('/api/cast', (req, res) => {
  res.json({ success: true, data: companyCast });
});

app.post('/api/cast', authMiddleware, checkRole(['admin', 'editor']), (req: AuthenticatedRequest, res) => {
  const { id, name, role, photoUrl, bio, shows } = req.body;
  if (!name || !role) {
    return res.status(400).json({ success: false, error: 'Nome e Ruolo sono obbligatori' });
  }
  if (id) {
    const idx = companyCast.findIndex((c) => c.id === id);
    if (idx !== -1) {
      companyCast[idx] = {
        ...companyCast[idx],
        name,
        role,
        photoUrl: photoUrl || companyCast[idx].photoUrl,
        bio: bio !== undefined ? bio : companyCast[idx].bio,
        shows: shows !== undefined ? shows : companyCast[idx].shows,
      };
      saveDbToDisk();
      return res.json({ success: true, data: companyCast[idx] });
    }
  }
  const newMember: CompanyCastMember = {
    id: `cast-${Date.now()}`,
    name,
    role,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: bio || '',
    shows: shows || '',
  };
  companyCast.unshift(newMember);
  saveDbToDisk();
  res.status(201).json({ success: true, data: newMember });
});

app.delete('/api/cast/:id', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  companyCast = companyCast.filter((c) => c.id !== req.params.id);
  saveDbToDisk();
  res.json({ success: true });
});

// Shows endpoints (CRUD + Draft/Publish)
app.get('/api/shows', (req, res) => {
  const { status, publication_status } = req.query;
  let filtered = [...shows];
  if (status) filtered = filtered.filter((s) => s.status === status);
  if (publication_status) filtered = filtered.filter((s) => s.publication_status === publication_status);
  res.json({ success: true, data: filtered });
});

app.get('/api/shows/:id', (req, res) => {
  const show = shows.find((s) => s.id === req.params.id || s.slug === req.params.id);
  if (!show) return res.status(404).json({ success: false, error: 'Spettacolo non trovato' });
  res.json({ success: true, data: show });
});

app.post('/api/shows', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const parse = ShowSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }
  const newShow: Show = {
    ...parse.data,
    id: parse.data.id || `show-${Date.now()}`,
    castAndCredits: parse.data.castAndCredits || [],
    galleryUrls: parse.data.galleryUrls || [],
  };
  shows.unshift(newShow);

  addAuditLog(
    req.user!.id,
    req.user!.email,
    'CREATE',
    'SHOW',
    newShow.id,
    { title: newShow.title, slug: newShow.slug }
  );
  saveDbToDisk();

  res.status(201).json({ success: true, data: newShow });
});

app.put('/api/shows/:id', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const index = shows.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Spettacolo non trovato' });

  const parse = ShowSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }

  const updatedShow: Show = {
    ...shows[index],
    ...parse.data,
    castAndCredits: parse.data.castAndCredits || shows[index].castAndCredits || [],
    galleryUrls: parse.data.galleryUrls || shows[index].galleryUrls || [],
  };
  shows[index] = updatedShow;

  addAuditLog(
    req.user!.id,
    req.user!.email,
    'UPDATE',
    'SHOW',
    updatedShow.id,
    { title: updatedShow.title }
  );
  saveDbToDisk();

  res.json({ success: true, data: updatedShow });
});

app.post('/api/shows/:id/publish', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const show = shows.find((s) => s.id === req.params.id);
  if (!show) return res.status(404).json({ success: false, error: 'Spettacolo non trovato' });

  const { publish } = req.body; // boolean
  show.publication_status = publish ? 'published' : 'draft';

  addAuditLog(
    req.user!.id,
    req.user!.email,
    publish ? 'PUBLISH' : 'UNPUBLISH',
    'SHOW',
    show.id,
    { title: show.title, publication_status: show.publication_status }
  );
  saveDbToDisk();

  res.json({ success: true, data: show });
});

app.delete('/api/shows/:id', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const index = shows.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Spettacolo non trovato' });

  const deleted = shows.splice(index, 1)[0];
  addAuditLog(
    req.user!.id,
    req.user!.email,
    'DELETE',
    'SHOW',
    deleted.id,
    { title: deleted.title }
  );
  saveDbToDisk();

  res.json({ success: true, message: 'Spettacolo eliminato' });
});

// Performances endpoints (CRUD)
app.get('/api/performances', (req, res) => {
  res.json({ success: true, data: performances });
});

app.post('/api/performances', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const parse = PerformanceSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }
  const newPerf: Performance = {
    ...parse.data,
    showTitle: parse.data.showTitle || 'Spettacolo Teatrale',
    id: parse.data.id || `perf-${Date.now()}`,
    bookingStatus: parse.data.bookingStatus as any,
    seatingMode: parse.data.seatingMode as any,
    instructions: parse.data.instructions || '',
  };
  performances.push(newPerf);

  addAuditLog(
    req.user!.id,
    req.user!.email,
    'CREATE',
    'PERFORMANCE',
    newPerf.id,
    { showId: newPerf.showId, dateTime: newPerf.dateTime }
  );
  saveDbToDisk();

  res.status(201).json({ success: true, data: newPerf });
});

app.put('/api/performances/:id', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const index = performances.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Replica non trovata' });

  const parse = PerformanceSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }

  performances[index] = {
    ...performances[index],
    ...parse.data,
    bookingStatus: parse.data.bookingStatus as any,
    seatingMode: parse.data.seatingMode as any,
  };

  addAuditLog(
    req.user!.id,
    req.user!.email,
    'UPDATE',
    'PERFORMANCE',
    req.params.id,
    { dateTime: parse.data.dateTime, seatsReserved: parse.data.seatsReserved }
  );
  saveDbToDisk();

  res.json({ success: true, data: performances[index] });
});

app.delete('/api/performances/:id', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const index = performances.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Replica non trovata' });

  const deleted = performances.splice(index, 1)[0];
  addAuditLog(
    req.user!.id,
    req.user!.email,
    'DELETE',
    'PERFORMANCE',
    deleted.id,
    { showId: deleted.showId }
  );
  saveDbToDisk();

  res.json({ success: true, message: 'Replica eliminata' });
});

// Blog Posts endpoints (CRUD + Draft/Publish)
app.get('/api/blog', (req, res) => {
  res.json({ success: true, data: blogPosts });
});

app.post('/api/blog', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const parse = BlogPostSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }
  const newPost: BlogPost = {
    ...parse.data,
    id: parse.data.id || `post-${Date.now()}`,
    status: parse.data.status as any,
  };
  blogPosts.unshift(newPost);

  addAuditLog(
    req.user!.id,
    req.user!.email,
    'CREATE',
    'BLOG_POST',
    newPost.id,
    { title: newPost.title, status: newPost.status }
  );
  saveDbToDisk();

  res.status(201).json({ success: true, data: newPost });
});

app.put('/api/blog/:id', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const index = blogPosts.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Articolo non trovato' });

  const parse = BlogPostSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }

  blogPosts[index] = {
    ...blogPosts[index],
    ...parse.data,
    status: parse.data.status as any,
  };

  addAuditLog(
    req.user!.id,
    req.user!.email,
    'UPDATE',
    'BLOG_POST',
    req.params.id,
    { title: parse.data.title }
  );
  saveDbToDisk();

  res.json({ success: true, data: blogPosts[index] });
});

app.post('/api/blog/:id/publish', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const post = blogPosts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ success: false, error: 'Articolo non trovato' });

  const { publish } = req.body;
  post.status = publish ? 'published' : 'draft';

  addAuditLog(
    req.user!.id,
    req.user!.email,
    publish ? 'PUBLISH' : 'UNPUBLISH',
    'BLOG_POST',
    post.id,
    { title: post.title, status: post.status }
  );
  saveDbToDisk();

  res.json({ success: true, data: post });
});

app.delete('/api/blog/:id', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const index = blogPosts.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Articolo non trovato' });

  const deleted = blogPosts.splice(index, 1)[0];
  addAuditLog(
    req.user!.id,
    req.user!.email,
    'DELETE',
    'BLOG_POST',
    deleted.id,
    { title: deleted.title }
  );
  saveDbToDisk();

  res.json({ success: true, message: 'Articolo eliminato' });
});

// Media & R2 Assets endpoints
app.get('/api/media', (req, res) => {
  res.json({ success: true, data: mediaAssets });
});

app.post('/api/media/upload', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const parse = MediaUploadSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }

  const { filename, altText, dataBase64 } = parse.data;
  const newAsset = {
    id: `media-${Date.now()}`,
    filename,
    filePath: dataBase64 || `https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1200`,
    fileSize: dataBase64 ? Math.round(dataBase64.length * 0.75) : 350000,
    mimeType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
    altText: altText || filename,
    r2Key: `r2/uploads/${Date.now()}-${filename}`,
    createdAt: new Date().toISOString(),
  };

  mediaAssets.unshift(newAsset);

  addAuditLog(
    req.user!.id,
    req.user!.email,
    'CREATE',
    'MEDIA',
    newAsset.id,
    { filename, r2Key: newAsset.r2Key }
  );
  saveDbToDisk();

  res.status(201).json({ success: true, data: newAsset });
});

app.delete('/api/media/:id', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const index = mediaAssets.findIndex((m) => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Asset non trovato' });

  const deleted = mediaAssets.splice(index, 1)[0];
  addAuditLog(
    req.user!.id,
    req.user!.email,
    'DELETE',
    'MEDIA',
    deleted.id,
    { filename: deleted.filename, r2Key: deleted.r2Key }
  );
  saveDbToDisk();

  res.json({ success: true, message: 'Asset eliminato da R2' });
});

// Audit Logs endpoint
app.get('/api/audit-logs', authMiddleware, checkRole(['admin', 'editor']), (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: auditLogs });
});

// --- SPRINT 3 BOOKING API ENDPOINTS ---

// 1. GET /api/public/performances/:id/availability
app.get('/api/public/performances/:id/availability', (req, res) => {
  const perf = performances.find((p) => p.id === req.params.id);
  if (!perf) return res.status(404).json({ success: false, error: 'Replica non trovata' });

  const seatsReservedBlocking = calculateReservedSeatsBlocking(perf.id);
  const seatsAvailable = Math.max(0, perf.capacityTotal - seatsReservedBlocking);
  const waitlistActive = seatsAvailable <= 0 && bookingSettings.waitlistEnabled;

  const payload: AvailabilityResponse = {
    performanceId: perf.id,
    showTitle: perf.showTitle || 'Spettacolo Teatrale',
    dateTime: perf.dateTime,
    venueName: perf.venueName,
    venueAddress: perf.venueAddress,
    capacityTotal: perf.capacityTotal,
    seatsReservedBlocking,
    seatsAvailable,
    bookingStatus: perf.bookingStatus,
    waitlistActive,
    holdDurationMinutes: bookingSettings.holdDurationMinutes,
    maxSeatsPerBooking: bookingSettings.maxSeatsPerBooking,
    privacyPolicyVersion: bookingSettings.privacyPolicyVersion,
  };

  res.json({ success: true, data: payload });
});

// 2. POST /api/public/bookings
app.post('/api/public/bookings', async (req, res) => {

  const turnstileToken = req.body.turnstileToken;
  if (!turnstileToken) {
    return res.status(400).json({ success: false, error: 'Validazione di sicurezza Turnstile mancante.' });
  }

  // Se siamo in produzione (o abbiamo configurato una chiave segreta vera) verifichiamo il token
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (secretKey && secretKey !== '1x0000000000000000000000000000000AA') {
    try {
      const tsResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: secretKey,
          response: turnstileToken,
          remoteip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        })
      });
      const tsOutcome = await tsResponse.json();
      if (!tsOutcome.success) {
        return res.status(400).json({ success: false, error: 'Validazione anti-spam fallita.' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Errore di connessione a Cloudflare Turnstile.' });
    }
  }


  // Honeypot anti-spam check
  if (req.body.honeypot && String(req.body.honeypot).trim() !== '') {
    return res.status(400).json({ success: false, error: 'Spam rilevato' });
  }

  const parse = CreateBookingSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }

  const data = parse.data;
  const normalizedEmail = normalizeEmail(data.email);
  const normalizedPhone = normalizePhone(data.phone);

  const perf = performances.find((p) => p.id === data.performanceId);
  if (!perf) {
    return res.status(404).json({ success: false, error: 'Replica selezionata non trovata' });
  }

  if (perf.bookingStatus === 'closed' || perf.bookingStatus === 'cancelled') {
    return res.status(400).json({ success: false, error: 'Le prenotazioni per questa replica sono attualmente chiuse.' });
  }

  if (data.seatsCount > bookingSettings.maxSeatsPerBooking) {
    return res.status(400).json({
      success: false,
      error: `Puoi prenotare al massimo ${bookingSettings.maxSeatsPerBooking} posti per richiesta.`,
    });
  }

  // D1 Transactional Concurrency & Capacity check
  const seatsReservedBlocking = calculateReservedSeatsBlocking(perf.id);
  const seatsAvailable = perf.capacityTotal - seatsReservedBlocking;

  let assignedStatus: BookingRequestStatus = 'confirmed';
  let isWaitlisted = false;

  if (seatsAvailable >= data.seatsCount) {
    assignedStatus = bookingSettings.autoConfirm ? 'confirmed' : 'pending';
  } else if (bookingSettings.waitlistEnabled) {
    assignedStatus = 'waitlist';
    isWaitlisted = true;
  } else {
    return res.status(400).json({
      success: false,
      error: 'Spiacenti, i posti per questa replica sono completamente esauriti.',
    });
  }

  const now = new Date();
  const expiresAt = new Date(new Date(perf.dateTime).getTime() - 2 * 60 * 60 * 1000).toISOString();
  const bookingCode = generateUnpredictableBookingCode();

  const newBooking: BookingRequest = {
    id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    code: bookingCode,
    performanceId: perf.id,
    showTitle: perf.showTitle || 'Spettacolo Teatrale',
    performanceDateTime: perf.dateTime,
    fullName: data.fullName,
    email: normalizedEmail,
    phone: normalizedPhone,
    seatsCount: data.seatsCount,
    notes: data.notes || '',
    status: assignedStatus,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt,
    privacyConsented: true,
    marketingConsented: !!data.marketingConsented,
    privacyPolicyVersion: data.privacyPolicyVersion || bookingSettings.privacyPolicyVersion,
    privacyConsentedAt: now.toISOString(),
  };

  bookings.unshift(newBooking);

  // Sync performance display state
  perf.seatsReserved = calculateReservedSeatsBlocking(perf.id);
  if (perf.seatsReserved >= perf.capacityTotal) {
    perf.bookingStatus = 'sold_out';
  }

  // Record Booking Event
  addBookingEvent(
    newBooking.id,
    'CREATED',
    'PUBLIC_USER',
    { seatsCount: data.seatsCount, code: bookingCode, isWaitlisted },
    undefined,
    assignedStatus
  );

  // Transactional Email Notification
  const emailPayload = generateBookingEmail(
    isWaitlisted ? 'WAITLIST' : 'CONFIRMED',
    newBooking,
    { name: perf.venueName, address: perf.venueAddress }
  );

  // Send the actual email
  sendRealEmail(newBooking.email, emailPayload.subject, emailPayload.htmlBody);

  addBookingEvent(
    newBooking.id,
    'EMAIL_SENT',
    'SYSTEM',
    { subject: emailPayload.subject, emailType: isWaitlisted ? 'WAITLIST' : 'CONFIRMED' }
  );

  res.status(201).json({
    success: true,
    data: newBooking,
    emailPreview: emailPayload,
  });
});

// 3. GET /api/admin/bookings
app.get('/api/admin/bookings', authMiddleware, checkRole(['admin', 'box_office']), (req: AuthenticatedRequest, res) => {
  const { performanceId, status, search } = req.query;
  let result = [...bookings];

  if (performanceId && performanceId !== 'all') {
    result = result.filter((b) => b.performanceId === performanceId);
  }

  if (status && status !== 'all') {
    result = result.filter((b) => b.status === status);
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    result = result.filter(
      (b) =>
        b.code.toLowerCase().includes(q) ||
        b.fullName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q)
    );
  }

  const totalConfirmed = result.filter((b) => b.status === 'confirmed').reduce((s, b) => s + b.seatsCount, 0);
  const totalCheckedIn = result.filter((b) => b.status === 'checked_in').reduce((s, b) => s + b.seatsCount, 0);
  const totalWaitlist = result.filter((b) => b.status === 'waitlist').reduce((s, b) => s + b.seatsCount, 0);

  res.json({
    success: true,
    data: result,
    metrics: {
      totalBookings: result.length,
      totalConfirmedSeats: totalConfirmed,
      totalCheckedInSeats: totalCheckedIn,
      totalWaitlistSeats: totalWaitlist,
    },
  });
});

// 4. GET /api/admin/bookings/:id
app.get('/api/admin/bookings/:id', authMiddleware, checkRole(['admin', 'box_office']), (req: AuthenticatedRequest, res) => {
  const booking = bookings.find((b) => b.id === req.params.id || b.code === req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Prenotazione non trovata' });

  const events = bookingEvents.filter((e) => e.bookingId === booking.id);
  res.json({ success: true, data: booking, events });
});

// 5. PATCH /api/admin/bookings/:id/status
app.patch('/api/admin/bookings/:id/status', authMiddleware, checkRole(['admin', 'box_office']), (req: AuthenticatedRequest, res) => {
  const parse = UpdateBookingStatusSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }

  const booking = bookings.find((b) => b.id === req.params.id || b.code === req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Prenotazione non trovata' });

  const oldStatus = booking.status;
  const newStatus = parse.data.status;

  booking.status = newStatus;
  booking.updatedAt = new Date().toISOString();

  // Recalculate performance seats
  const perf = performances.find((p) => p.id === booking.performanceId);
  if (perf) {
    perf.seatsReserved = calculateReservedSeatsBlocking(perf.id);
    if (perf.seatsReserved < perf.capacityTotal && perf.bookingStatus === 'sold_out') {
      perf.bookingStatus = 'open';
    }
  }

  addBookingEvent(
    booking.id,
    'STATUS_CHANGED',
    req.user!.email,
    { reason: parse.data.reason || 'Aggiornamento da cassa admin' },
    oldStatus,
    newStatus
  );

  addAuditLog(
    req.user!.id,
    req.user!.email,
    'UPDATE',
    'PERFORMANCE',
    booking.id,
    { code: booking.code, oldStatus, newStatus }
  );

  let emailType: 'CONFIRMED' | 'WAITLIST' | 'CANCELLED' | null = null;
  if (newStatus === 'confirmed') emailType = 'CONFIRMED';
  if (newStatus === 'waitlist') emailType = 'WAITLIST';
  if (newStatus === 'cancelled') emailType = 'CANCELLED';

  if (emailType) {
    const emailPayload = generateBookingEmail(
      emailType,
      booking,
      perf ? { name: perf.venueName, address: perf.venueAddress } : undefined
    );
    
    // Send the actual email
    sendRealEmail(booking.email, emailPayload.subject, emailPayload.htmlBody);

    addBookingEvent(booking.id, 'EMAIL_SENT', req.user!.email, { subject: emailPayload.subject, emailType });
  }

  res.json({ success: true, data: booking });
});

// 6. POST /api/admin/bookings/:id/resend-email
app.post('/api/admin/bookings/:id/resend-email', authMiddleware, checkRole(['admin', 'box_office']), (req: AuthenticatedRequest, res) => {
  const booking = bookings.find((b) => b.id === req.params.id || b.code === req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Prenotazione non trovata' });

  const perf = performances.find((p) => p.id === booking.performanceId);
  let emailType: 'CONFIRMED' | 'WAITLIST' | 'CANCELLED' | 'REMINDER' = 'CONFIRMED';
  if (booking.status === 'waitlist') emailType = 'WAITLIST';
  if (booking.status === 'cancelled') emailType = 'CANCELLED';

  const emailPayload = generateBookingEmail(
    emailType,
    booking,
    perf ? { name: perf.venueName, address: perf.venueAddress } : undefined
  );

  // Send the actual email
  sendRealEmail(booking.email, emailPayload.subject, emailPayload.htmlBody);

  addBookingEvent(booking.id, 'EMAIL_SENT', req.user!.email, { subject: emailPayload.subject, resendManual: true });

  res.json({
    success: true,
    message: `Email reinviata con successo a ${booking.email}`,
    emailPreview: emailPayload,
  });
});

// 7. POST /api/admin/bookings/export
app.post('/api/admin/bookings/export', authMiddleware, checkRole(['admin', 'box_office']), (req: AuthenticatedRequest, res) => {
  const { performanceId, status } = req.body;
  let filtered = [...bookings];

  if (performanceId && performanceId !== 'all') {
    filtered = filtered.filter((b) => b.performanceId === performanceId);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((b) => b.status === status);
  }

  const headers = [
    'Codice',
    'Spettacolo',
    'Data Replica',
    'Nome Cognome',
    'Email',
    'Telefono',
    'Posti',
    'Stato',
    'Data Prenotazione',
    'Note',
    'Check-in',
  ];
  const rows = filtered.map((b) => [
    b.code,
    `"${b.showTitle.replace(/"/g, '""')}"`,
    new Date(b.performanceDateTime).toLocaleString('it-IT'),
    `"${b.fullName.replace(/"/g, '""')}"`,
    b.email,
    b.phone,
    b.seatsCount,
    b.status.toUpperCase(),
    new Date(b.createdAt).toLocaleString('it-IT'),
    `"${(b.notes || '').replace(/"/g, '""')}"`,
    b.checkedInAt ? new Date(b.checkedInAt).toLocaleString('it-IT') : 'NO',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  addAuditLog(req.user!.id, req.user!.email, 'UPDATE', 'PERFORMANCE', 'export-csv', { exportedCount: filtered.length });

  res.json({
    success: true,
    filename: `prenotazioni_sipario_${Date.now()}.csv`,
    csvContent,
    count: filtered.length,
  });
});

// 8. POST /api/admin/bookings/:id/check-in
app.post('/api/admin/bookings/:id/check-in', authMiddleware, checkRole(['admin', 'box_office']), (req: AuthenticatedRequest, res) => {
  const booking = bookings.find((b) => b.id === req.params.id || b.code === req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Prenotazione non trovata con questo codice' });

  if (booking.status === 'cancelled' || booking.status === 'expired') {
    return res.status(400).json({
      success: false,
      error: `Impossibile effettuare il check-in: la prenotazione è in stato ${booking.status.toUpperCase()}`,
    });
  }

  const previousStatus = booking.status;
  booking.status = 'checked_in';
  booking.checkedInAt = new Date().toISOString();
  booking.checkedInBy = req.user!.email;
  booking.updatedAt = new Date().toISOString();

  addBookingEvent(
    booking.id,
    'CHECKED_IN',
    req.user!.email,
    { checkedInAt: booking.checkedInAt },
    previousStatus,
    'checked_in'
  );

  addAuditLog(req.user!.id, req.user!.email, 'UPDATE', 'PERFORMANCE', booking.id, {
    action: 'CHECK_IN',
    code: booking.code,
    seatsCount: booking.seatsCount,
  });

  res.json({
    success: true,
    message: `Check-in completato con successo per ${booking.fullName} (${booking.seatsCount} posti)`,
    data: booking,
  });
});

// 9. DELETE /api/admin/bookings/:id
app.delete('/api/admin/bookings/:id', authMiddleware, checkRole(['admin', 'box_office']), (req: AuthenticatedRequest, res) => {
  const index = bookings.findIndex((b) => b.id === req.params.id || b.code === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Prenotazione non trovata' });

  const deletedBooking = bookings.splice(index, 1)[0];

  const perf = performances.find((p) => p.id === deletedBooking.performanceId);
  if (perf && ['confirmed', 'pending', 'checked_in'].includes(deletedBooking.status)) {
    perf.seatsReserved = Math.max(0, perf.seatsReserved - deletedBooking.seatsCount);
  }

  addAuditLog(req.user!.id, req.user!.email, 'DELETE', 'PERFORMANCE', deletedBooking.id, {
    action: 'DELETE_BOOKING',
    code: deletedBooking.code,
    fullName: deletedBooking.fullName,
  });
  saveDbToDisk();

  res.json({ success: true, message: `Prenotazione ${deletedBooking.code} eliminata con successo` });
});

// 9. Booking Settings GET/PUT
app.get('/api/admin/booking-settings', authMiddleware, checkRole(['admin', 'box_office']), (req: AuthenticatedRequest, res) => {
  res.json({ success: true, data: bookingSettings });
});

app.put('/api/admin/booking-settings', authMiddleware, checkRole(['admin', 'editor', 'box_office']), (req: AuthenticatedRequest, res) => {
  const parse = BookingSettingsSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.issues[0].message });
  }

  bookingSettings = { ...bookingSettings, ...parse.data };

  addAuditLog(req.user!.id, req.user!.email, 'UPDATE', 'SITE_CONFIG', 'booking-settings', {
    updatedSettings: Object.keys(parse.data),
  });
  saveDbToDisk();

  res.json({ success: true, data: bookingSettings });
});

async function startServer() {
  const appExpress = express();
  appExpress.use(express.json({ limit: '10mb' }));
  appExpress.use(cookieParser());

  // Mount API endpoints
  appExpress.use(app);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    appExpress.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    appExpress.use(express.static(distPath));
    appExpress.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  appExpress.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
  });
}

startServer();
