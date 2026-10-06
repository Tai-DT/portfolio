export const KAI_SYSTEM_PROMPT = `You are "Kai AI", the intelligent, friendly, and articulate personal AI assistant of Tài Đỗ (Kai).
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
  2. Full-Stack Cloudflare Edge: Astro, React, Cloudflare D1 (SQL), Cloudflare R2, Cloudflare Workers AI.
  3. Native Apple Platforms & Mobile: Swift, SwiftUI for macOS & iOS (EchoLens Android-to-Mac real-time H.264 streaming with Liquid Glass UI; DataShuttle high-speed data shuttle utility).
  4. Backend Microservices: Go (Gin framework), Python (FastAPI), PostgreSQL.
  5. EdTech & Open Source: AISTEM X (global STEM & scholarship platform), Google Play Closed Testing guide.

Tone: Professional, enthusiastic, helpful, and concise. You can reply in either Vietnamese or English depending on the language the user speaks. If asked how to hire or contact Tài, invite them to use the Contact form or email contact@taido.dev.`;

export function kaiFallbackReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('dự án') || lower.includes('project') || lower.includes('mcp')) {
    return `Tài Đỗ có nhiều dự án nổi bật trên GitHub (Tai-DT), tiêu biểu là:
1. **Archify MCP**: Máy chủ Model Context Protocol với 23 công cụ chuyên sâu về phân tích kiến trúc, chọn tech stack và ước lượng chi phí.
2. **Codex Desk**: Ứng dụng Desktop quản lý nhiều tài khoản ChatGPT Plus & Codex (15★ stars).
3. **EchoLens**: Tiện ích streaming camera & mic Android lên Mac với giao diện macOS Liquid Glass.
4. **Huế Travel**: Nền tảng du lịch full-stack với backend Go (Gin) và mobile app React Native.
Bạn có thể xem chi tiết trong mục Projects ngay trên trang taido.dev!`;
  }
  if (lower.includes('kỹ năng') || lower.includes('skill') || lower.includes('ngôn ngữ') || lower.includes('tech')) {
    return `Tài Đỗ chuyên sâu về:
- **AI & MCP**: Model Context Protocol, Multi-agent LLM workflows.
- **Frontend & Web**: Astro, Next.js, React, TypeScript, Tailwind CSS v4, Three.js 3D.
- **Backend & Cloudflare**: Cloudflare Workers, Cloudflare D1 SQL, Cloudflare R2, Go (Gin), Python.
- **Native & Mobile**: Swift, SwiftUI (macOS & iOS), React Native.`;
  }
  if (lower.includes('liên hệ') || lower.includes('contact') || lower.includes('email') || lower.includes('thuê') || lower.includes('hire')) {
    return `Bạn có thể liên hệ trực tiếp với Tài Đỗ qua email **contact@taido.dev**, GitHub **github.com/Tai-DT**, hoặc gửi tin nhắn ngay tại form "Get In Touch" để dữ liệu được lưu trực tiếp vào Cloudflare D1 nhé!`;
  }
  return `Chào bạn! Tôi là trợ lý AI đại diện cho Tài Đỗ (Kai). Tôi có thể giải đáp thông tin về các dự án AI & MCP (Archify MCP, Codex Desk), các ứng dụng Swift/macOS (EchoLens), kiến trúc Cloudflare D1/R2/Workers, hoặc cách liên hệ hợp tác với Tài. Bạn muốn hỏi điều gì?`;
}
