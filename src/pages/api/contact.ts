import type { APIRoute } from 'astro';
import { ContactSchema } from '../../lib/schemas';
import { saveContactMessage } from '../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const validation = ContactSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { success: false, error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;
    const country = request.headers.get('cf-ipcountry') || 'Unknown';
    const ip = request.headers.get('cf-connecting-ip') || 'Anonymous';
    const env = locals.runtime?.env;

    const result = await saveContactMessage({ name, email, subject, message, country, ip }, env?.DB);

    return Response.json(
      { success: true, message: 'Your message has been stored in Cloudflare D1!', id: result.id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Contact Error:', err);
    return Response.json(
      { success: false, error: 'Failed to process message. Please email contact@taido.dev directly.' },
      { status: 500 }
    );
  }
};
