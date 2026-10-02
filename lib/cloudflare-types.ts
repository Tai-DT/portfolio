// Cloudflare Bindings Definition for Hono, D1, R2, and Workers AI

import { D1DatabaseBinding } from './db';

export interface R2ObjectMetadata {
  key: string;
  size: number;
  etag: string;
  uploaded: Date;
  httpMetadata?: {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
  };
}

export interface R2ObjectBody extends R2ObjectMetadata {
  body: ReadableStream;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
}

export interface R2BucketBinding {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob | null,
    options?: {
      httpMetadata?: {
        contentType?: string;
        contentLanguage?: string;
        contentDisposition?: string;
      };
      customMetadata?: Record<string, string>;
    }
  ): Promise<R2ObjectMetadata>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(keys: string | string[]): Promise<void>;
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
    delimiter?: string;
  }): Promise<{
    objects: R2ObjectMetadata[];
    truncated: boolean;
    cursor?: string;
  }>;
}

export interface WorkersAiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface WorkersAiBinding {
  run(
    model: string,
    inputs: {
      messages?: WorkersAiChatMessage[];
      prompt?: string;
      max_tokens?: number;
      stream?: boolean;
    } | Record<string, unknown>
  ): Promise<{ response?: string } | unknown>;
}

export interface CloudflareEnv {
  DB?: D1DatabaseBinding;
  R2_BUCKET?: R2BucketBinding;
  AI?: WorkersAiBinding;
  SITE_DOMAIN?: string;
  OWNER_NAME?: string;
}
