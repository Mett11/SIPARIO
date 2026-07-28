export type Role = 'admin' | 'editor' | 'box_office';

export interface SiteConfig {
  name: string;
  subName?: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  toneOfVoice: string[];
  noticeMessage?: string;
}

export type BookingStatus = 'draft' | 'open' | 'closed' | 'cancelled' | 'sold_out';
export type SeatingMode = 'general_admission' | 'numbered';
export type BookingRequestStatus = 'pending' | 'confirmed' | 'waitlist' | 'cancelled' | 'expired' | 'checked_in';

export interface Performance {
  id: string;
  showId: string;
  showTitle?: string;
  dateTime: string; // ISO 8601
  venueName: string;
  venueAddress: string;
  capacityTotal: number;
  seatsReserved: number;
  bookingOpenAt: string;
  bookingCloseAt: string;
  bookingStatus: BookingStatus;
  seatingMode: SeatingMode;
  instructions: string;
  ticketPriceFull?: string; // e.g. "10.00" or "€ 10,00"
  ticketPriceReduced?: string; // e.g. "7.00" or "€ 7,00"
  ticketPriceDisplay?: string; // Informative price tag e.g. "Ingresso Libero" or "€ 10,00"
}

export interface ShowCastMember {
  role: string;
  name: string;
}

export interface CompanyCastMember {
  id: string;
  name: string;
  role: string; // e.g. "Regista & Attore Protagonista", "Attrice", "Scenografo"
  photoUrl: string;
  bio?: string;
  shows?: string; // e.g. "Fiat Voluntas Dei, Miseria e Nobiltà"
}

export interface Show {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author?: string;
  director?: string;
  category: string; // e.g. "Commedia", "Drammatico", "Teatro Dialettale"
  status: 'in_scena' | 'in_arrivo' | 'archivio';
  publication_status?: 'draft' | 'published';
  synopsis: string;
  posterUrl: string;
  galleryUrls?: string[];
  castAndCredits?: ShowCastMember[];
  durationMinutes?: number;
  targetAudience?: string;
  ticketPriceFull?: string;
  ticketPriceReduced?: string;
  ticketPriceDisplay?: string;
  nextPerformanceId?: string;
  validationStatus?: 'VALIDATED' | 'DA_VALIDARE_CON_LA_COMPAGNIA';
  validation_status?: 'VALIDATED' | 'DA_VALIDARE_CON_LA_COMPAGNIA';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  category: string;
  publishedAt: string;
  author: string;
  status: 'draft' | 'published';
  validationStatus?: 'VALIDATED' | 'DA_VALIDARE_CON_LA_COMPAGNIA';
  validation_status?: 'VALIDATED' | 'DA_VALIDARE_CON_LA_COMPAGNIA';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  caption?: string;
  date?: string;
}

export interface BookingRequest {
  id: string;
  code: string; // e.g. SIP-2026-X7K9P2
  performanceId: string;
  showTitle: string;
  performanceDateTime: string;
  fullName: string;
  email: string;
  phone: string;
  seatsCount: number;
  notes?: string;
  status: BookingRequestStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  checkedInAt?: string;
  checkedInBy?: string;
  privacyConsented: boolean;
  marketingConsented: boolean;
  privacyPolicyVersion: string;
  privacyConsentedAt: string;
}

export type BookingEventType =
  | 'CREATED'
  | 'STATUS_CHANGED'
  | 'EMAIL_SENT'
  | 'CHECKED_IN'
  | 'EXPIRED'
  | 'WAITLIST_PROMOTED';

export interface BookingEvent {
  id: string;
  bookingId: string;
  eventType: BookingEventType;
  previousStatus?: BookingRequestStatus;
  newStatus?: BookingRequestStatus;
  actor: string; // e.g. "PUBLIC_USER", "SYSTEM_CRON", or admin email
  detailsJson: string;
  createdAt: string;
}

export interface BookingSettings {
  maxSeatsPerBooking: number;
  autoConfirm: boolean;
  holdDurationMinutes: number;
  privacyPolicyVersion: string;
  blockingStatuses: BookingRequestStatus[];
  waitlistEnabled: boolean;
  noticeText: string;
}

export interface BookingHold {
  id: string;
  performanceId: string;
  sessionId: string;
  seatsCount: number;
  expiresAt: string;
  createdAt: string;
}

export interface AvailabilityResponse {
  performanceId: string;
  showTitle: string;
  dateTime: string;
  venueName: string;
  venueAddress: string;
  capacityTotal: number;
  seatsReservedBlocking: number;
  seatsAvailable: number;
  bookingStatus: BookingStatus;
  waitlistActive: boolean;
  holdDurationMinutes: number;
  maxSeatsPerBooking: number;
  privacyPolicyVersion: string;
}

export interface UserPreferences {
  reducedMotion: boolean;
  quality3d: 'low' | 'medium' | 'high' | 'off';
  cookieConsent: boolean;
}
