import {
  transformChatData,
  validateChatData,
  generateConversationSummary,
  RawChatMessage,
} from "./dataTransformer";

// 您提供的原始数据格式示例
const rawChatData: RawChatMessage[] = [
  {
    type: "message",
    data: {
      role: "user",
      content: "介绍下项目的chatMessage渲染方式",
    },
  },
  {
    type: "message",
    data: {
      role: "assistant",
      content:
        '<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/MessageItem.tsx"}\n  </arguments>\n</use_tool>',
    },
  },
  {
    type: "message",
    data: {
      role: "user",
      content:
        '{"success":true,"data":{"filePath":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/MessageItem.tsx","content":"\'use client\';\\n\\nimport React from \'react\';"}}',
    },
  },
  {
    type: "message",
    data: {
      role: "assistant",
      content:
        '<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/ToolCallVisualization.tsx"}\n  </arguments>\n</use_tool>',
    },
  },
  {
    type: "message",
    data: {
      role: "user",
      content:
        '{"success":true,"data":{"filePath":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/ToolCallVisualization.tsx","content":"\'use client\';"}}',
    },
  },
  {
    type: "finalResponse",
    data: "项目使用MessageItem组件渲染聊天消息，主要特点：\n\n1. 区分用户和AI助手消息，使用不同样式和头像\n2. 解析消息内容，识别普通文本、工具调用和执行结果\n3. 工具调用通过ToolCallVisualization组件展示，支持展开/收起\n4. 文件读取结果用FileViewer组件显示，支持预览和完整查看\n5. 使用Ant Design组件构建UI，包含时间戳、状态标签等\n6. 根据消息类型应用不同背景色和视觉效果",
  },
];

/**
 * 使用示例：转换聊天数据
 */
export function exampleTransformData() {
  // 1. 验证数据格式
  const validation = validateChatData(rawChatData);
  if (!validation.isValid) {
    console.error("数据格式验证失败:", validation.errors);
    return null;
  }

  // 2. 转换数据格式
  const transformedData = transformChatData(rawChatData);

  // 3. 生成对话摘要
  const summary = generateConversationSummary(transformedData);

  console.log("转换后的数据:", transformedData);
  console.log("对话摘要:", summary);

  return transformedData;
}

/**
 * 处理动态数据的通用函数
 */
export function processAndTransformChatData(rawData: unknown[]): {
  success: boolean;
  data?: unknown;
  summary?: string;
  error?: string;
  timestamp: string;
} {
  try {
    // 验证数据
    const validation = validateChatData(rawData);
    if (!validation.isValid) {
      throw new Error(`数据验证失败: ${validation.errors.join(", ")}`);
    }

    // 转换数据
    const transformed = transformChatData(rawData as RawChatMessage[]);

    return {
      success: true,
      data: transformed,
      summary: generateConversationSummary(transformed),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 批量处理多个聊天会话
 */
export function batchProcessChatSessions(sessions: unknown[][]): Array<{
  sessionId: string;
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  return sessions.map((sessionData, index) => {
    const result = processAndTransformChatData(sessionData);
    return {
      sessionId: `session-${index + 1}`,
      ...result,
    };
  });
}

// 导出主要的转换函数供外部使用
export { transformChatData, validateChatData } from "./dataTransformer";
