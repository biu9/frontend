'use client';

import React from 'react';
import { Avatar, Card, Space, Typography } from 'antd';
import { UserOutlined, RobotOutlined, ToolOutlined } from '@ant-design/icons';
import ToolCallVisualization from './ToolCallVisualization';
import FileViewer from './FileViewer';
import TimeStamp from './TimeStamp';

const { Text } = Typography;

interface MessageItemProps {
  role: 'user' | 'assistant';
  content: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ role, content }) => {
  const isUser = role === 'user';
  
  // 检查是否包含工具调用
  const hasToolCall = content.includes('<use_tool>');
  
  // 解析工具调用和常规内容
  const parseContent = (text: string) => {
    if (!hasToolCall) {
      return { normalContent: text, toolCalls: [] };
    }
    
    const parts = text.split(/<use_tool>.*?<\/use_tool>/gs);
    const toolCallMatches = text.match(/<use_tool>.*?<\/use_tool>/gs) || [];
    
    return {
      normalContent: parts.join('').trim(),
      toolCalls: toolCallMatches
    };
  };
  
  const { normalContent, toolCalls } = parseContent(content);
  
  // 检查是否为工具执行结果
  const isToolResult = content.includes('FileReadTool(') || content.includes('Batch operation');
  
  // 解析文件读取结果
  const parseFileResults = (text: string) => {
    const fileReadMatches = text.match(/FileReadTool\(file_path: "(.*?)"\): ✅\s*\{.*?"content":"(.*?)".*?\}/gs);
    return fileReadMatches?.map(match => {
      const pathMatch = match.match(/file_path: "(.*?)"/);
      const contentMatch = match.match(/"content":"(.*?)"/s);
      return {
        filePath: pathMatch ? pathMatch[1] : '',
        content: contentMatch ? contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : ''
      };
    }) || [];
  };
  
  const fileResults = parseFileResults(content);
  
  const author = isUser ? '用户' : 'AI助手';
  const avatar = isUser ? <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} /> : <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#7265e6' }} />;
  
  const messageContent = (
    <Space direction="vertical" style={{width: '100%'}}>
      {normalContent && <Text style={{ whiteSpace: 'pre-wrap' }}>{normalContent}</Text>}
      {toolCalls.length > 0 && (
        <Space direction="vertical" style={{width: '100%'}}>
          {toolCalls.map((toolCall, index) => (
            <ToolCallVisualization key={index} toolCallXml={toolCall} />
          ))}
        </Space>
      )}
      {isToolResult && (
         <Card size="small" title="工具执行结果" extra={<ToolOutlined/>}>
             {fileResults.length > 0 && (
                 <Space direction="vertical" style={{width: '100%'}}>
                     <Text type="secondary">读取的文件:</Text>
                     {fileResults.map((file, index) => (
                         <FileViewer 
                           key={index}
                           filePath={file.filePath}
                           content={file.content}
                           success={true}
                         />
                     ))}
                 </Space>
             )}
             <details>
                 <summary>查看原始输出</summary>
                 <pre style={{whiteSpace: 'pre-wrap', background: '#fafafa', padding: '8px', borderRadius: '4px', marginTop: '8px'}}>{content}</pre>
             </details>
         </Card>
      )}
    </Space>
  );

  return (
    <div style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px'
    }}>
        <div style={{
            maxWidth: '80%',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            flexDirection: isUser ? 'row-reverse' : 'row'
        }}>
            {avatar}
            <div style={{
                background: isUser ? '#e6f7ff' : '#fff',
                borderRadius: '8px',
                padding: '8px 12px',
                border: `1px solid ${isUser ? '#91d5ff' : '#f0f0f0'}`
            }}>
                <Space>
                    <Text strong>{author}</Text>
                    <TimeStamp />
                </Space>
                <div style={{ marginTop: '8px' }}>
                    {messageContent}
                </div>
            </div>
        </div>
    </div>
  );
};

export default MessageItem; 