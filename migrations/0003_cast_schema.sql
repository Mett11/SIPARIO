-- Migration: 0003_cast_schema.sql
CREATE TABLE IF NOT EXISTS company_cast (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  bio TEXT,
  shows TEXT
);
