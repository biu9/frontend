"use client";

import React, { useState } from 'react';
import { Layout, Input, Button, Space, Typography, Card, Divider } from 'antd';
import MessageItem from '../components/MessageItem';
import { ChatMessageContent } from '../utils/dataTransformer';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

interface NewFormatMessage {
  role: 'user' | 'assistant';
  content: ChatMessageContent;
  id: string;
}

// 新格式的示例数据
const newFormatSampleData: NewFormatMessage[] = [
  {
    role: 'user',
    content: '请帮我分析一下这个项目的结构',
    id: 'user-1'
  },
  {
    role: 'assistant',
    content: {
      toolName: 'FileReadTool',
      arguments: {
        file_path: '/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/package.json'
      }
    },
    id: 'assistant-1'
  },
  {
    role: 'user',
    content: {
      success: true,
      data: {
        filePath: '/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/package.json',
        content: `{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@ant-design/icons": "^6.0.0",
    "@ant-design/nextjs-registry": "^1.0.2",
    "@ant-design/x": "^1.4.0",
    "antd": "^5.26.0",
    "next": "15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}`,
        totalLines: 20
      }
    },
    id: 'user-2'
  },
  {
    role: 'assistant',
    content: '根据package.json文件，这是一个基于Next.js的前端项目，使用了Ant Design作为UI框架。项目包含了现代的开发工具链和依赖管理。',
    id: 'assistant-2'
  }
];

export default function NewFormatPage() {
  const [messages, setMessages] = useState<NewFormatMessage[]>(newFormatSampleData);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: NewFormatMessage = {
      role: 'user',
      content: inputValue,
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const handleLoadSample = () => {
    setMessages(newFormatSampleData);
  };

  const addToolCallExample = () => {
    const toolCallMessage: NewFormatMessage = {
      role: 'assistant',
      content: {
        toolName: 'DirectoryListTool',
        arguments: {
          path: '/Users/taohongyu/Desktop/insight/kai-node-demo',
          recursive: false
        }
      },
      id: `assistant-${Date.now()}`
    };

    const resultMessage: NewFormatMessage = {
      role: 'user',
      content: {
        success: true,
        data: {
          filePath: '/Users/taohongyu/Desktop/insight/kai-node-demo',
          content: 'fastify-server/\nfrontend/\nlocal-server/\nremote-server/',
          totalLines: 4
        }
      },
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, toolCallMessage, resultMessage]);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #f0f0f0', 
        padding: '0 24px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Title level={3} style={{ margin: 0 }}>
            新数据格式演示
          </Title>
          <div style={{ marginLeft: 'auto' }}>
            <Button type="link" href="/" style={{ fontSize: '12px' }}>
              返回主页
            </Button>
          </div>
        </div>
      </Header>

      <Content style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <Card style={{ marginBottom: '24px' }}>
          <Title level={4}>新数据结构说明</Title>
          <Paragraph>
            这个页面演示了直接使用新的ChatMessageContent数据结构，无需字符串解析：
          </Paragraph>
          <ul>
            <li><strong>工具调用</strong>：`{'{ toolName: string, arguments: Record<string, unknown> }'}`</li>
            <li><strong>工具结果</strong>：`{'{ success: boolean, data: { filePath, content, totalLines } }'}`</li>
            <li><strong>普通文本</strong>：直接使用字符串</li>
          </ul>
        </Card>

        <Divider />

        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: '#f5f5f5',
          padding: '24px',
          borderRadius: '8px'
        }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}
          </Space>
        </div>
      </Content>

      <Footer style={{ padding: '16px 24px', background: '#fff' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            size="large"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="输入消息..."
          />
          <Button size="large" type="primary" onClick={handleSendMessage}>
            发送
          </Button>
        </Space.Compact>
        <div style={{ marginTop: '12px' }}>
          <Space>
            <Button onClick={handleLoadSample}>加载示例数据</Button>
            <Button onClick={addToolCallExample}>添加工具调用示例</Button>
            <Button danger onClick={handleClearMessages}>清空消息</Button>
            <span style={{ color: '#999', fontSize: '12px' }}>
              共 {messages.length} 条消息
            </span>
          </Space>
        </div>
      </Footer>
    </Layout>
  );
} 