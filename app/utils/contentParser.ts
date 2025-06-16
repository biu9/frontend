// 内容解析工具函数
import { ToolCall, ToolExecutionResult, ParsedContent, FileResult } from '../types/chat';

interface RawChatMessage {
  type: 'message' | 'finalResponse';
  data: {
    role?: 'user' | 'assistant';
    content: string;
  } | string;
}

/**
 * 解析工具调用XML
 */
export function parseToolCall(xml: string): ToolCall | null {
  try {
    const toolNameMatch = xml.match(/<tool_name>(.*?)<\/tool_name>/s);
    const toolName = toolNameMatch ? toolNameMatch[1].trim() : null;
    
    if (!toolName) return null;
    
    const argumentsMatch = xml.match(/<arguments>(.*?)<\/arguments>/s);
    let arguments_data = {};
    
    if (argumentsMatch) {
      try {
        arguments_data = JSON.parse(argumentsMatch[1].trim());
      } catch {
        // 如果JSON解析失败，保存原始字符串
        arguments_data = { raw: argumentsMatch[1].trim() };
      }
    }
    
    return {
      tool_name: toolName,
      arguments: arguments_data
    };
  } catch (error) {
    console.error('解析工具调用失败:', error);
    return null;
  }
}

/**
 * 解析工具执行结果
 */
export function parseToolResult(content: string): ToolExecutionResult[] {
  const results: ToolExecutionResult[] = [];
  
  // 解析批量操作结果
  const batchMatch = content.match(/Batch operation "([^"]*)" completed in \d+ms\./);
  if (batchMatch) {
    const batchDescription = batchMatch[1];
    const fileResults = parseFileResults(content);
    
    results.push({
      success: true,
      batchDescription,
      files: fileResults
    });
  }
  
  // 解析单个文件读取结果
  if (!batchMatch && content.includes('FileReadTool(')) {
    const fileResults = parseFileResults(content);
    if (fileResults.length > 0) {
      results.push({
        success: true,
        files: fileResults
      });
    }
  }
  
  // 解析JSON格式的结果
  try {
    const jsonMatch = content.match(/\{.*"success".*\}/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.success !== undefined) {
        results.push({
          success: parsed.success,
          data: parsed.data,
          error: parsed.error
        });
      }
    }
  } catch {
    // JSON解析失败，忽略
  }
  
  return results;
}

/**
 * 解析文件读取结果
 */
export function parseFileResults(content: string): FileResult[] {
  const results: FileResult[] = [];
  
  // 匹配 FileReadTool 执行结果
  const fileReadMatches = content.match(/FileReadTool\(file_path: "([^"]*?)"\): (✅|❌)\s*(\{.*?\})/gs);
  
  if (fileReadMatches) {
    for (const match of fileReadMatches) {
      const pathMatch = match.match(/file_path: "([^"]*?)"/);
      const statusMatch = match.match(/(✅|❌)/);
      const dataMatch = match.match(/\{.*\}/s);
      
      if (pathMatch && statusMatch && dataMatch) {
        try {
          const data = JSON.parse(dataMatch[0]);
          results.push({
            filePath: pathMatch[1],
            content: data.data?.content || '',
            success: statusMatch[1] === '✅',
            totalLines: data.data?.totalLines
          });
        } catch (error) {
          console.error('解析文件结果失败:', error);
        }
      }
    }
  }
  
  // 如果没有找到标准格式，尝试解析JSON格式
  if (results.length === 0) {
    try {
      const jsonMatch = content.match(/\{.*"filePath".*\}/s);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        if (data.success && data.data) {
          results.push({
            filePath: data.data.filePath,
            content: data.data.content,
            success: true,
            totalLines: data.data.totalLines
          });
        }
      }
    } catch {
      // 忽略JSON解析错误
    }
  }
  
  return results;
}

/**
 * 解析消息内容，提取工具调用、工具结果等信息
 */
export function parseMessageContent(content: string): ParsedContent {
  const normalContent = extractNormalContent(content);
  const toolCalls = extractToolCalls(content);
  const toolResults = extractToolResults(content);
  const hasError = checkForErrors(content, toolResults);

  return {
    normalContent,
    toolCalls,
    toolResults,
    hasError
  };
}

/**
 * 生成消息摘要
 */
