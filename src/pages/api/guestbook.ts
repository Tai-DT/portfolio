import type { APIRoute } from 'astro';
import { GuestbookSchema } from '../../lib/schemas';
import { addGuestbookEntry, getGuestbookEntries } from '../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const entries = await getGuestbookEntries(locals.runtime?.env?.DB, 30);
    return Response.json({ success: true, entries });
  } catch (err) {
    console.error('Guestbook GET Error:', err);
    return Response.json({ success: false, error: 'Could not load guestbook' }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const validation = GuestbookSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { success: false, error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, message } = validation.data;
    const entry = await addGuestbookEntry(
      { name, email: email || undefined, message },
      locals.runtime?.env?.DB
    );

    return Response.json(
      { success: true, entry, message: 'Guestbook entry stored in Cloudflare D1!' },
      { status: 201 }
    );
  } catch (err) {
    console.error('Guestbook POST Error:', err);
    return Response.json({ success: false, error: 'Failed to post to guestbook' }, { status: 500 });
  }
};
