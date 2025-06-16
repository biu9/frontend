"use client";

import { useState } from "react";
import { Layout, Input, Button, Space, Typography } from "antd";
import ChatContainer from "./components/ChatContainer";
import { ChatData } from "./types/chat";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// 优化后的示例数据
const sampleData: ChatData = {
  items: [
    {
      type: "message",
      data: {
        role: "user",
        content: "描述整个项目的结构，增加一个架构图",
      },
    },
    {
      type: "message",
      data: {
        role: "assistant",
        content:
          '<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/package.json"}\n  </arguments>\n</use_tool>',
      },
    },
    {
      type: "message",
      data: {
        role: "user",
        content:
          '{"success":true,"data":{"filePath":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/package.json","content":"{\\n  \\"name\\": \\"frontend\\",\\n  \\"version\\": \\"0.1.0\\",\\n  \\"private\\": true,\\n  \\"scripts\\": {\\n    \\"dev\\": \\"next dev --turbopack\\",\\n    \\"build\\": \\"next build\\",\\n    \\"start\\": \\"next start\\",\\n    \\"lint\\": \\"next lint\\"\\n  },\\n  \\"dependencies\\": {\\n    \\"@ant-design/icons\\": \\"^6.0.0\\",\\n    \\"@ant-design/nextjs-registry\\": \\"^1.0.2\\",\\n    \\"@ant-design/x\\": \\"^1.4.0\\",\\n    \\"antd\\": \\"^5.26.0\\",\\n    \\"next\\": \\"15.3.3\\",\\n    \\"react\\": \\"^19.0.0\\",\\n    \\"react-dom\\": \\"^19.0.0\\"\\n  },\\n  \\"devDependencies\\": {\\n    \\"@eslint/eslintrc\\": \\"^3\\",\\n    \\"@tailwindcss/postcss\\": \\"^4\\",\\n    \\"@types/node\\": \\"^20\\",\\n    \\"@types/react\\": \\"^19\\",\\n    \\"@types/react-dom\\": \\"^19\\",\\n    \\"eslint\\": \\"^9\\",\\n    \\"eslint-config-next\\": \\"15.3.3\\",\\n    \\"typescript\\": \\"^5\\"\\n  }\\n}\\n","totalLines":31}}',
      },
    },
    {
      type: "message",
      data: {
        role: "assistant",
        content:
          '<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/page.tsx"}\n  </arguments>\n</use_tool>',
      },
    },
    {
      type: "message",
      data: {
        role: "user",
        content:
          '{"success":true,"data":{"filePath":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/page.tsx","content":"\'use client\';\\n\\nimport { useState } from \'react\';\\nimport { Layout, Input, Button, Space, Typography } from \'antd\';\\nimport ChatContainer from \'./components/ChatContainer\';\\n\\nconst { Header, Content, Footer } = Layout;\\nconst { Title } = Typography;\\n\\n// 示例数据\\nconst sampleData = {\\n  \\"items\\": [\\n    {\\n      \\"type\\": \\"message\\" as const,\\n      \\"data\\": {\\n        \\"role\\": \\"user\\" as const,\\n        \\"content\\": \\"查看当前目录下的所有代码库，说下他们的功能\\"\\n      }\\n    },\\n    {\\n      \\"type\\": \\"message\\" as const,\\n      \\"data\\": {\\n        \\"role\\": \\"assistant\\" as const,\\n        \\"content\\": \\"我将检查当前目录下的各个代码库及其功能。\\\\n\\\\n<use_tool>\\\\n  <tool_name>BatchTool</tool_name>\\\\n  <arguments>\\\\n    {\\\\\\"description\\\\\\":\\\\\\"Check project READMEs\\\\\\",\\\\\\"invocations\\\\\\":[\\\\n      {\\\\\\"tool_name\\\\\\":\\\\\\"FileReadTool\\\\\\",\\\\\\"input\\\\\\":{\\\\\\"file_path\\\\\\":\\\\\\"/Users/taohongyu/Desktop/insight/kai-node-demo/fastify-server/README.md\\\\\\"}},\\\\n      {\\\\\\"tool_name\\\\\\":\\\\\\"FileReadTool\\\\\\",\\\\\\"input\\\\\\":{\\\\\\"file_path\\\\\\":\\\\\\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/README.md\\\\\\"}},\\\\n      {\\\\\\"tool_name\\\\\\":\\\\\\"FileReadTool\\\\\\",\\\\\\"input\\\\\\":{\\\\\\"file_path\\\\\\":\\\\\\"/Users/taohongyu/Desktop/insight/kai-node-demo/local-server/readme\\\\\\"}},\\\\n      {\\\\\\"tool_name\\\\\\":\\\\\\"FileReadTool\\\\\\",\\\\\\"input\\\\\\":{\\\\\\"file_path\\\\\\":\\\\\\"/Users/taohongyu/Desktop/insight/kai-node-demo/remote-server/readme.md\\\\\\"}}\\\\n    ]}\\\\n  </arguments>\\\\n</use_tool>\\"\\n      }\\n    },\\n    {\\n      \\"type\\": \\"message\\" as const,\\n      \\"data\\": {\\n        \\"role\\": \\"user\\" as const,\\n        \\"content\\": \\"Batch operation \\\\\\"Check project READMEs\\\\\\" completed in 9ms.\\\\n\\\\nFileReadTool(file_path: \\\\\\"/Users/taohongyu/Desktop/insight/kai-node-demo/fastify-server/README.md\\\\\\"): ✅  {\\\\\\"success\\\\\\":true,\\\\\\"data\\\\\\":{\\\\\\"filePath\\\\\\":\\\\\\"/Users/taohongyu/Desktop/insight/kai-node-demo/fastify-server/README.md\\\\\\",\\\\\\"content\\\\\\":\\\\\\"# Fastify服务 (简化版)\\\\\\\\n\\\\\\\\n## 项目介绍\\\\\\\\n这是一个基于Fastify框架的简化版Node.js服务。\\\\\\\\n\\\\\\\\n## 技术栈\\\\\\\\n- Node.js\\\\\\\\n- Fastify\\\\\\"}}\\\\n\\\\nFileReadTool completed successfully.\\"\\n      }\\n    },\\n    {\\n      \\"type\\": \\"finalResponse\\" as const,\\n      \\"data\\": \\"当前目录包含四个项目:\\\\n\\\\n1. fastify-server: 基于Fastify的Node.js服务，提供本地API和远程服务数据API，运行在端口3000\\\\n2. frontend: 基于Next.js的前端应用\\\\n3. local-server: 基于Express的Node.js服务，提供类似fastify-server的API，运行在端口3001\\\\n4. remote-server: 基于Koa的服务，提供HTTP和WebSocket接口，运行在端口3002\\"\\n    }\\n  ]\\n};\\n\\nexport default function Home() {\\n  const [chatData, setChatData] = useState(sampleData);\\n  const [inputValue, setInputValue] = useState(\'\');\\n\\n  const handleSendMessage = () => {\\n    if (!inputValue.trim()) return;\\n    \\n    // 添加用户消息到聊天数据\\n    const newMessage = {\\n      type: \\"message\\" as const,\\n      data: {\\n        role: \\"user\\" as const,\\n        content: inputValue\\n      }\\n    };\\n    \\n    setChatData(prev => ({\\n      items: [...prev.items, newMessage]\\n    }));\\n    \\n    setInputValue(\'\');\\n  };\\n\\n  const handleClearChat = () => {\\n    setChatData({ items: [] });\\n  };\\n\\n  const handleLoadSampleData = () => {\\n    setChatData(sampleData);\\n  };\\n\\n  return (\\n    <Layout style={{ minHeight: \'100vh\' }}>\\n      <Header style={{ backgroundColor: \'#fff\', borderBottom: \'1px solid #f0f0f0\', padding: \'0 24px\' }}>\\n        <div style={{display: \'flex\', alignItems: \'center\', height: \'100%\'}}>\\n            <Title level={3} style={{ margin: 0 }}>AI 对话可视化</Title>\\n        </div>\\n      </Header>\\n      <Content style={{ padding: \'24px\', display: \'flex\', flexDirection: \'column\' }}>\\n        <div style={{ flex: 1, overflowY: \'auto\', background: \'#f5f5f5\', padding: \'24px\', borderRadius: \'8px\' }}>\\n          <ChatContainer data={chatData} />\\n        </div>\\n      </Content>\\n      <Footer style={{ padding: \'16px 24px\', background: \'#fff\' }}>\\n        <Space.Compact style={{ width: \'100%\' }}>\\n            <Input\\n                size=\\"large\\"\\n                value={inputValue}\\n                onChange={(e) => setInputValue(e.target.value)}\\n                onKeyPress={(e) => e.key === \'Enter\' && handleSendMessage()}\\n                placeholder=\\"输入您的问题...\\"\\n            />\\n            <Button size=\\"large\\" type=\\"primary\\" onClick={handleSendMessage}>发送</Button>\\n        </Space.Compact>\\n        <div style={{marginTop: \'12px\'}}>\\n            <Space>\\n                <Button onClick={handleLoadSampleData}>加载示例数据</Button>\\n                <Button danger onClick={handleClearChat}>清空对话</Button>\\n            </Space>\\n        </div>\\n      </Footer>\\n    </Layout>\\n  );\\n}\\n","totalLines":105}}',
      },
    },
    {
      type: "message",
      data: {
        role: "assistant",
        content:
          '<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/ChatContainer.tsx"}\n  </arguments>\n</use_tool>',
      },
    },
    {
      type: "message",
      data: {
        role: "user",
        content:
          "{\"success\":true,\"data\":{\"filePath\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/ChatContainer.tsx\",\"content\":\"'use client';\\n\\nimport React from 'react';\\nimport { Space } from 'antd';\\nimport MessageItem from './MessageItem';\\n\\ninterface ChatItem {\\n  type: 'message' | 'finalResponse';\\n  data: {\\n    role?: 'user' | 'assistant';\\n    content: string;\\n  } | string;\\n}\\n\\ninterface ChatData {\\n  items: ChatItem[];\\n}\\n\\ninterface ChatContainerProps {\\n  data: ChatData;\\n}\\n\\nconst ChatContainer: React.FC<ChatContainerProps> = ({ data }) => {\\n  return (\\n    <Space direction=\\\"vertical\\\" style={{ width: '100%' }} size=\\\"large\\\">\\n      {data.items.map((item, index) => {\\n        if (item.type === 'message') {\\n          const messageData = item.data as { role: 'user' | 'assistant'; content: string };\\n          return (\\n            <MessageItem\\n              key={index}\\n              role={messageData.role}\\n              content={messageData.content}\\n            />\\n          );\\n        } else if (item.type === 'finalResponse') {\\n          return (\\n            <div key={index} style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px', padding: '16px' }}>\\n                <p style={{ fontWeight: 'bold', color: '#52c41a' }}>最终回复</p>\\n                <div style={{ whiteSpace: 'pre-wrap' }}>\\n                    {typeof item.data === 'string' ? item.data : JSON.stringify(item.data)}\\n                </div>\\n            </div>\\n          );\\n        }\\n        return null;\\n      })}\\n    </Space>\\n  );\\n};\\n\\nexport default ChatContainer; \",\"totalLines\":52}}",
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
          "{\"success\":true,\"data\":{\"filePath\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/MessageItem.tsx\",\"content\":\"'use client';\\n\\nimport React from 'react';\\nimport { Avatar, Card, Space, Typography } from 'antd';\\nimport { UserOutlined, RobotOutlined, ToolOutlined } from '@ant-design/icons';\\nimport ToolCallVisualization from './ToolCallVisualization';\\nimport FileViewer from './FileViewer';\\nimport TimeStamp from './TimeStamp';\\n\\nconst { Text } = Typography;\\n\\ninterface MessageItemProps {\\n  role: 'user' | 'assistant';\\n  content: string;\\n}\\n\\nconst MessageItem: React.FC<MessageItemProps> = ({ role, content }) => {\\n  const isUser = role === 'user';\\n  \\n  // 检查是否包含工具调用\\n  const hasToolCall = content.includes('<use_tool>');\\n  \\n  // 解析工具调用和常规内容\\n  const parseContent = (text: string) => {\\n    if (!hasToolCall) {\\n      return { normalContent: text, toolCalls: [] };\\n    }\\n    \\n    const parts = text.split(/<use_tool>.*?<\\\\/use_tool>/gs);\\n    const toolCallMatches = text.match(/<use_tool>.*?<\\\\/use_tool>/gs) || [];\\n    \\n    return {\\n      normalContent: parts.join('').trim(),\\n      toolCalls: toolCallMatches\\n    };\\n  };\\n  \\n  const { normalContent, toolCalls } = parseContent(content);\\n  \\n  // 检查是否为工具执行结果\\n  const isToolResult = content.includes('FileReadTool(') || content.includes('Batch operation');\\n  \\n  // 解析文件读取结果\\n  const parseFileResults = (text: string) => {\\n    const fileReadMatches = text.match(/FileReadTool\\\\(file_path: \\\"(.*?)\\\"\\\\): ✅\\\\s*\\\\{.*?\\\"content\\\":\\\"(.*?)\\\".*?\\\\}/gs);\\n    return fileReadMatches?.map(match => {\\n      const pathMatch = match.match(/file_path: \\\"(.*?)\\\"/);\\n      const contentMatch = match.match(/\\\"content\\\":\\\"(.*?)\\\"/s);\\n      return {\\n        filePath: pathMatch ? pathMatch[1] : '',\\n        content: contentMatch ? contentMatch[1].replace(/\\\\\\\\n/g, '\\\\n').replace(/\\\\\\\\\\\"/g, '\\\"') : ''\\n      };\\n    }) || [];\\n  };\\n  \\n  const fileResults = parseFileResults(content);\\n  \\n  const author = isUser ? '用户' : 'AI助手';\\n  const avatar = isUser ? <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} /> : <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#7265e6' }} />;\\n  \\n  const messageContent = (\\n    <Space direction=\\\"vertical\\\" style={{width: '100%'}}>\\n      {normalContent && <Text style={{ whiteSpace: 'pre-wrap' }}>{normalContent}</Text>}\\n      {toolCalls.length > 0 && (\\n        <Space direction=\\\"vertical\\\" style={{width: '100%'}}>\\n          {toolCalls.map((toolCall, index) => (\\n            <ToolCallVisualization key={index} toolCallXml={toolCall} />\\n          ))}\\n        </Space>\\n      )}\\n      {isToolResult && (\\n         <Card size=\\\"small\\\" title=\\\"工具执行结果\\\" extra={<ToolOutlined/>}>\\n             {fileResults.length > 0 && (\\n                 <Space direction=\\\"vertical\\\" style={{width: '100%'}}>\\n                     <Text type=\\\"secondary\\\">读取的文件:</Text>\\n                     {fileResults.map((file, index) => (\\n                         <FileViewer \\n                           key={index}\\n                           filePath={file.filePath}\\n                           content={file.content}\\n                           success={true}\\n                         />\\n                     ))}\\n                 </Space>\\n             )}\\n             <details>\\n                 <summary>查看原始输出</summary>\\n                 <pre style={{whiteSpace: 'pre-wrap', background: '#fafafa', padding: '8px', borderRadius: '4px', marginTop: '8px'}}>{content}</pre>\\n             </details>\\n         </Card>\\n      )}\\n    </Space>\\n  );\\n\\n  return (\\n    <div style={{\\n        display: 'flex',\\n        justifyContent: isUser ? 'flex-end' : 'flex-start',\\n        marginBottom: '16px'\\n    }}>\\n        <div style={{\\n            maxWidth: '80%',\\n            display: 'flex',\\n            gap: '12px',\\n            alignItems: 'flex-start',\\n            flexDirection: isUser ? 'row-reverse' : 'row'\\n        }}>\\n            {avatar}\\n            <div style={{\\n                background: isUser ? '#e6f7ff' : '#fff',\\n                borderRadius: '8px',\\n                padding: '8px 12px',\\n                border: `1px solid ${isUser ? '#91d5ff' : '#f0f0f0'}`\\n            }}>\\n                <Space>\\n                    <Text strong>{author}</Text>\\n                    <TimeStamp />\\n                </Space>\\n                <div style={{ marginTop: '8px' }}>\\n                    {messageContent}\\n                </div>\\n            </div>\\n        </div>\\n    </div>\\n  );\\n};\\n\\nexport default MessageItem; \",\"totalLines\":128}}",
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
          "{\"success\":true,\"data\":{\"filePath\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/ToolCallVisualization.tsx\",\"content\":\"'use client';\\n\\nimport React from 'react';\\nimport { Collapse, Space, Typography, Card } from 'antd';\\nimport { CodeOutlined, ForkOutlined, FileTextOutlined } from '@ant-design/icons';\\n\\nconst { Text, Paragraph } = Typography;\\n\\ninterface ToolCallVisualizationProps {\\n  toolCallXml: string;\\n}\\n\\ninterface ToolCall {\\n  tool_name: string;\\n  input?: Record<string, unknown>;\\n}\\n\\ninterface BatchArguments {\\n  description: string;\\n  invocations: ToolCall[];\\n}\\n\\nconst ToolCallVisualization: React.FC<ToolCallVisualizationProps> = ({ toolCallXml }) => {\\n  const parseToolCall = (xml: string) => {\\n    try {\\n      const toolNameMatch = xml.match(/<tool_name>(.*?)<\\\\/tool_name>/s);\\n      const toolName = toolNameMatch ? toolNameMatch[1].trim() : 'Unknown Tool';\\n      \\n      const argumentsMatch = xml.match(/<arguments>(.*?)<\\\\/arguments>/s);\\n      let arguments_data = null;\\n      \\n      if (argumentsMatch) {\\n        try {\\n          arguments_data = JSON.parse(argumentsMatch[1].trim());\\n        } catch {\\n          arguments_data = argumentsMatch[1].trim();\\n        }\\n      }\\n      \\n      return { toolName, arguments: arguments_data };\\n    } catch {\\n      return { toolName: 'Parse Error', arguments: xml };\\n    }\\n  };\\n  \\n  const { toolName, arguments: toolArgs } = parseToolCall(toolCallXml);\\n\\n  const header = (\\n    <Space>\\n      <CodeOutlined />\\n      <Text strong>工具调用: {toolName}</Text>\\n    </Space>\\n  );\\n\\n  const renderBatchTool = (args: BatchArguments) => (\\n    <Space direction=\\\"vertical\\\" style={{width: '100%'}}>\\n        <Text type=\\\"secondary\\\">{args.description}</Text>\\n        {args.invocations.map((invocation, index) => (\\n            <Card size=\\\"small\\\" key={index} title={\\n                <Space>\\n                    <ForkOutlined />\\n                    <Text style={{ fontSize: '14px' }}>{invocation.tool_name}</Text>\\n                </Space>\\n            }>\\n                {(() => {\\n                    const filePath = invocation.input?.file_path;\\n                    if (typeof filePath === 'string' && filePath) {\\n                        return (\\n                            <Space>\\n                                <FileTextOutlined/>\\n                                <Text code>{filePath}</Text>\\n                            </Space>\\n                        );\\n                    }\\n                    return null;\\n                })()}\\n            </Card>\\n        ))}\\n    </Space>\\n  );\\n\\n  const renderSingleTool = () => (\\n    <Paragraph>\\n      <Text type=\\\"secondary\\\">参数:</Text>\\n      <pre style={{whiteSpace: 'pre-wrap', background: '#fafafa', padding: '8px', borderRadius: '4px'}}>{JSON.stringify(toolArgs, null, 2)}</pre>\\n    </Paragraph>\\n  );\\n  \\n  return (\\n    <Collapse>\\n        <Collapse.Panel header={header} key=\\\"1\\\">\\n            {toolName === 'BatchTool' && toolArgs ? \\n                renderBatchTool(toolArgs as BatchArguments) : \\n                renderSingleTool()\\n            }\\n        </Collapse.Panel>\\n    </Collapse>\\n  );\\n};\\n\\nexport default ToolCallVisualization; \",\"totalLines\":101}}",
      },
    },
    {
      type: "message",
      data: {
        role: "assistant",
        content:
          '<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/FileViewer.tsx"}\n  </arguments>\n</use_tool>',
      },
    },
    {
      type: "message",
      data: {
        role: "user",
        content:
          "{\"success\":true,\"data\":{\"filePath\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/FileViewer.tsx\",\"content\":\"'use client';\\n\\nimport React from 'react';\\nimport { Collapse, Space, Typography, Tag } from 'antd';\\nimport { FileTextOutlined, FileMarkdownOutlined, FileUnknownOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';\\n\\nconst { Text, Paragraph } = Typography;\\n\\ninterface FileViewerProps {\\n  filePath: string;\\n  content: string;\\n  success?: boolean;\\n}\\n\\nconst FileViewer: React.FC<FileViewerProps> = ({ filePath, content, success = true }) => {\\n  const getFileExtension = (path: string) => path.split('.').pop()?.toLowerCase() || '';\\n  const getFileName = (path: string) => path.split('/').pop() || path;\\n  \\n  const fileExtension = getFileExtension(filePath);\\n  const fileName = getFileName(filePath);\\n\\n  const getFileIcon = (ext: string) => {\\n    switch (ext) {\\n      case 'js': case 'ts': case 'jsx': case 'tsx': return <FileTextOutlined />;\\n      case 'json': return <FileTextOutlined />;\\n      case 'md': case 'readme': return <FileMarkdownOutlined />;\\n      case 'css': case 'html': return <FileTextOutlined />;\\n      default: return <FileUnknownOutlined />;\\n    }\\n  };\\n\\n  const header = (\\n    <Space>\\n        {getFileIcon(fileExtension)}\\n        <Text strong>{fileName}</Text>\\n        <Text type=\\\"secondary\\\">{filePath}</Text>\\n        {success ? <Tag icon={<CheckCircleOutlined />} color=\\\"success\\\">成功</Tag> : <Tag icon={<CloseCircleOutlined />} color=\\\"error\\\">失败</Tag>}\\n    </Space>\\n  );\\n\\n  return (\\n    <Collapse>\\n      <Collapse.Panel header={header} key={filePath}>\\n        <Paragraph>\\n          <pre style={{whiteSpace: 'pre-wrap', background: '#fafafa', padding: '8px', borderRadius: '4px', maxHeight: '300px', overflowY: 'auto'}}>\\n            {content}\\n          </pre>\\n        </Paragraph>\\n      </Collapse.Panel>\\n    </Collapse>\\n  );\\n};\\n\\nexport default FileViewer; \",\"totalLines\":54}}",
      },
    },
    {
      type: "message",
      data: {
        role: "assistant",
        content:
          '<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/TimeStamp.tsx"}\n  </arguments>\n</use_tool>',
      },
    },
    {
      type: "message",
      data: {
        role: "user",
        content:
          '{"success":true,"data":{"filePath":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/TimeStamp.tsx","content":"\'use client\';\\n\\nimport React from \'react\';\\n\\ninterface TimeStampProps {\\n  timestamp?: Date;\\n}\\n\\nconst TimeStamp: React.FC<TimeStampProps> = ({ timestamp }) => {\\n  const time = timestamp || new Date();\\n  \\n  const formatTime = (date: Date) => {\\n    return date.toLocaleTimeString(\'zh-CN\', {\\n      hour: \'2-digit\',\\n      minute: \'2-digit\',\\n      second: \'2-digit\'\\n    });\\n  };\\n  \\n  return (\\n    <span className=\\"text-xs text-gray-400 ml-2\\">\\n      {formatTime(time)}\\n    </span>\\n  );\\n};\\n\\nexport default TimeStamp; ","totalLines":27}}',
      },
    },
    {
      type: "message",
      data: {
        role: "assistant",
        content:
          '<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/LoadingMessage.tsx"}\n  </arguments>\n</use_tool>',
      },
    },
    {
      type: "message",
      data: {
        role: "user",
        content:
          "{\"success\":true,\"data\":{\"filePath\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/LoadingMessage.tsx\",\"content\":\"'use client';\\n\\nimport React from 'react';\\nimport { Spin, Alert, Space } from 'antd';\\nimport { LoadingOutlined } from '@ant-design/icons';\\n\\ninterface LoadingMessageProps {\\n  stage?: 'thinking' | 'calling_tool' | 'processing';\\n  toolName?: string;\\n}\\n\\nconst LoadingMessage: React.FC<LoadingMessageProps> = ({ stage = 'thinking', toolName }) => {\\n  const getStageText = () => {\\n    switch (stage) {\\n      case 'thinking':\\n        return '🤔 正在思考...';\\n      case 'calling_tool':\\n        return `🔧 正在调用工具: ${toolName || ''}`;\\n      case 'processing':\\n        return '⚙️ 正在处理...';\\n      default:\\n        return '💭 正在工作...';\\n    }\\n  };\\n\\n  return (\\n    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>\\n      <div style={{ maxWidth: '80%' }}>\\n        <Alert\\n          message={\\n            <Space>\\n              <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />\\n              <span style={{ marginLeft: 8 }}>{getStageText()}</span>\\n            </Space>\\n          }\\n          type=\\\"info\\\"\\n          showIcon\\n        />\\n      </div>\\n    </div>\\n  );\\n};\\n\\nexport default LoadingMessage; \",\"totalLines\":44}}",
      },
    },
    {
      type: "message",
      data: {
        role: "assistant",
        content:
          '<use_tool>\n  <tool_name>FileReadTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/antdx/page.tsx"}\n  </arguments>\n</use_tool>',
      },
    },
    {
      type: "message",
      data: {
        role: "user",
        content:
          '{"success":true,"data":{"filePath":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/antdx/page.tsx","content":"\\"use client\\";\\nimport React, { useState } from \\"react\\";\\nimport { ThoughtChain } from \\"@ant-design/x\\";\\nimport type { ThoughtChainProps, ThoughtChainItem } from \\"@ant-design/x\\";\\n\\nimport { CheckCircleOutlined, MoreOutlined } from \\"@ant-design/icons\\";\\n\\nimport { Card, Typography, Button } from \\"antd\\";\\n\\nconst { Paragraph, Text } = Typography;\\n\\nconst customizationProps: ThoughtChainItem = {\\n  title: \\"Thought Chain Item Title\\",\\n  description: \\"description\\",\\n  icon: <CheckCircleOutlined />,\\n  extra: <Button type=\\"text\\" icon={<MoreOutlined />} />,\\n  footer: <Button block>Thought Chain Item Footer</Button>,\\n  content: (\\n    <Typography>\\n      <Paragraph>\\n        In the process of internal desktop applications development, many\\n        different design specs and implementations would be involved, which\\n        might cause designers and developers difficulties and duplication and\\n        reduce the efficiency of development.\\n      </Paragraph>\\n      <Paragraph>\\n        After massive project practice and summaries, Ant Design, a design\\n        language for background applications, is refined by Ant UED Team, which\\n        aims to{\\" \\"}\\n        <Text strong>\\n          uniform the user interface specs for internal background projects,\\n          lower the unnecessary cost of design differences and implementation\\n          and liberate the resources of design and front-end development\\n        </Text>\\n      </Paragraph>\\n    </Typography>\\n  ),\\n};\\n\\nconst items: ThoughtChainProps[\\"items\\"] = [\\n  {\\n    ...customizationProps,\\n    status: \\"success\\",\\n    key: \'item-1\'\\n  },\\n  {\\n    ...customizationProps,\\n    status: \\"error\\",\\n    key: \'item-2\'\\n  },\\n  {\\n    ...customizationProps,\\n    status: \\"pending\\",\\n    key: \'item-3\'\\n  },\\n];\\n\\nexport default function AntdX() {\\n\\n  const [expandedKeys, setExpandedKeys] = useState([\'item-2\']);\\n\\n  const collapsible: ThoughtChainProps[\'collapsible\'] = {\\n    expandedKeys,\\n    onExpand: (keys: string[]) => {\\n      setExpandedKeys(keys);\\n    },\\n  };\\n\\n  return (\\n    <Card style={{ width: 500 }}>\\n      <ThoughtChain items={items} collapsible={collapsible} />\\n    </Card>\\n  );\\n}\\n","totalLines":75}}',
      },
    },
    {
      type: "message",
      data: {
        role: "assistant",
        content:
          '<use_tool>\n  <tool_name>FileWriteTool</tool_name>\n  <arguments>\n    {"file_path":"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/ARCHITECTURE.md",\n     "content":"# 前端项目架构\\n\\n## 项目概述\\n\\n这是一个基于 Next.js 15.3.3 的前端应用，使用 React 19 和 Ant Design 构建，主要功能是提供一个 AI 对话可视化界面，展示与 AI 助手的交互过程，包括工具调用和结果展示。\\n\\n## 技术栈\\n\\n- **Next.js 15.3.3**: React 框架，提供服务端渲染和路由功能\\n- **React 19**: UI 库\\n- **TypeScript**: 类型系统\\n- **Ant Design 5.26.0**: UI 组件库\\n- **@ant-design/x 1.4.0**: Ant Design 扩展组件\\n\\n## 项目结构\\n\\n```\\nfrontend/\\n├── app/                    # Next.js 应用目录\\n│   ├── antdx/              # Ant Design X 示例页面\\n│   │   └── page.tsx        # ThoughtChain 组件示例\\n│   ├── components/         # 共享组件\\n│   │   ├── ChatContainer.tsx       # 聊天容器组件\\n│   │   ├── FileViewer.tsx          # 文件查看器组件\\n│   │   ├── LoadingMessage.tsx      # 加载状态组件\\n│   │   ├── MessageItem.tsx         # 消息项组件\\n│   │   ├── TimeStamp.tsx           # 时间戳组件\\n│   │   └── ToolCallVisualization.tsx # 工具调用可视化组件\\n│   ├── globals.css         # 全局样式\\n│   ├── layout.tsx          # 应用布局\\n│   ├── page.tsx            # 主页面\\n│   └── registry.tsx        # Ant Design 注册\\n├── public/                 # 静态资源\\n├── next.config.ts          # Next.js 配置\\n├── package.json            # 项目依赖\\n└── tsconfig.json           # TypeScript 配置\\n```\\n\\n## 架构图\\n\\n```\\n+-------------------+\\n|     页面层        |\\n|  +-------------+  |\\n|  |   page.tsx  |  |\\n|  +-------------+  |\\n+--------+----------+\\n         |\\n         v\\n+-------------------+\\n|     组件层        |\\n|  +-------------+  |\\n|  |ChatContainer|  |\\n|  +-------------+  |\\n|         |         |\\n|         v         |\\n|  +-------------+  |\\n|  | MessageItem |  |\\n|  +-------------+  |\\n|    /        \\\\     |\\n|   v          v    |\\n|+-------+ +-------+|\\n||FileView| |ToolCall||\\n|+-------+ +-------+|\\n+-------------------+\\n\\n```\\n\\n## 组件关系\\n\\n- **page.tsx**: 主页面，包含布局和状态管理\\n  - **ChatContainer**: 聊天内容容器，渲染消息列表\\n    - **MessageItem**: 单条消息组件，根据角色和内容类型渲染不同样式\\n      - **ToolCallVisualization**: 工具调用可视化组件\\n      - **FileViewer**: 文件内容查看组件\\n      - **TimeStamp**: 时间戳组件\\n  - **LoadingMessage**: 加载状态组件，显示不同阶段的加载状态\\n\\n## 数据流\\n\\n1. 用户在输入框中输入消息\\n2. 消息被添加到聊天数据中\\n3. ChatContainer 组件接收聊天数据并渲染\\n4. MessageItem 组件解析消息内容，识别普通文本、工具调用和工具结果\\n5. 根据内容类型，渲染相应的子组件（ToolCallVisualization、FileViewer 等）\\n\\n## 扩展功能\\n\\n- **antdx/page.tsx**: 展示了 Ant Design X 的 ThoughtChain 组件，可用于展示思考链和处理流程\\n"}\n  </arguments>\n</use_tool>',
      },
    },
  ],
  metadata: {
    sessionId: "demo-session-1",
    createdAt: new Date(Date.now() - 300000),
    updatedAt: new Date(),
  },
};

