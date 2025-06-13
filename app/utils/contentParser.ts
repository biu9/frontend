// 内容解析工具函数
import { ToolCall, ToolExecutionResult, ParsedContent, FileResult } from '../types/chat';

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
 * 完整解析消息内容
 */
export function parseMessageContent(content: string): ParsedContent {
  // 分离工具调用和普通内容
  const toolCallMatches = content.match(/<use_tool>.*?<\/use_tool>/gs) || [];
  const toolCalls: ToolCall[] = [];
  
  // 解析工具调用
  for (const match of toolCallMatches) {
    const parsed = parseToolCall(match);
    if (parsed) {
      toolCalls.push(parsed);
    }
  }
  
  // 移除工具调用后的普通内容
  const normalContent = content
    .replace(/<use_tool>.*?<\/use_tool>/gs, '')
    .trim();
  
  // 解析工具执行结果
  const toolResults = parseToolResult(content);
  
  // 检查是否有错误
  const hasError = content.includes('❌') || 
                   content.includes('"success":false') ||
                   toolResults.some(r => !r.success);
  
  return {
    normalContent,
    toolCalls,
    toolResults,
    hasError
  };
}

/**
 * 获取消息摘要
 */
export function getMessageSummary(content: string): string {
  const parsed = parseMessageContent(content);
  
  if (parsed.toolCalls.length > 0) {
    const toolNames = parsed.toolCalls.map(t => t.tool_name).join(', ');
    return `使用工具: ${toolNames}`;
  }
  
  if (parsed.toolResults.length > 0) {
    const resultCount = parsed.toolResults.reduce((acc, r) => acc + (r.files?.length || 0), 0);
    return `工具执行结果 (${resultCount} 个文件)`;
  }
  
  return parsed.normalContent.slice(0, 50) + (parsed.normalContent.length > 50 ? '...' : '');
} 