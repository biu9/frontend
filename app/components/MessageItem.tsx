'use client';

import React from 'react';
import { Avatar, Card, Space, Typography, Tag, Divider } from 'antd';
import { UserOutlined, RobotOutlined, ToolOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ToolCallVisualization from './ToolCallVisualization';
import FileViewer from './FileViewer';
import { parseMessageContent, getMessageSummary } from '../utils/contentParser';
import { ChatMessageContent } from '../utils/dataTransformer';

const { Text, Paragraph } = Typography;

interface MessageItemProps {
  role: 'user' | 'assistant';
  content: string | ChatMessageContent; // 支持新的数据类型
}

const MessageItem: React.FC<MessageItemProps> = ({ role, content }) => {
  // 如果content是对象类型，直接使用；否则解析字符串
  const contentData = typeof content === 'string' ? 
    parseMessageContent(content) : 
    parseContentObject(content);
    
  const { normalContent, toolCalls, toolResults, hasError } = contentData;
  
  // 判断显示逻辑：工具执行结果应该显示为AI助手消息
  const isToolResult = toolResults.length > 0;
  const displayAsUser = role === 'user' && !isToolResult;
  
  const author = displayAsUser ? '用户' : 'AI助手';
  const avatar = displayAsUser ? 
    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} /> : 
    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#7265e6' }} />;

  // 解析ChatMessageContent对象
  function parseContentObject(contentObj: ChatMessageContent) {
    if (typeof contentObj === 'string') {
      return parseMessageContent(contentObj);
    } else if ('toolName' in contentObj) {
      // 工具调用
      return {
        normalContent: '',
        toolCalls: [{
          tool_name: contentObj.toolName,
          arguments: contentObj.arguments
        }],
        toolResults: [],
        hasError: false
      };
    } else if ('success' in contentObj) {
      // 工具执行结果
      const fileResult = contentObj.data ? {
        filePath: contentObj.data.filePath,
        content: contentObj.data.content,
        success: contentObj.success,
        totalLines: contentObj.data.totalLines
      } : undefined;
      
      return {
        normalContent: '',
        toolCalls: [],
        toolResults: [{
          success: contentObj.success,
          files: fileResult ? [fileResult] : []
        }],
        hasError: !contentObj.success
      };
    }
    
    // 默认情况
    return {
      normalContent: JSON.stringify(contentObj),
      toolCalls: [],
      toolResults: [],
      hasError: false
    };
  }

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
                {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
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
      justifyContent: displayAsUser ? 'flex-end' : 'flex-start',
      marginBottom: '24px'
    }}>
      <div style={{
        maxWidth: '85%',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        flexDirection: displayAsUser ? 'row-reverse' : 'row'
      }}>
        {avatar}
        <Card
          size="small"
          style={{
            background: displayAsUser ? '#e6f7ff' : '#fff',
            borderColor: displayAsUser ? '#91d5ff' : '#f0f0f0',
            minWidth: '200px'
          }}
          title={
            <Space>
              <Text strong>{author}</Text>
              {hasError && <Tag color="error">有错误</Tag>}
              {isToolResult && <Tag color="processing">工具结果</Tag>}
            </Space>
          }
          extra={
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {typeof content === 'string' ? 
                getMessageSummary(content) : 
                getContentSummary(content)
              }
            </Text>
          }
        >
          {messageContent}
        </Card>
      </div>
    </div>
  );
};

// 为ChatMessageContent对象生成摘要
function getContentSummary(content: ChatMessageContent): string {
  if (typeof content === 'string') {
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  } else if ('toolName' in content) {
    return `调用 ${content.toolName}`;
  } else if ('success' in content) {
    return content.success ? '执行成功' : '执行失败';
  }
  return '数据对象';
}

export default MessageItem; 