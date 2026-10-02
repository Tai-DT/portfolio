// Hono Web Application configured for Cloudflare Workers & Pages
// Integrates: Hono Framework + Cloudflare D1 SQL + Cloudflare R2 Object Storage + Cloudflare Workers AI

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { CloudflareEnv, WorkersAiChatMessage } from './cloudflare-types';
import {
  saveContactMessage,
  getGuestbookEntries,
  addGuestbookEntry,
} from './db';
import { PERSONAL_INFO, PROJECTS } from './portfolio-data';

export const app = new Hono<{ Bindings: CloudflareEnv }>().basePath('/api');

// Enable CORS for API routes
app.use('*', cors());

// Helper to get bindings safely from either Hono context or process.env
function getBindings(c: { env?: CloudflareEnv }): CloudflareEnv {
  const envObj = (c.env || {}) as CloudflareEnv;
  const globalObj = (globalThis as unknown as { __env__?: CloudflareEnv }).__env__ || {};
  const procEnv = (process.env as unknown as CloudflareEnv) || {};

  return {
    DB: envObj.DB || globalObj.DB || procEnv.DB,
    R2_BUCKET: envObj.R2_BUCKET || globalObj.R2_BUCKET || procEnv.R2_BUCKET,
    AI: envObj.AI || globalObj.AI || procEnv.AI,
    SITE_DOMAIN: envObj.SITE_DOMAIN || 'taido.dev',
    OWNER_NAME: envObj.OWNER_NAME || 'Tài Đỗ (Kai)',
  };
}

// ---------------------------------------------------------------------
// 1. Health & Edge Stats (Cloudflare Edge + D1 + R2 + AI status)
// ---------------------------------------------------------------------
app.get('/stats', (c) => {
  const env = getBindings(c);
  const cfRay = c.req.header('cf-ray');
  const cfColo = cfRay ? cfRay.split('-')[1] : 'Cloudflare Edge';
  const country = c.req.header('cf-ipcountry') || 'VN';

  return c.json({
    success: true,
    stats: {
      developer: PERSONAL_INFO.name,
      fullName: PERSONAL_INFO.fullName,
      role: PERSONAL_INFO.role,
      domain: PERSONAL_INFO.domain,
      publicRepos: PERSONAL_INFO.stats.publicRepos,
      featuredProjectsCount: PROJECTS.filter((p) => p.featured).length,
      totalProjectsCount: PROJECTS.length,
      backend: 'Hono v4 (Edge Optimized)',
      database: env.DB ? 'Cloudflare D1 (Active)' : 'Cloudflare D1 (Local Fallback)',
      storage: env.R2_BUCKET ? 'Cloudflare R2 (Active)' : 'Cloudflare R2 (Configured)',
      ai: env.AI ? 'Cloudflare Workers AI (Active)' : 'Cloudflare Workers AI (Simulated/Ready)',
      edgeRegion: cfColo,
      visitorCountry: country,
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    framework: 'Hono',
    edge: true,
    domain: 'taido.dev',
    time: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------
// 2. Contact Inquiries (Cloudflare D1)
// ---------------------------------------------------------------------
const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().max(150).optional().default('Portfolio Inquiry'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

app.post('/contact', async (c) => {
  try {
    const body = await c.req.json();
    const validation = ContactSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        400
      );
    }

    const { name, email, subject, message } = validation.data;
    const env = getBindings(c);
    const country = c.req.header('cf-ipcountry') || 'Unknown';
    const ip = c.req.header('cf-connecting-ip') || 'Anonymous';

    const result = await saveContactMessage(
      { name, email, subject, message, country, ip },
      env.DB
    );

    return c.json(
      {
        success: true,
        message: 'Your message has been stored in Cloudflare D1!',
        id: result.id,
      },
      201
    );
  } catch (err: unknown) {
    console.error('Hono Contact Error:', err);
    return c.json(
      {
        success: false,
        error: 'Failed to process message. Please email contact@taido.dev directly.',
      },
      500
    );
  }
});

// ---------------------------------------------------------------------
// 3. Live Guestbook (Cloudflare D1)
// ---------------------------------------------------------------------
const GuestbookSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  message: z.string().min(3, 'Message must be at least 3 characters').max(500),
});

app.get('/guestbook', async (c) => {
  try {
    const env = getBindings(c);
    const entries = await getGuestbookEntries(env.DB, 30);
    return c.json({ success: true, entries });
  } catch (err: unknown) {
    console.error('Hono Guestbook GET Error:', err);
    return c.json({ success: false, error: 'Could not load guestbook' }, 500);
  }
});

app.post('/guestbook', async (c) => {
  try {
    const body = await c.req.json();
    const validation = GuestbookSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        400
      );
    }

    const { name, email, message } = validation.data;
    const env = getBindings(c);

    const newEntry = await addGuestbookEntry(
      { name, email: email || undefined, message },
      env.DB
    );

    return c.json(
      {
        success: true,
        entry: newEntry,
        message: 'Guestbook entry stored in Cloudflare D1!',
      },
      201
    );
  } catch (err: unknown) {
    console.error('Hono Guestbook POST Error:', err);
    return c.json({ success: false, error: 'Failed to post to guestbook' }, 500);
  }
});

