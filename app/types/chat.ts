/* eslint-disable @typescript-eslint/no-explicit-any */
// 聊天相关的类型定义

export interface ToolCall {
  tool_name: string;
  arguments: Record<string, any>;
}

export interface BatchInvocation {
  tool_name: string;
  input: Record<string, any>;
}

export interface BatchToolCall {
  description: string;
  invocations: BatchInvocation[];
}

export interface FileResult {
  filePath: string;
  content: string;
  success: boolean;
  totalLines?: number;
}

export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  files?: FileResult[];
  batchDescription?: string;
}

export interface ParsedContent {
  normalContent: string;
  toolCalls: ToolCall[];
  toolResults: ToolExecutionResult[];
  hasError: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  parsed?: ParsedContent;
}

export interface ChatItem {
  type: 'message' | 'finalResponse' | 'thinking' | 'error';
  data: ChatMessage | string;
  id?: string;
}

export interface ChatData {
  items: ChatItem[];
  metadata?: {
    sessionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
} 