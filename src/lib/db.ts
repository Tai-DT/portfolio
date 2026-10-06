// Cloudflare D1 Database Client & Fallback for Local Development
// Provides unified data operations whether running on Cloudflare Workers/Pages with D1 or locally

export interface D1PreparedStatement {
  bind(...args: unknown[]): {
    run(): Promise<{ meta?: { last_row_id?: number } }>;
    all<T = unknown>(): Promise<{ results?: T[] }>;
  };
  run(): Promise<{ meta?: { last_row_id?: number } }>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
}

export interface D1DatabaseBinding {
  prepare(query: string): D1PreparedStatement;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
  country?: string;
  ip?: string;
}

export interface GuestbookEntry {
  id: number;
  name: string;
  email?: string;
  message: string;
  avatar_url?: string;
  created_at: string;
}

export interface GuestbookInput {
  name: string;
  email?: string;
  message: string;
  avatar_url?: string;
}

// In-memory fallback for local development when Cloudflare D1 binding is not connected
const localGuestbookStore: GuestbookEntry[] = [
  {
    id: 1,
    name: 'Cloudflare Edge Worker',
    message: 'Welcome to taido.dev! Serving at the edge with Cloudflare Workers & Cloudflare D1 SQL database.',
    avatar_url: 'https://avatars.githubusercontent.com/u/314135?s=200&v=4',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 2,
    name: 'Alex Rivers',
    message: 'Incredible 3D bumblebee companion and seamless time-based themes! Great work on Archify MCP.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

const localContactStore: (ContactMessageInput & { id: number; created_at: string })[] = [];

/**
 * Saves a contact message to Cloudflare D1, or local store in dev mode.
 */
export async function saveContactMessage(
  data: ContactMessageInput,
  d1?: D1DatabaseBinding | null
): Promise<{ success: boolean; id: number; message: string }> {
  try {
    if (d1 && typeof d1.prepare === 'function') {
      const result = await d1
        .prepare(
          `INSERT INTO contact_messages (name, email, subject, message, country, ip) 
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.name,
          data.email,
          data.subject || 'Portfolio Inquiry',
          data.message,
          data.country || 'Unknown',
          data.ip || 'Anonymous'
        )
        .run();

      const insertId = result?.meta?.last_row_id || Date.now();
      return {
        success: true,
        id: insertId,
        message: 'Message delivered to Cloudflare D1 successfully!'
      };
    }

    // Local in-memory fallback
    const id = localContactStore.length + 1;
    localContactStore.push({
      ...data,
      id,
      created_at: new Date().toISOString()
    });

    return {
      success: true,
      id,
      message: 'Message saved successfully (local dev store).'
    };
  } catch (error) {
    console.error('Error saving contact message:', error);
    throw error;
  }
}

/**
 * Fetches recent guestbook entries from Cloudflare D1 or local store.
 */
export async function getGuestbookEntries(
  d1?: D1DatabaseBinding | null,
  limit: number = 30
): Promise<GuestbookEntry[]> {
  try {
    if (d1 && typeof d1.prepare === 'function') {
      const { results } = await d1
        .prepare(
          `SELECT id, name, email, message, avatar_url, created_at 
           FROM guestbook_entries 
           ORDER BY id DESC 
           LIMIT ?`
        )
        .bind(limit)
        .all<GuestbookEntry>();

      return results || [];
    }

    // Return in-memory fallback sorted newest first
    return [...localGuestbookStore].sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error('Error fetching guestbook:', error);
    return localGuestbookStore;
  }
}

/**
 * Appends a new guestbook entry into Cloudflare D1.
 */
export async function addGuestbookEntry(
  data: GuestbookInput,
  d1?: D1DatabaseBinding | null
): Promise<GuestbookEntry> {
  try {
    const avatar = data.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.name)}`;

    if (d1 && typeof d1.prepare === 'function') {
      const result = await d1
        .prepare(
          `INSERT INTO guestbook_entries (name, email, message, avatar_url) 
           VALUES (?, ?, ?, ?)`
        )
        .bind(data.name, data.email || null, data.message, avatar)
        .run();

      const insertId = result?.meta?.last_row_id || Date.now();
      return {
        id: insertId,
        name: data.name,
        email: data.email,
        message: data.message,
        avatar_url: avatar,
        created_at: new Date().toISOString()
      };
    }

    // Local fallback
    const newEntry: GuestbookEntry = {
      id: localGuestbookStore.length + 1,
      name: data.name,
      email: data.email,
      message: data.message,
      avatar_url: avatar,
      created_at: new Date().toISOString()
    };
    localGuestbookStore.unshift(newEntry);
    return newEntry;
  } catch (error) {
    console.error('Error inserting guestbook entry:', error);
    throw error;
  }
}

/**
 * Records page view analytics in Cloudflare D1.
 */
export async function recordPageView(
  info: { path: string; country?: string; referrer?: string; user_agent?: string },
  d1?: D1DatabaseBinding | null
): Promise<void> {
  try {
    if (d1 && typeof d1.prepare === 'function') {
      await d1
        .prepare(
          `INSERT INTO page_views (path, country, referrer, user_agent) 
           VALUES (?, ?, ?, ?)`
        )
        .bind(
          info.path || '/',
          info.country || 'Unknown',
          info.referrer || null,
          info.user_agent || null
        )
        .run();
    }
  } catch (err) {
    console.warn('PageView recording skipped:', err);
  }
}
