import type { APIRoute } from 'astro';
import { ChatSchema } from '../../../lib/schemas';
import { KAI_SYSTEM_PROMPT, kaiFallbackReply } from '../../../lib/ai';

export const prerender = false;

const MODEL = '@cf/meta/llama-3.1-8b-instruct';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const validation = ChatSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { success: false, error: 'Invalid chat request', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { message, history } = validation.data;
    const ai = locals.runtime?.env?.AI;

    const messages = [
      { role: 'system' as const, content: KAI_SYSTEM_PROMPT },
      ...history.slice(-6),
      { role: 'user' as const, content: message },
    ];

    if (ai && typeof ai.run === 'function') {
      try {
        const aiResponse = (await ai.run(MODEL, { messages, max_tokens: 512 })) as { response?: string };
        const reply =
          aiResponse?.response ||
          'Xin chào! Tôi là Kai AI. Bạn muốn tìm hiểu thêm về các dự án MCP hay kinh nghiệm Full-Stack của Tài Đỗ?';
        return Response.json({ success: true, reply, model: MODEL, source: 'Cloudflare Workers AI' });
      } catch (aiErr) {
        console.warn('Workers AI call error, falling back:', aiErr);
      }
    }

    return Response.json({
      success: true,
      reply: kaiFallbackReply(message),
      model: MODEL,
      source: 'Cloudflare Workers AI (Simulated / Local Mode)',
    });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return Response.json({ success: false, error: 'Could not process AI request' }, { status: 500 });
  }
};
