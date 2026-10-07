import { z } from 'zod';

export const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().max(150).optional().default('Portfolio Inquiry'),
  message: z.string().min(10).max(2000),
});

export const GuestbookSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(3).max(500),
});

export const ChatSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z
    .array(z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string() }))
    .optional()
    .default([]),
});
