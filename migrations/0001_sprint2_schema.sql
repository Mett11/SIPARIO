-- Migration: 0001_sprint2_schema.sql
-- Description: D1 Database Schema for Il Sipario A.P.S. CMS Sprint 2

-- 1. Users & Roles (RBAC)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL, -- 'admin', 'editor', 'box_office'
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 2. Pages & Content Blocks (CMS Site Pages)
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published'
  meta_description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  block_key TEXT NOT NULL,
  block_type TEXT NOT NULL, -- 'hero', 'text', 'banner', 'site_config'
  content_json TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

-- 3. Shows & Show Details
CREATE TABLE IF NOT EXISTS shows (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT,
  director TEXT,
  category TEXT NOT NULL DEFAULT 'Commedia',
  status TEXT NOT NULL DEFAULT 'in_scena', -- 'in_scena', 'in_arrivo', 'archivio'
  publication_status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published'
  synopsis TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 110,
  target_audience TEXT DEFAULT 'Per tutti',
  validation_status TEXT NOT NULL DEFAULT 'VALIDATED', -- 'VALIDATED', 'DA_VALIDARE_CON_LA_COMPAGNIA'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS show_media (
  id TEXT PRIMARY KEY,
  show_id TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image', -- 'image', 'video'
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS show_credits (
  id TEXT PRIMARY KEY,
  show_id TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
);

-- 4. Performances & Capacity
CREATE TABLE IF NOT EXISTS performances (
  id TEXT PRIMARY KEY,
  show_id TEXT NOT NULL,
  date_time TEXT NOT NULL, -- ISO 8601
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  capacity_total INTEGER NOT NULL DEFAULT 150,
  seats_reserved INTEGER NOT NULL DEFAULT 0,
  booking_open_at TEXT NOT NULL,
  booking_close_at TEXT NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'open', -- 'draft', 'open', 'closed', 'cancelled', 'sold_out'
  seating_mode TEXT NOT NULL DEFAULT 'general_admission', -- 'general_admission', 'numbered'
  ticket_price_display TEXT DEFAULT 'Ingresso Gratuito / Offerta Libera',
  instructions TEXT DEFAULT 'Presentarsi 20 minuti prima dell inizio.',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE
);

-- 5. Blog Posts & Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Notizie',
  published_at TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Compagnia Il Sipario',
  status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published'
  validation_status TEXT NOT NULL DEFAULT 'VALIDATED',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE
);

-- 6. Media Assets (R2 Metadata)
CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  r2_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 7. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH'
  entity_type TEXT NOT NULL, -- 'SHOW', 'PERFORMANCE', 'BLOG_POST', 'MEDIA', 'SITE_CONFIG', 'PAGE'
  entity_id TEXT NOT NULL,
  details_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
