-- Rollback Migration: 0001_sprint2_schema_down.sql
-- Description: Drop all tables created in 0001_sprint2_schema.sql

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS blog_post_categories;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS blog_categories;
DROP TABLE IF EXISTS performances;
DROP TABLE IF EXISTS show_credits;
DROP TABLE IF EXISTS show_media;
DROP TABLE IF EXISTS shows;
DROP TABLE IF EXISTS content_blocks;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
