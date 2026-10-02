'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'Dự án nổi bật nhất của Tài?',
  'Tài làm gì với Model Context Protocol (MCP)?',
  'Kiến trúc Cloudflare D1 & R2 của trang này?',
  'Cách liên hệ phỏng vấn hoặc hợp tác?',
];

export default function KaiAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Xin chào! Tôi là Kai AI, trợ lý ảo đại diện cho Tài Đỗ (Kai). Tôi được hỗ trợ bởi Cloudflare Workers AI (Llama 3.1) chạy trực tiếp tại Edge. Hãy hỏi tôi về các dự án MCP, full-stack, hoặc kỹ năng của Tài!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Xin lỗi, không thể kết nối tới Cloudflare Workers AI lúc này. Vui lòng thử lại sau!',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lỗi mạng khi gọi Cloudflare Workers AI. Vui lòng thử lại!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group border border-primary/30"
            aria-label="Open Kai AI Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-primary-foreground group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight flex items-center gap-1">
                Ask Kai AI <Sparkles className="w-3 h-3 text-amber-300" />
              </span>
              <span className="text-[9px] opacity-80 leading-none">Cloudflare Workers AI</span>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] rounded-2xl bg-card/90 backdrop-blur-xl border border-primary/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 border-b border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
                <FaRobot className="text-sm" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1">
                  Kai AI <span className="text-[10px] text-primary font-mono font-normal">• Llama 3.1</span>
                </h3>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Cloudflare Edge GPU Inference
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close AI Chat"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-[10px] text-primary mt-0.5">
                    🤖
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-md'
                      : 'bg-background/70 border border-primary/10 text-foreground/90 rounded-tl-sm backdrop-blur-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-muted-foreground text-xs pl-8">
                <span className="animate-spin text-primary">●</span>
                <span className="text-[11px]">Kai AI is thinking on Cloudflare Workers AI...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-border/50 bg-background/40 overflow-x-auto flex gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-card hover:bg-primary/15 text-muted-foreground hover:text-foreground border border-border/60 transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-primary/20 bg-background/60 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Tài's projects & skills..."
              disabled={isLoading}
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-card border border-input focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            <Button type="submit" size="sm" disabled={isLoading || !input.trim()} className="rounded-xl px-3">
              <FaPaperPlane className="text-xs" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