// ---------------------------------------------------------------------
// 4. Cloudflare Workers AI: Interactive Portfolio Chatbot
// ---------------------------------------------------------------------
const ChatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

const SYSTEM_PROMPT = `You are "Kai AI", the intelligent, friendly, and articulate personal AI assistant of Tài Đỗ (Kai).
Your task is to answer visitors' questions about Tài Đỗ accurately and concisely.

Factual Information about Tài Đỗ (Kai):
- Full Name: Tài Đỗ (Kai)
- Role: Full-Stack Developer & AI Systems Engineer
- Location: Ho Chi Minh City, Vietnam
- Production Domain: taido.dev
- GitHub Profile: https://github.com/Tai-DT (38+ public repositories)
- Contact Email: contact@taido.dev
- Core Specializations:
  1. AI & Agentic Tooling: Creator of "Archify MCP" (23-tool Model Context Protocol server for tech stack analysis, architecture design, and cloud cost planning), "Codex Desk" (cross-platform ChatGPT Plus & Codex manager with 15★ stars), multi-agent LLM workflows.
  2. Full-Stack Cloudflare Edge: Next.js 15, React 19, Hono web framework, Cloudflare D1 (SQL), Cloudflare R2, Cloudflare Workers AI.
  3. Native Apple Platforms & Mobile: Swift, SwiftUI for macOS & iOS (EchoLens Android-to-Mac real-time H.264 streaming with Liquid Glass UI; DataShuttle high-speed data shuttle utility).
  4. Backend Microservices: Go (Gin framework), Python (FastAPI), PostgreSQL.
  5. EdTech & Open Source: AISTEM X (global STEM & scholarship platform), Google Play Closed Testing guide.

Tone: Professional, enthusiastic, helpful, and concise. You can reply in either Vietnamese or English depending on the language the user speaks. If asked how to hire or contact Tài, invite them to use the Contact form or email contact@taido.dev.`;

app.post('/ai/chat', async (c) => {
  try {
    const body = await c.req.json();
    const validation = ChatSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        {
          success: false,
          error: 'Invalid chat request',
          details: validation.error.flatten().fieldErrors,
        },
        400
      );
    }

    const { message, history } = validation.data;
    const env = getBindings(c);

    // Prepare message history for Workers AI
    const messages: WorkersAiChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6),
      { role: 'user', content: message },
    ];

    // If Cloudflare Workers AI binding is available, run serverless inference on edge GPUs
    if (env.AI && typeof env.AI.run === 'function') {
      try {
        const aiResponse = (await env.AI.run(
          '@cf/meta/llama-3.1-8b-instruct',
          {
            messages,
            max_tokens: 512,
          }
        )) as { response?: string };

        const reply =
          aiResponse?.response ||
          'Xin chào! Tôi là Kai AI. Bạn muốn tìm hiểu thêm về các dự án MCP hay kinh nghiệm Full-Stack của Tài Đỗ?';

        return c.json({
          success: true,
          reply,
          model: '@cf/meta/llama-3.1-8b-instruct',
          source: 'Cloudflare Workers AI',
        });
      } catch (aiErr) {
        console.warn('Workers AI call error, falling back to heuristic engine:', aiErr);
      }
    }

    // Intelligent local fallback when testing outside Cloudflare edge or binding pending
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('dự án') || lower.includes('project') || lower.includes('mcp')) {
      reply = `Tài Đỗ có nhiều dự án nổi bật trên GitHub (Tai-DT), tiêu biểu là:
1. **Archify MCP**: Máy chủ Model Context Protocol với 23 công cụ chuyên sâu về phân tích kiến trúc, chọn tech stack và ước lượng chi phí.
2. **Codex Desk**: Ứng dụng Desktop quản lý nhiều tài khoản ChatGPT Plus & Codex (15★ stars).
3. **EchoLens**: Tiện ích streaming camera & mic Android lên Mac với giao diện macOS Liquid Glass.
4. **Huế Travel**: Nền tảng du lịch full-stack với backend Go (Gin) và mobile app React Native.
Bạn có thể xem chi tiết trong mục Projects ngay trên trang taido.dev!`;
    } else if (lower.includes('kỹ năng') || lower.includes('skill') || lower.includes('ngôn ngữ') || lower.includes('tech')) {
      reply = `Tài Đỗ chuyên sâu về:
- **AI & MCP**: Model Context Protocol, Multi-agent LLM workflows.
- **Frontend & Web**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Three.js 3D.
- **Backend & Cloudflare**: Hono, Cloudflare Workers, Cloudflare D1 SQL, Cloudflare R2, Go (Gin), Python.
- **Native & Mobile**: Swift, SwiftUI (macOS & iOS), React Native.`;
    } else if (lower.includes('liên hệ') || lower.includes('contact') || lower.includes('email') || lower.includes('thuê') || lower.includes('hire')) {
      reply = `Bạn có thể liên hệ trực tiếp với Tài Đỗ qua email **contact@taido.dev**, GitHub **github.com/Tai-DT**, hoặc gửi tin nhắn ngay tại form "Get In Touch" bên dưới để dữ liệu được lưu trực tiếp vào Cloudflare D1 nhé!`;
    } else {
      reply = `Chào bạn! Tôi là trợ lý AI đại diện cho Tài Đỗ (Kai). Tôi có thể giải đáp thông tin về các dự án AI & MCP (Archify MCP, Codex Desk), các ứng dụng Swift/macOS (EchoLens), kiến trúc Cloudflare D1/R2/Workers, hoặc cách liên hệ hợp tác với Tài. Bạn muốn hỏi điều gì?`;
    }

    return c.json({
      success: true,
      reply,
      model: '@cf/meta/llama-3.1-8b-instruct',
      source: 'Cloudflare Workers AI (Simulated / Local Mode)',
    });
  } catch (err: unknown) {
    console.error('AI Chat Error:', err);
    return c.json(
      { success: false, error: 'Could not process AI request' },
      500
    );
  }
});

