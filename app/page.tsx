'use client';

import { useState } from 'react';
import { Layout, Input, Button, Space, Typography } from 'antd';
import ChatContainer from './components/ChatContainer';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// 示例数据
const sampleData = {
  "items": [
    {
      "type": "message" as const,
      "data": {
        "role": "user" as const,
        "content": "查看当前目录下的所有代码库，说下他们的功能"
      }
    },
    {
      "type": "message" as const,
      "data": {
        "role": "assistant" as const,
        "content": "我将检查当前目录下的各个代码库及其功能。\n\n<use_tool>\n  <tool_name>BatchTool</tool_name>\n  <arguments>\n    {\"description\":\"Check project READMEs\",\"invocations\":[\n      {\"tool_name\":\"FileReadTool\",\"input\":{\"file_path\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/fastify-server/README.md\"}},\n      {\"tool_name\":\"FileReadTool\",\"input\":{\"file_path\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/README.md\"}},\n      {\"tool_name\":\"FileReadTool\",\"input\":{\"file_path\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/local-server/readme\"}},\n      {\"tool_name\":\"FileReadTool\",\"input\":{\"file_path\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/remote-server/readme.md\"}}\n    ]}\n  </arguments>\n</use_tool>"
      }
    },
    {
      "type": "message" as const,
      "data": {
        "role": "user" as const,
        "content": "Batch operation \"Check project READMEs\" completed in 9ms.\n\nFileReadTool(file_path: \"/Users/taohongyu/Desktop/insight/kai-node-demo/fastify-server/README.md\"): ✅  {\"success\":true,\"data\":{\"filePath\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/fastify-server/README.md\",\"content\":\"# Fastify服务 (简化版)\\n\\n## 项目介绍\\n这是一个基于Fastify框架的简化版Node.js服务。\\n\\n## 技术栈\\n- Node.js\\n- Fastify\"}}\n\nFileReadTool completed successfully."
      }
    },
    {
      "type": "finalResponse" as const,
      "data": "当前目录包含四个项目:\n\n1. fastify-server: 基于Fastify的Node.js服务，提供本地API和远程服务数据API，运行在端口3000\n2. frontend: 基于Next.js的前端应用\n3. local-server: 基于Express的Node.js服务，提供类似fastify-server的API，运行在端口3001\n4. remote-server: 基于Koa的服务，提供HTTP和WebSocket接口，运行在端口3002"
    }
  ]
};

export default function Home() {
  const [chatData, setChatData] = useState(sampleData);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // 添加用户消息到聊天数据
    const newMessage = {
      type: "message" as const,
      data: {
        role: "user" as const,
        content: inputValue
      }
    };
    
    setChatData(prev => ({
      items: [...prev.items, newMessage]
    }));
    
    setInputValue('');
  };

  const handleClearChat = () => {
    setChatData({ items: [] });
  };

  const handleLoadSampleData = () => {
    setChatData(sampleData);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            <Title level={3} style={{ margin: 0 }}>AI 对话可视化</Title>
        </div>
      </Header>
      <Content style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f5', padding: '24px', borderRadius: '8px' }}>
          <ChatContainer data={chatData} />
        </div>
      </Content>
      <Footer style={{ padding: '16px 24px', background: '#fff' }}>
        <Space.Compact style={{ width: '100%' }}>
            <Input
                size="large"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="输入您的问题..."
            />
            <Button size="large" type="primary" onClick={handleSendMessage}>发送</Button>
        </Space.Compact>
        <div style={{marginTop: '12px'}}>
            <Space>
                <Button onClick={handleLoadSampleData}>加载示例数据</Button>
                <Button danger onClick={handleClearChat}>清空对话</Button>
            </Space>
        </div>
      </Footer>
    </Layout>
  );
}
