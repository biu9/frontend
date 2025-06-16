/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { Button, Card, Space, Typography, message, Input, Divider } from 'antd';
import { PlayCircleOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import ChatContainer from '../components/ChatContainer';
import { processAndTransformChatData } from '../utils/exampleUsage';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 示例数据
const exampleRawData = [
  {
    "type": "message",
    "data": {
      "role": "user",
      "content": "介绍下项目的chatMessage渲染方式"
    }
  },
  {
    "type": "message",
    "data": {
      "role": "assistant",
      "content": "<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {\"file_path\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/MessageItem.tsx\"}\n  </arguments>\n</use_tool>"
    }
  },
  {
    "type": "message",
    "data": {
      "role": "user",
      "content": "{\"success\":true,\"data\":{\"filePath\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/MessageItem.tsx\",\"content\":\"'use client';\\n\\nimport React from 'react';\\nimport { Avatar, Card, Space, Typography, Badge, Tooltip } from 'antd';\\nimport { UserOutlined, RobotOutlined, ToolOutlined, CheckCircleOutlined } from '@ant-design/icons';\\nimport ToolCallVisualization from './ToolCallVisualization';\\nimport FileViewer from './FileViewer';\\nimport TimeStamp from './TimeStamp';\\n\\nconst { Text } = Typography;\\n\\ninterface MessageItemProps {\\n  role: 'user' | 'assistant';\\n  content: string;\\n  timestamp?: Date;\\n}\\n\\nconst MessageItem: React.FC<MessageItemProps> = ({ role, content, timestamp }) => {\\n  const isUser = role === 'user';\\n  \\n  // 检查是否包含工具调用\\n  const hasToolCall = content.includes('<use_tool>');\\n  \\n  // 解析工具调用和常规内容\\n  const parseContent = (text: string) => {\\n    if (!hasToolCall) {\\n      return { normalContent: text, toolCalls: [] };\\n    }\\n    \\n    const parts = text.split(/<use_tool>.*?<\\\\/use_tool>/gs);\\n    const toolCallMatches = text.match(/<use_tool>.*?<\\\\/use_tool>/gs) || [];\\n    \\n    return {\\n      normalContent: parts.join('').trim(),\\n      toolCalls: toolCallMatches\\n    };\\n  };\\n  \\n  const { normalContent, toolCalls } = parseContent(content);\\n  \\n  // 检查是否为工具执行结果\\n  const isToolResult = content.includes('FileReadTool(') || content.includes('Batch operation');\\n  \\n  return (\\n    <div>MessageItem Component</div>\\n  );\\n};\\n\\nexport default MessageItem;\",\"totalLines\":231}}"
    }
  },
  {
    "type": "message",
    "data": {
      "role": "assistant",
      "content": "<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {\"file_path\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/ToolCallVisualization.tsx\"}\n  </arguments>\n</use_tool>"
    }
  },
  {
    "type": "message",
    "data": {
      "role": "user",
      "content": "{\"success\":true,\"data\":{\"filePath\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/ToolCallVisualization.tsx\",\"content\":\"'use client';\\n\\nimport React, { useState } from 'react';\",\"totalLines\":223}}"
    }
  },
  {
    "type": "finalResponse",
    "data": "项目使用MessageItem组件渲染聊天消息，主要特点：\n\n1. 区分用户和AI助手消息，使用不同样式和头像\n2. 解析消息内容，识别普通文本、工具调用和执行结果\n3. 工具调用通过ToolCallVisualization组件展示，支持展开/收起\n4. 文件读取结果用FileViewer组件显示，支持预览和完整查看\n5. 使用Ant Design组件构建UI，包含时间戳、状态标签等\n6. 根据消息类型应用不同背景色和视觉效果"
  }
];

export default function TestTransformPage() {
  const [transformedData, setTransformedData] = useState<any>(null);
  const [inputData, setInputData] = useState<string>(JSON.stringify(exampleRawData, null, 2));
  const [copied, setCopied] = useState(false);

  const handleTransform = () => {
    try {
      const rawData = JSON.parse(inputData);
      const result = processAndTransformChatData(rawData);
      
      if (result.success) {
        setTransformedData(result.data);
        message.success(`转换成功！${result.summary}`);
      } else {
        message.error(`转换失败：${result.error}`);
      }
    } catch (error) {
      message.error('JSON格式错误，请检查输入数据');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(transformedData, null, 2));
      setCopied(true);
      message.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error('复制失败');
    }
  };

  const loadExample = () => {
    setInputData(JSON.stringify(exampleRawData, null, 2));
    message.info('已加载示例数据');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>聊天数据转换工具</Title>
      <Paragraph>
        此工具可以将原始聊天数据转换为前端可渲染的格式。转换规则：
      </Paragraph>
      <ul>
        <li>第一个 user 消息：用户的原始问题</li>
        <li>assistant + user 对：AI工具调用 + 工具执行结果</li>
        <li>finalResponse：最终回复</li>
      </ul>

      <Divider />

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* 输入区域 */}
        <Card 
          title="原始数据输入" 
          style={{ flex: '1', minWidth: '400px' }}
          extra={
            <Button type="link" onClick={loadExample}>
              加载示例
            </Button>
          }
        >
          <TextArea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="请输入原始聊天数据的JSON格式..."
            rows={20}
            style={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: '12px' }}
          />
          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              onClick={handleTransform}
            >
              转换数据
            </Button>
          </div>
        </Card>

        {/* 转换结果区域 */}
        {transformedData && (
          <Card 
            title="转换结果" 
            style={{ flex: '1', minWidth: '400px' }}
            extra={
              <Button 
                type="link" 
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopy}
              >
                {copied ? '已复制' : '复制JSON'}
              </Button>
            }
          >
            <div style={{ marginBottom: '16px' }}>
              <Text strong>转换后的JSON数据：</Text>
              <pre style={{
                background: '#f5f5f5',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '12px',
                maxHeight: '300px',
                overflow: 'auto',
                fontFamily: 'Monaco, Consolas, monospace'
              }}>
                {JSON.stringify(transformedData, null, 2)}
              </pre>
            </div>
          </Card>
        )}
      </div>

      {/* 渲染效果预览 */}
      {transformedData && (
        <>
          <Divider />
          <Card title="渲染效果预览" style={{ marginTop: '24px' }}>
            <div style={{ 
              background: '#f5f5f5', 
              borderRadius: '8px', 
              padding: '24px',
              maxHeight: '600px',
              overflow: 'auto'
            }}>
              <ChatContainer data={transformedData} />
            </div>
          </Card>
        </>
      )}

      <Divider />

      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginTop: '24px' }}>
        <Title level={4}>函数接口</Title>
        <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px' }}>
{`import { transformChatData, validateChatData } from './utils/dataTransformer';

// 转换数据
const result = transformChatData(rawData);

// 验证数据格式
const validation = validateChatData(rawData);`}
        </pre>

        <Title level={4}>数据格式要求</Title>
        <ul>
          <li>数组格式，包含多个消息对象</li>
          <li>每个消息对象包含 type 和 data 字段</li>
          <li>type 可以是 "message" 或 "finalResponse"</li>
          <li>message 类型的 data 包含 role 和 content</li>
          <li>role 可以是 "user" 或 "assistant"</li>
        </ul>

        <Title level={4}>转换后的数据特点</Title>
        <ul>
          <li>保持原有的消息顺序和内容</li>
          <li>自动添加时间戳和唯一ID</li>
          <li>包含会话元数据（sessionId、创建时间等）</li>
          <li>兼容现有的聊天组件接口</li>
        </ul>
      </Card>
    </div>
  );
} 