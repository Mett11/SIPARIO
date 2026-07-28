import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Indirizzo email non valido'),
  password: z.string().min(4, 'Password richiesta'),
});

export const RoleSchema = z.enum(['admin', 'editor', 'box_office']);

export const ShowCreditSchema = z.object({
  role: z.string().min(1, 'Ruolo obbligatorio'),
  name: z.string().min(1, 'Nome obbligatorio'),
});

export const ShowSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Il titolo deve contenere almeno 2 caratteri'),
  slug: z.string().min(2, 'Lo slug deve contenere almeno 2 caratteri'),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  director: z.string().optional(),
  category: z.string().min(1, 'Seleziona una categoria'),
  status: z.enum(['in_scena', 'in_arrivo', 'archivio']),
  publication_status: z.enum(['draft', 'published']),
  synopsis: z.string().min(10, 'La sinossi deve contenere almeno 10 caratteri'),
  posterUrl: z.string().min(1, 'URL o file locandina obbligatorio'),
  durationMinutes: z.number().int().positive().optional().default(110),
  targetAudience: z.string().optional().default('Per tutti'),
  ticketPriceFull: z.string().optional().default(''),
  ticketPriceReduced: z.string().optional().default(''),
  ticketPriceDisplay: z.string().optional().default(''),
  galleryUrls: z.array(z.string()).optional().default([]),
  castAndCredits: z.array(ShowCreditSchema).optional().default([]),
  validation_status: z.enum(['VALIDATED', 'DA_VALIDARE_CON_LA_COMPAGNIA']).default('VALIDATED'),
});

export const PerformanceSchema = z.object({
  id: z.string().optional(),
  showId: z.string().min(1, 'Seleziona uno spettacolo valido'),
  showTitle: z.string().optional(),
  dateTime: z.string().min(1, 'Data e ora obbligatorie'),
  venueName: z.string().min(2, 'Nome teatro/sala obbligatorio'),
  venueAddress: z.string().min(2, 'Indirizzo obbligatorio'),
  capacityTotal: z.number().int().positive('La capienza deve essere maggiore di zero'),
  seatsReserved: z.number().int().nonnegative().default(0),
  bookingOpenAt: z.string(),
  bookingCloseAt: z.string(),
  bookingStatus: z.enum(['draft', 'open', 'closed', 'cancelled', 'sold_out']),
  seatingMode: z.enum(['general_admission', 'numbered']).default('general_admission'),
  ticketPriceFull: z.string().optional().default(''),
  ticketPriceReduced: z.string().optional().default(''),
  ticketPriceDisplay: z.string().optional().default(''),
  instructions: z.string().optional().default('Presentarsi 20 minuti prima dell inizio.'),
});

export const BlogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Titolo di almeno 3 caratteri'),
  slug: z.string().min(3, 'Slug di almeno 3 caratteri'),
  excerpt: z.string().min(5, 'Estratto obbligatorio'),
  content: z.string().min(10, 'Contenuto articolo obbligatorio'),
  coverUrl: z.string().min(1, 'Immagine di copertina obbligatoria'),
  category: z.string().min(1, 'Categoria obbligatoria'),
  publishedAt: z.string(),
  author: z.string().min(1, 'Autore obbligatorio'),
  status: z.enum(['draft', 'published']),
  validation_status: z.enum(['VALIDATED', 'DA_VALIDARE_CON_LA_COMPAGNIA']).default('VALIDATED'),
});

export const SiteConfigSchema = z.object({
  name: z.string().min(2),
  subName: z.string().optional(),
  city: z.string().min(2),
  address: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email(),
  facebookUrl: z.string().url().or(z.literal('')),
  instagramUrl: z.string().url().or(z.literal('')),
  youtubeUrl: z.string().url().or(z.literal('')),
  noticeMessage: z.string().optional(),
});

export const MediaUploadSchema = z.object({
  filename: z.string(),
  altText: z.string().optional(),
  dataBase64: z.string().optional(),
});

export const CreateBookingSchema = z.object({
  performanceId: z.string().min(1, 'Seleziona una replica valida'),
  fullName: z.string().trim().min(2, 'Il nome deve contenere almeno 2 caratteri'),
  email: z.string().trim().toLowerCase().email('Indirizzo email non valido'),
  phone: z.string().trim().min(8, 'Numero di telefono non valido (almeno 8 cifre)'),
  seatsCount: z.number().int().min(1, 'Seleziona almeno 1 posto').max(10, 'Massimo 10 posti per prenotazione'),
  notes: z.string().optional().default(''),
  honeypot: z.string().optional(),
  turnstileToken: z.string().optional(),
  privacyConsented: z.literal(true, {
    error: 'È obbligatorio accettare l\'Informativa sulla Privacy',
  }),
  marketingConsented: z.boolean().optional().default(false),
  privacyPolicyVersion: z.string().optional().default('v1.2-2026'),
});

export const UpdateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'waitlist', 'cancelled', 'expired', 'checked_in']),
  reason: z.string().optional(),
});

export const BookingSettingsSchema = z.object({
  maxSeatsPerBooking: z.number().int().positive().default(8),
  autoConfirm: z.boolean().default(true),
  holdDurationMinutes: z.number().int().positive().default(15),
  privacyPolicyVersion: z.string().default('v1.2-2026'),
  blockingStatuses: z.array(z.enum(['pending', 'confirmed', 'waitlist', 'cancelled', 'expired', 'checked_in'])).default(['confirmed', 'pending', 'checked_in']),
  waitlistEnabled: z.boolean().default(true),
  noticeText: z.string().optional().default(''),
});

