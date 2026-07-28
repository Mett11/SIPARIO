-- Seed Demo Data: seed_demo.sql
-- Description: Populate initial database state for Il Sipario A.P.S.

-- Roles
INSERT INTO roles (id, name, description) VALUES 
('role-admin', 'admin', 'Accesso completo ad ogni risorsa del sistema'),
('role-editor', 'editor', 'Gestione contenuti, spettacoli, cast, blog e media'),
('role-boxoffice', 'box_office', 'Gestione repliche, capienza e check-in prenotazioni')
ON CONFLICT DO NOTHING;

-- Demo Users
-- Password for all demo accounts: 'sipario2026' (mock hash)
INSERT INTO users (id, email, password_hash, full_name, is_active) VALUES
('usr-admin-1', 'admin@ilsipario.it', 'pbkdf2_sha256$sipario2026', 'Amministratore Sipario', 1),
('usr-editor-1', 'editor@ilsipario.it', 'pbkdf2_sha256$sipario2026', 'Elena Guastella (Editor)', 1),
('usr-boxoffice-1', 'boxoffice@ilsipario.it', 'pbkdf2_sha256$sipario2026', 'Cassa e Biglietteria', 1)
ON CONFLICT DO NOTHING;

-- User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
('usr-admin-1', 'role-admin'),
('usr-editor-1', 'role-editor'),
('usr-boxoffice-1', 'role-boxoffice')
ON CONFLICT DO NOTHING;

-- Blog Categories
INSERT INTO blog_categories (id, name, slug) VALUES
('cat-1', 'Notizie & Stagione', 'notizie-stagione'),
('cat-2', 'Dietro le Quinte', 'dietro-le-quinte'),
('cat-3', 'Interviste & Regia', 'interviste-regia')
ON CONFLICT DO NOTHING;

-- Pages
INSERT INTO pages (id, slug, title, status, meta_description) VALUES
('page-home', 'home', 'Home Page Ufficiale', 'published', 'Sito ufficiale dell associazione teatrale Il Sipario A.P.S. Canicattini Bagni'),
('page-compagnia', 'compagnia', 'Chi Siamo & Storia', 'published', 'Storia, premi e componenti dell Associazione Teatrale Il Sipario A.P.S.'),
('page-privacy', 'privacy', 'Privacy & Cookie Policy', 'published', 'Informativa GDPR per la prenotazione biglietti teatrali')
ON CONFLICT DO NOTHING;

-- Audit Logs Initial Record
INSERT INTO audit_logs (id, user_id, user_email, action, entity_type, entity_id, details_json) VALUES
('log-init-1', 'usr-admin-1', 'admin@ilsipario.it', 'CREATE', 'SITE_CONFIG', 'config-1', '{"message": "Inizializzazione completata Sprint 2 CMS"}')
ON CONFLICT DO NOTHING;
