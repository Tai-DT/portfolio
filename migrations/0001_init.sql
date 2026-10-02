-- Cloudflare D1 Database Migration: 0001_init.sql
-- Project: taido.dev (Portfolio of Tài Đỗ)

-- 1. Contact Messages: Stores inquiries from the portfolio contact form
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  country TEXT,
  ip TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Guestbook Entries: Live visitor messages and testimonials
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Page Views & Edge Analytics
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL DEFAULT '/',
  country TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial guestbook messages to demonstrate Cloudflare D1 functionality
INSERT INTO guestbook_entries (name, message, avatar_url, created_at) 
VALUES 
  ('Cloudflare Edge Worker', 'Welcome to taido.dev! Serving at the edge with Cloudflare Workers & Cloudflare D1 SQL database.', 'https://avatars.githubusercontent.com/u/314135?s=200&v=4', datetime('now', '-2 hours')),
  ('Alex Rivers', 'Incredible 3D bumblebee companion and seamless time-based themes! Great work on Archify MCP.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', datetime('now', '-1 day'));