// ---------------------------------------------------------------------
// 5. Cloudflare R2 Object Storage: File Management & CV Serving
// ---------------------------------------------------------------------

// List files in R2 bucket
app.get('/r2/files', async (c) => {
  const env = getBindings(c);

  if (!env.R2_BUCKET || typeof env.R2_BUCKET.list !== 'function') {
    return c.json({
      success: true,
      files: [
        {
          key: 'cv.pdf',
          size: 148520,
          uploaded: new Date().toISOString(),
          contentType: 'application/pdf',
          note: 'Local simulated file',
        },
      ],
      storage: 'Cloudflare R2 (Simulated mode)',
    });
  }

  try {
    const listing = await env.R2_BUCKET.list({ limit: 50 });
    const files = listing.objects.map((obj) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
      contentType: obj.httpMetadata?.contentType || 'application/octet-stream',
    }));

    return c.json({ success: true, files, storage: 'Cloudflare R2' });
  } catch (err: unknown) {
    console.error('R2 list error:', err);
    return c.json({ success: false, error: 'Could not list R2 files' }, 500);
  }
});

// Download / Stream a file from Cloudflare R2
app.get('/r2/file/:key', async (c) => {
  const key = c.req.param('key');
  const env = getBindings(c);

  if (!env.R2_BUCKET || typeof env.R2_BUCKET.get !== 'function') {
    if (key === 'cv.pdf') {
      return c.redirect('/cv.pdf');
    }
    return c.json({ error: 'R2 bucket binding not available in local environment' }, 404);
  }

  try {
    const object = await env.R2_BUCKET.get(key);
    if (!object) {
      return c.json({ error: `File '${key}' not found in Cloudflare R2` }, 404);
    }

    const headers = new Headers();
    if (object.httpMetadata?.contentType) {
      headers.set('Content-Type', object.httpMetadata.contentType);
    }
    headers.set('ETag', object.etag);
    headers.set('Cache-Control', 'public, max-age=3600');

    return new Response(object.body, { headers });
  } catch (err: unknown) {
    console.error('R2 get error:', err);
    return c.json({ error: 'Failed to retrieve file from R2' }, 500);
  }
});

// Upload a file to Cloudflare R2
app.post('/r2/upload', async (c) => {
  const env = getBindings(c);

  if (!env.R2_BUCKET || typeof env.R2_BUCKET.put !== 'function') {
    return c.json(
      {
        success: false,
        error: 'Cloudflare R2 bucket is not configured. Please bind R2_BUCKET in wrangler.jsonc or Cloudflare Dashboard.',
      },
      503
    );
  }

  try {
    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'Please upload a valid file field' }, 400);
    }

    const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const arrayBuffer = await file.arrayBuffer();

    await env.R2_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    return c.json(
      {
        success: true,
        message: 'File uploaded to Cloudflare R2 successfully!',
        key,
        url: `/api/r2/file/${key}`,
        size: file.size,
      },
      201
    );
  } catch (err: unknown) {
    console.error('R2 upload error:', err);
    return c.json({ success: false, error: 'Failed to upload to Cloudflare R2' }, 500);
  }
});
