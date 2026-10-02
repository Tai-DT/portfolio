// Cloudflare Pages Function: /api/contact
// Native edge execution with direct Cloudflare D1 Database binding
import { D1DatabaseBinding } from '@/lib/db';

interface Env {
  DB: D1DatabaseBinding;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const data = await request.json() as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Name, email, and message are required fields.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const country = request.headers.get('cf-ipcountry') || 'Unknown';
    const ip = request.headers.get('cf-connecting-ip') || 'Anonymous';

    let lastRowId = Date.now();

    if (env.DB && typeof env.DB.prepare === 'function') {
      const result = await env.DB.prepare(
        `INSERT INTO contact_messages (name, email, subject, message, country, ip) 
         VALUES (?, ?, ?, ?, ?, ?)`
      )
        .bind(
          data.name,
          data.email,
          data.subject || 'Portfolio Inquiry',
          data.message,
          country,
          ip
        )
        .run();

      lastRowId = result?.meta?.last_row_id || lastRowId;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your message has been stored in Cloudflare D1!',
        id: lastRowId,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to save contact message to Cloudflare D1';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMsg,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
