// Cloudflare Pages Catch-All Function powered by Hono
// Directly bridges Cloudflare D1, R2, and Workers AI bindings into Hono routes

import { app } from '@/lib/hono-app';
import { CloudflareEnv } from '@/lib/cloudflare-types';

export async function onRequest(context: {
  request: Request;
  env: CloudflareEnv;
}) {
  return app.fetch(context.request, context.env);
}
