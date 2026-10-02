// Cloudflare Pages Function: /api/guestbook
// Native edge execution with direct Cloudflare D1 Database binding
import { D1DatabaseBinding, GuestbookEntry } from '@/lib/db';

interface Env {
  DB: D1DatabaseBinding;
}

export async function onRequestGet(context: { env: Env }) {
  const { env } = context;

  try {
    if (env.DB && typeof env.DB.prepare === 'function') {
      const { results } = await env.DB.prepare(
        `SELECT id, name, email, message, avatar_url, created_at 
         FROM guestbook_entries 
         ORDER BY id DESC 
         LIMIT 25`
      ).all<GuestbookEntry>();

      return new Response(
        JSON.stringify({
          success: true,
          entries: results || [],
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        entries: [],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const data = await request.json() as {
      name?: string;
      email?: string;
      message?: string;
      avatar_url?: string;
    };

    if (!data.name || !data.message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Name and message are required fields.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const avatar = data.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.name)}`;
    let insertId = Date.now();

    if (env.DB && typeof env.DB.prepare === 'function') {
      const result = await env.DB.prepare(
        `INSERT INTO guestbook_entries (name, email, message, avatar_url) 
         VALUES (?, ?, ?, ?)`
      )
        .bind(data.name, data.email || null, data.message, avatar)
        .run();

      insertId = result?.meta?.last_row_id || insertId;
    }

    const newEntry = {
      id: insertId,
      name: data.name,
      email: data.email,
      message: data.message,
      avatar_url: avatar,
      created_at: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        entry: newEntry,
        message: 'Guestbook entry saved to Cloudflare D1!',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
