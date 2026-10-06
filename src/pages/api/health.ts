import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  const cfRay = request.headers.get('cf-ray');
  return Response.json({
    status: 'ok',
    framework: 'Astro',
    edge: true,
    domain: env?.SITE_DOMAIN || 'taido.dev',
    database: env?.DB ? 'Cloudflare D1 (Active)' : 'Local Fallback',
    ai: env?.AI ? 'Cloudflare Workers AI (Active)' : 'Simulated/Ready',
    edgeRegion: cfRay ? cfRay.split('-')[1] : 'local',
    time: new Date().toISOString(),
  });
};