export default function Home() {
  const [chatData, setChatData] = useState<ChatData>(sampleData);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // 添加用户消息到聊天数据
    const newMessage = {
      type: "message" as const,
      id: `msg-${Date.now()}`,
      data: {
        role: "user" as const,
        content: inputValue,
        timestamp: new Date(),
      },
    };

    setChatData((prev) => ({
      ...prev,
      items: [...prev.items, newMessage],
      metadata: {
        ...prev.metadata,
        updatedAt: new Date(),
      },
    }));

    setInputValue("");
  };

  const handleClearChat = () => {
    setChatData({
      items: [],
      metadata: {
        sessionId: `session-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  };

  const handleLoadSampleData = () => {
    setChatData({
      ...sampleData,
      metadata: {
        ...sampleData.metadata,
        updatedAt: new Date(),
      },
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Title level={3} style={{ margin: 0 }}>
            AI 对话可视化
          </Title>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
            <Button 
              type="link" 
              href="/test-transform"
              target="_blank"
              style={{ fontSize: "12px" }}
            >
              数据转换工具
            </Button>
            <Button 
              type="link" 
              href="/new-format"
              target="_blank"
              style={{ fontSize: "12px" }}
            >
              新格式演示
            </Button>
            {chatData.metadata?.sessionId && (
              <span style={{ color: "#666", fontSize: "12px" }}>
                会话ID: {chatData.metadata.sessionId}
              </span>
            )}
          </div>
        </div>
      </Header>
      <Content
        style={{ padding: "24px", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#f5f5f5",
            padding: "24px",
            borderRadius: "8px",
          }}
        >
          <ChatContainer data={chatData} />
        </div>
      </Content>
      <Footer style={{ padding: "16px 24px", background: "#fff" }}>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            size="large"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="输入您的问题..."
          />
          <Button size="large" type="primary" onClick={handleSendMessage}>
            发送
          </Button>
        </Space.Compact>
        <div style={{ marginTop: "12px" }}>
          <Space>
            <Button onClick={handleLoadSampleData}>加载示例数据</Button>
            <Button danger onClick={handleClearChat}>
              清空对话
            </Button>
            <span style={{ color: "#999", fontSize: "12px" }}>
              共 {chatData.items.length} 条消息
            </span>
          </Space>
        </div>
      </Footer>
    </Layout>
  );
}
