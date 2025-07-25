import { ChatData, ChatItem } from "../types/chat";

export type ChatMessageContent = {
  toolName: string;
  arguments: Record<string, unknown>;
} | {
  success: boolean;
  data: {
    filePath: string;
    content: string;
    totalLines?: number;
  };
} | string; // 支持普通文本内容

export interface RawChatMessage {
  type: "message" | "finalResponse";
  data:
    | {
        role?: "user" | "assistant";
        content: ChatMessageContent;
      }
    | string;
}

/**
 * 将原始聊天数据转换为前端可渲染的格式
 *
 * 转换规则：
 * 1. 第一个 user 消息：原始用户问题
 * 2. assistant + user 对：AI工具调用 + 工具执行结果
 * 3. finalResponse：最终回复
 *
 * @param rawData 原始聊天数据数组
 * @returns 转换后的聊天数据
 */
export function transformChatData(rawData: RawChatMessage[]): ChatData {
  const items: ChatItem[] = [];
  let pairIndex = 0;

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];

    if (item.type === "finalResponse") {
      // 最终回复
      items.push({
        type: "finalResponse",
        data:
          typeof item.data === "string" ? item.data : JSON.stringify(item.data),
        id: `final-${Date.now()}`,
      });
    } else if (item.type === "message" && typeof item.data === "object") {
      const { role, content } = item.data;

      if (role === "user") {
        if (i === 0) {
          // 第一个用户消息：原始问题
          items.push({
            type: "message",
            data: {
              role: "user",
              content: formatContentToString(content),
            },
            id: `user-initial-${Date.now()}`,
          });
        } else {
          // 后续用户消息：工具执行结果
          items.push({
            type: "message",
            data: {
              role: "user",
              content: formatContentToString(content),
            },
            id: `tool-result-${pairIndex}-${Date.now()}`,
          });
        }
      } else if (role === "assistant") {
        // AI助手消息：工具调用
        items.push({
          type: "message",
          data: {
            role: "assistant",
            content: formatContentToString(content),
          },
          id: `tool-call-${pairIndex}-${Date.now()}`,
        });
        pairIndex++;
      }
    }
  }

  return {
    items,
    metadata: {
      sessionId: `session-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

/**
 * 将ChatMessageContent转换为字符串格式
 */
function formatContentToString(content: ChatMessageContent): string {
  if (typeof content === "string") {
    return content;
  } else if ("toolName" in content) {
    // 工具调用格式
    return `<use_tool>
  <tool_name>${content.toolName}</tool_name>
  <arguments>
    ${JSON.stringify(content.arguments, null, 4)}
  </arguments>
</use_tool>`;
  } else if ("success" in content) {
    // 工具执行结果格式
    return JSON.stringify(content, null, 2);
  }
  return JSON.stringify(content);
}

/**
 * 从工具调用内容中提取工具名称
 */
export function extractToolName(content: string): string {
  const match = content.match(/<tool_name>(.*?)<\/tool_name>/s);
  return match ? match[1].trim() : "Unknown Tool";
}

/**
 * 从工具调用内容中提取参数
 */
export function extractToolArguments(content: string): Record<string, unknown> {
  const match = content.match(/<arguments>(.*?)<\/arguments>/s);
  if (!match) return {};

  try {
    return JSON.parse(match[1].trim());
  } catch {
    return { raw: match[1].trim() };
  }
}

/**
 * 检查内容是否为工具调用
 */
export function isToolCall(content: string): boolean {
  return content.includes("<use_tool>") && content.includes("<tool_name>");
}

/**
 * 检查内容是否为工具执行结果
 */
export function isToolResult(content: string): boolean {
  // 检查是否包含JSON格式的成功/失败标识
  try {
    const parsed = JSON.parse(content);
    return parsed.hasOwnProperty("success");
  } catch {
    return false;
  }
}

/**
 * 从工具结果中提取文件信息
 */
export function extractFileInfo(content: string): Array<{
  filePath: string;
  content: string;
  totalLines?: number;
}> {
  try {
    const parsed = JSON.parse(content);
    if (parsed.success && parsed.data) {
      return [
        {
          filePath: parsed.data.filePath || "",
          content: parsed.data.content || "",
          totalLines: parsed.data.totalLines,
        },
      ];
    }
  } catch {
    // 如果不是标准JSON格式，尝试从文本中提取
  }

  return [];
}

/**
 * 生成对话摘要
 */
export function generateConversationSummary(chatData: ChatData): string {
  const userQuestions = chatData.items.filter(
    (item) =>
      item.type === "message" &&
      typeof item.data === "object" &&
      item.data.role === "user"
  ).length;

  const toolCalls = chatData.items.filter(
    (item) =>
      item.type === "message" &&
      typeof item.data === "object" &&
      item.data.role === "assistant" &&
      isToolCall(item.data.content)
  ).length;

  const hasFinalResponse = chatData.items.some(
    (item) => item.type === "finalResponse"
  );

  return `对话包含 ${userQuestions} 个问题，${toolCalls} 次工具调用${
    hasFinalResponse ? "，已完成" : ""
  }`;
}

/**
 * 验证聊天数据格式
 */
export function validateChatData(rawData: unknown[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(rawData)) {
    errors.push("数据必须是数组格式");
    return { isValid: false, errors };
  }

  if (rawData.length === 0) {
    errors.push("数据不能为空");
    return { isValid: false, errors };
  }

  // 检查第一个项目是否为用户消息
  const firstItem = rawData[0] as Record<string, unknown>;
  if (
    !firstItem ||
    firstItem.type !== "message" ||
    !firstItem.data ||
    (firstItem.data as Record<string, unknown>).role !== "user"
  ) {
    errors.push("第一个消息必须是用户消息");
  }

  // 检查是否有最终回复
  const hasFinalResponse = rawData.some(
    (item) => (item as Record<string, unknown>).type === "finalResponse"
  );
  if (!hasFinalResponse) {
    errors.push("缺少最终回复");
  }

  // 检查助手和用户消息的配对
  let assistantCount = 0;
  let userCount = 0;

  for (const item of rawData) {
    const typedItem = item as Record<string, unknown>;
    if (typedItem.type === "message" && typedItem.data) {
      const data = typedItem.data as Record<string, unknown>;
      if (data.role === "assistant") {
        assistantCount++;
      } else if (data.role === "user") {
        userCount++;
      }
    }
  }

  if (assistantCount !== userCount - 1) {
    errors.push(
      `助手消息(${assistantCount})和用户消息(${userCount})数量不匹配`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
