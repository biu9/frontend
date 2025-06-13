'use client';

import React from 'react';
import { Avatar, Card, Space, Typography, Tag, Divider } from 'antd';
import { UserOutlined, RobotOutlined, ToolOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ToolCallVisualization from './ToolCallVisualization';
import FileViewer from './FileViewer';
import TimeStamp from './TimeStamp';
import { parseMessageContent, getMessageSummary } from '../utils/contentParser';

const { Text, Paragraph } = Typography;

interface MessageItemProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const MessageItem: React.FC<MessageItemProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';
  
  // 解析消息内容
  const parsed = parseMessageContent(content);
  const { normalContent, toolCalls, toolResults, hasError } = parsed;
  
  const author = isUser ? '用户' : 'AI助手';
  const avatar = isUser ? 
    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} /> : 
    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#7265e6' }} />;

  // 渲染工具调用部分
  const renderToolCalls = () => {
    if (toolCalls.length === 0) return null;
    
    return (
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Divider orientation="left" style={{ margin: '8px 0' }}>
          <Space>
            <ToolOutlined />
            <Text type="secondary">工具调用</Text>
          </Space>
        </Divider>
        {toolCalls.map((toolCall, index) => (
          <ToolCallVisualization 
            key={index} 
            toolCall={toolCall}
            compact={toolCalls.length > 1}
          />
        ))}
      </Space>
    );
  };

  // 渲染工具执行结果
  const renderToolResults = () => {
    if (toolResults.length === 0) return null;
    
    return (
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Divider orientation="left" style={{ margin: '8px 0' }}>
          <Space>
            {hasError ? <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} /> : <CheckCircleOutlined style={{ color: '#52c41a' }} />}
            <Text type="secondary">执行结果</Text>
            {hasError && <Tag color="error">有错误</Tag>}
          </Space>
        </Divider>
        
        {toolResults.map((result, index) => (
          <Card 
            key={index}
            size="small" 
            title={
              <Space>
                {result.success ? 
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                  <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                }
                <Text>{result.batchDescription || '工具执行结果'}</Text>
                {result.files && (
                  <Tag color="blue">{result.files.length} 个文件</Tag>
                )}
              </Space>
            }
          >
            {result.files && result.files.length > 0 && (
              <Space direction="vertical" style={{ width: '100%' }}>
                {result.files.map((file, fileIndex) => (
                  <FileViewer 
                    key={fileIndex}
                    filePath={file.filePath}
                    content={file.content}
                    success={file.success}
                    totalLines={file.totalLines}
                  />
                ))}
              </Space>
            )}
            
            {result.error && (
              <Text type="danger">{result.error}</Text>
            )}
            
            <details style={{ marginTop: '8px' }}>
              <summary style={{ cursor: 'pointer', color: '#666' }}>查看原始输出</summary>
              <pre style={{
                whiteSpace: 'pre-wrap', 
                background: '#fafafa', 
                padding: '8px', 
                borderRadius: '4px', 
                marginTop: '8px',
                fontSize: '12px',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {content}
              </pre>
            </details>
          </Card>
        ))}
      </Space>
    );
  };

  const messageContent = (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      {/* 普通文本内容 */}
      {normalContent && (
        <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {normalContent}
        </Paragraph>
      )}
      
      {/* 工具调用 */}
      {renderToolCalls()}
      
      {/* 工具执行结果 */}
      {renderToolResults()}
    </Space>
  );

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '24px'
    }}>
      <div style={{
        maxWidth: '85%',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row'
      }}>
        {avatar}
        <Card
          size="small"
          style={{
            background: isUser ? '#e6f7ff' : '#fff',
            borderColor: isUser ? '#91d5ff' : '#f0f0f0',
            minWidth: '200px'
          }}
          title={
            <Space>
              <Text strong>{author}</Text>
              <TimeStamp timestamp={timestamp} />
              {hasError && <Tag color="error">有错误</Tag>}
            </Space>
          }
          extra={
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {getMessageSummary(content)}
            </Text>
          }
        >
          {messageContent}
        </Card>
      </div>
    </div>
  );
};

export default MessageItem; 