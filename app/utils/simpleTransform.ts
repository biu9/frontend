/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 简化版聊天数据转换函数
 * 
 * 此函数将您提供的格式转换为前端可渲染的ChatData格式
 * 
 * @param rawData 原始聊天数据数组
 * @returns 转换后的聊天数据
 */
export function transformToRenderableFormat(rawData: any[]): any {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    throw new Error('输入数据必须是非空数组');
  }

  const items: any[] = [];
  let messageIndex = 0;

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];
    
    if (!item || !item.type) {
      continue;
    }

    if (item.type === 'finalResponse') {
      // 最终回复
      items.push({
        type: 'finalResponse',
        data: typeof item.data === 'string' ? item.data : JSON.stringify(item.data),
        id: `final-response-${Date.now()}`
      });
    } 
    else if (item.type === 'message' && item.data) {
      const { role, content } = item.data;
      
      if (!role || !content) {
        continue;
      }

      items.push({
        type: 'message',
        data: {
          role,
          content
        },
        id: `message-${messageIndex}-${Date.now()}`
      });
      
      messageIndex++;
    }
  }

  return {
    items,
    metadata: {
      sessionId: `session-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };
}

/**
 * 快速验证数据格式
 */
export function quickValidate(rawData: any[]): boolean {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return false;
  }

  // 检查第一个是否为用户消息
  const firstItem = rawData[0];
  if (!firstItem || 
      firstItem.type !== 'message' || 
      !firstItem.data || 
      firstItem.data.role !== 'user') {
    return false;
  }

  // 检查是否有最终回复
  return rawData.some(item => item && item.type === 'finalResponse');
}

/**
 * 使用示例
 */
export const exampleUsage = `
// 导入函数
import { transformToRenderableFormat, quickValidate } from './utils/simpleTransform';

// 您的原始数据
const rawData = [
  {
    "type": "message",
    "data": {
      "role": "user", 
      "content": "介绍下项目"
    }
  },
  {
    "type": "message",
    "data": {
      "role": "assistant",
      "content": "<use_tool>...</use_tool>"
    }
  },
  {
    "type": "message", 
    "data": {
      "role": "user",
      "content": "{\\"success\\": true, ...}"
    }
  },
  {
    "type": "finalResponse",
    "data": "这是最终回复"
  }
];

// 验证数据
if (quickValidate(rawData)) {
  // 转换数据
  const chatData = transformToRenderableFormat(rawData);
  
  // 使用转换后的数据
  // <ChatContainer data={chatData} />
} else {
  console.error('数据格式不正确');
}
`; 