export function getMessageSummary(content: string): string {
  // 检查是否包含工具调用
  if (content.includes('<use_tool>')) {
    const toolNameMatch = content.match(/<tool_name>(.*?)<\/tool_name>/s);
    const toolName = toolNameMatch ? toolNameMatch[1].trim() : '未知工具';
    return `调用${toolName}`;
  }

  // 检查是否是工具执行结果
  if (content.includes('FileReadTool(') || content.includes('Batch operation')) {
    const fileCount = (content.match(/FileReadTool\(/g) || []).length;
    if (fileCount > 0) {
      return `读取${fileCount}个文件`;
    }
    return '执行结果';
  }

  // 检查是否是JSON格式的结果
  try {
    const parsed = JSON.parse(content);
    if (parsed.success !== undefined) {
      return parsed.success ? '执行成功' : '执行失败';
    }
  } catch {
    // 不是JSON格式，继续处理
  }

  // 普通文本消息，截取前30个字符
  const text = content.trim();
  if (text.length <= 30) {
    return text;
  }
  return text.substring(0, 30) + '...';
}

/**
 * 提取普通文本内容（去除工具调用部分）
 */
function extractNormalContent(content: string): string {
  // 移除工具调用标签
  const withoutToolCalls = content.replace(/<use_tool>.*?<\/use_tool>/gs, '').trim();
  
  // 如果是纯工具执行结果，返回空字符串
  if (content.includes('FileReadTool(') || content.includes('Batch operation')) {
    return '';
  }

  return withoutToolCalls;
}

/**
 * 提取工具调用信息
 */
function extractToolCalls(content: string): ToolCall[] {
  const toolCallMatches = content.match(/<use_tool>.*?<\/use_tool>/gs) || [];
  
  return toolCallMatches.map(xmlString => {
    try {
      const toolNameMatch = xmlString.match(/<tool_name>(.*?)<\/tool_name>/s);
      const toolName = toolNameMatch ? toolNameMatch[1].trim() : 'Unknown Tool';
      
      const argumentsMatch = xmlString.match(/<arguments>(.*?)<\/arguments>/s);
      let arguments_data = {};
      
      if (argumentsMatch) {
        try {
          arguments_data = JSON.parse(argumentsMatch[1].trim());
        } catch {
          arguments_data = { raw: argumentsMatch[1].trim() };
        }
      }
      
      return {
        tool_name: toolName,
        arguments: arguments_data
      };
    } catch {
      return {
        tool_name: 'Parse Error',
        arguments: { raw: xmlString }
      };
    }
  });
}

/**
 * 提取工具执行结果
 */
function extractToolResults(content: string): ToolExecutionResult[] {
  const results: ToolExecutionResult[] = [];

  // 检查批量操作结果
  const batchMatch = content.match(/Batch operation "([^"]*)" completed in \d+ms\./);
  if (batchMatch) {
    const batchDescription = batchMatch[1];
    const files = extractFileResults(content);
    
    results.push({
      success: true,
      batchDescription,
      files
    });
  }

  // 检查单个工具执行结果
  else if (content.includes('FileReadTool(') || isToolExecutionResult(content)) {
    const files = extractFileResults(content);
    results.push({
      success: files.length > 0 && files.every(f => f.success),
      files
    });
  }

  // 检查JSON格式的结果
  else {
    try {
      const parsed = JSON.parse(content);
      if (parsed.success !== undefined) {
        results.push({
          success: parsed.success,
          data: parsed.data,
          error: parsed.error
        });
      }
    } catch {
      // 不是JSON格式的结果
    }
  }

  return results;
}

/**
 * 提取文件读取结果
 */
function extractFileResults(content: string): FileResult[] {
  const fileResults: FileResult[] = [];

  // 匹配 FileReadTool 执行结果
  const fileReadMatches = content.match(/FileReadTool\(file_path: "([^"]*?)"\): ✅\s*\{.*?"content":"(.*?)".*?\}/gs);
  
  if (fileReadMatches) {
    fileReadMatches.forEach(match => {
      const pathMatch = match.match(/file_path: "([^"]*?)"/);
      const contentMatch = match.match(/"content":"(.*?)"/s);
      const totalLinesMatch = match.match(/"totalLines":(\d+)/);
      
      if (pathMatch && contentMatch) {
        fileResults.push({
          filePath: pathMatch[1],
          content: contentMatch[1].replace(/\\\\n/g, '\n').replace(/\\"/g, '"'),
          success: true,
          totalLines: totalLinesMatch ? parseInt(totalLinesMatch[1]) : undefined
        });
      }
    });
  }

  // 尝试解析JSON格式的文件结果
  try {
    const parsed = JSON.parse(content);
    if (parsed.success && parsed.data && parsed.data.filePath && parsed.data.content) {
      fileResults.push({
        filePath: parsed.data.filePath,
        content: parsed.data.content,
        success: true,
        totalLines: parsed.data.totalLines
      });
    }
  } catch {
    // 不是JSON格式
  }

  return fileResults;
}

/**
 * 检查是否有错误
 */
function checkForErrors(content: string, toolResults: ToolExecutionResult[]): boolean {
  // 检查工具执行结果中的错误
  const hasResultErrors = toolResults.some(result => !result.success || result.error);
  
  // 检查内容中的错误指示
  const hasContentErrors = content.includes('✗') || 
                          content.includes('error') || 
                          content.includes('failed') ||
                          content.includes('失败');

  return hasResultErrors || hasContentErrors;
}

/**
 * 判断是否为工具执行结果
 */
function isToolExecutionResult(content: string): boolean {
  return content.includes('FileReadTool(') || 
         content.includes('Batch operation') ||
         content.includes('completed') ||
         content.includes('✅') ||
         content.includes('✗');
}

/**
 * 转换聊天数据格式的主函数
 * 将原始格式转换为可供前端渲染的结构化数据
 */
export function transformChatData(rawData: RawChatMessage[]): {
  items: unknown[];
  metadata: {
    sessionId: string;
    createdAt: Date;
    updatedAt: Date;
  };
} {
  const items: unknown[] = [];
  let currentPairIndex = 0;

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];
    
    if (item.type === 'finalResponse') {
      // 直接添加最终回复
      items.push({
        ...item,
        id: `final-${i}`
      });
    } else if (item.type === 'message') {
      const { role } = item.data as { role: 'user' | 'assistant'; content: string };
      
      if (role === 'user') {
        if (i === 0) {
          // 第一个用户消息，直接添加
          items.push({
            ...item,
            id: `user-${i}`,
            data: {
              ...(item.data as object),
              timestamp: new Date()
            }
          });
        } else {
          // 后续的用户消息作为工具执行结果
          items.push({
            ...item,
            id: `result-${currentPairIndex}`,
            data: {
              ...(item.data as object),
              timestamp: new Date()
            }
          });
        }
      } else if (role === 'assistant') {
        // AI助手消息作为工具调用
        items.push({
          ...item,
          id: `assistant-${currentPairIndex}`,
          data: {
            ...(item.data as object),
            timestamp: new Date()
          }
        });
        currentPairIndex++;
      }
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