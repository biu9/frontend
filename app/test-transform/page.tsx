/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { Button, Card, Space, Typography, message, Input, Divider, Tabs } from 'antd';
import { PlayCircleOutlined, CopyOutlined, CheckOutlined, SwapOutlined } from '@ant-design/icons';
import ChatContainer from '../components/ChatContainer';
import MessageItem from '../components/MessageItem';
import { processAndTransformChatData } from '../utils/exampleUsage';
import { ChatMessageContent } from '../utils/dataTransformer';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 原始字符串格式的示例数据
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
      "content": "{\"success\":true,\"data\":{\"filePath\":\"/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/MessageItem.tsx\",\"content\":\"'use client';\\n\\nimport React from 'react';\\nimport { Avatar, Card, Space, Typography } from 'antd';\\nimport { UserOutlined, RobotOutlined } from '@ant-design/icons';\\n\\ninterface MessageItemProps {\\n  role: 'user' | 'assistant';\\n  content: string;\\n}\\n\\nconst MessageItem: React.FC<MessageItemProps> = ({ role, content }) => {\\n  return (\\n    <div>MessageItem Component</div>\\n  );\\n};\\n\\nexport default MessageItem;\",\"totalLines\":231}}"
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

// 新格式数据（转换后的对象格式）
const exampleNewFormatData = [
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
      "content": {
        "toolName": "FileReadTool",
        "arguments": {
          "file_path": "/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/MessageItem.tsx"
        }
      }
    }
  },
  {
    "type": "message",
    "data": {
      "role": "user",
      "content": {
        "success": true,
        "data": {
          "filePath": "/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/MessageItem.tsx",
          "content": "'use client';\n\nimport React from 'react';\nimport { Avatar, Card, Space, Typography } from 'antd';\nimport { UserOutlined, RobotOutlined } from '@ant-design/icons';\n\ninterface MessageItemProps {\n  role: 'user' | 'assistant';\n  content: string;\n}\n\nconst MessageItem: React.FC<MessageItemProps> = ({ role, content }) => {\n  return (\n    <div>MessageItem Component</div>\n  );\n};\n\nexport default MessageItem;",
          "totalLines": 231
        }
      }
    }
  },
  {
    "type": "message",
    "data": {
      "role": "assistant",
      "content": {
        "toolName": "FileReadTool",
        "arguments": {
          "file_path": "/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/ToolCallVisualization.tsx"
        }
      }
    }
  },
  {
    "type": "message",
    "data": {
      "role": "user",
      "content": {
        "success": true,
        "data": {
          "filePath": "/Users/taohongyu/Desktop/insight/kai-node-demo/frontend/app/components/ToolCallVisualization.tsx",
          "content": "'use client';\n\nimport React, { useState } from 'react';",
          "totalLines": 223
        }
      }
    }
  },
  {
    "type": "finalResponse",
    "data": "项目使用MessageItem组件渲染聊天消息，主要特点：\n\n1. 区分用户和AI助手消息，使用不同样式和头像\n2. 解析消息内容，识别普通文本、工具调用和执行结果\n3. 工具调用通过ToolCallVisualization组件展示，支持展开/收起\n4. 文件读取结果用FileViewer组件显示，支持预览和完整查看\n5. 使用Ant Design组件构建UI，包含时间戳、状态标签等\n6. 根据消息类型应用不同背景色和视觉效果"
  }
];

// 将字符串格式转换为对象格式的函数
function convertStringToObjectFormat(rawData: any[]): any[] {
  return rawData.map(item => {
    if (item.type === 'message' && typeof item.data === 'object' && item.data.content) {
      const content = item.data.content;
      
      // 检查是否是工具调用（XML格式）
      if (typeof content === 'string' && content.includes('<use_tool>')) {
        const toolNameMatch = content.match(/<tool_name>(.*?)<\/tool_name>/s);
        const argumentsMatch = content.match(/<arguments>(.*?)<\/arguments>/s);
        
        if (toolNameMatch) {
          let parsedArgs = {};
          if (argumentsMatch) {
            try {
              parsedArgs = JSON.parse(argumentsMatch[1].trim());
            } catch {
              parsedArgs = { raw: argumentsMatch[1].trim() };
            }
          }
          
          return {
            ...item,
            data: {
              ...item.data,
              content: {
                toolName: toolNameMatch[1].trim(),
                arguments: parsedArgs
              } as ChatMessageContent
            }
          };
        }
      }
      
      // 检查是否是工具执行结果（JSON格式）
      if (typeof content === 'string') {
        try {
          const parsed = JSON.parse(content);
          if (parsed.success !== undefined && parsed.data) {
            return {
              ...item,
              data: {
                ...item.data,
                content: {
                  success: parsed.success,
                  data: parsed.data
                } as ChatMessageContent
              }
            };
          }
        } catch {
          // 不是JSON格式，保持原样
        }
      }
    }
    
    return item;
  });
}

export default function TestTransformPage() {
  const [transformedData, setTransformedData] = useState<any>(null);
  const [newFormatData, setNewFormatData] = useState<any>(null);
  const [inputData, setInputData] = useState<string>(JSON.stringify(exampleRawData, null, 2));
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'traditional' | 'convert'>('traditional');

  // 传统的转换方法（转换为渲染用的格式）
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

  // 新的转换方法（字符串转对象格式）
  const handleConvertToNewFormat = () => {
    try {
      const rawData = JSON.parse(inputData);
      const convertedData = convertStringToObjectFormat(rawData);
      setNewFormatData(convertedData);
      message.success('成功转换为新的对象格式！');
    } catch (error) {
      message.error('转换失败，请检查数据格式');
    }
  };

  const handleCopyData = async (data: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
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

  const loadNewFormatExample = () => {
    setInputData(JSON.stringify(exampleNewFormatData, null, 2));
    message.info('已加载新格式示例数据');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>聊天数据转换工具</Title>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={(key) => setActiveTab(key as 'traditional' | 'convert')}
        items={[
          {
            key: 'traditional',
            label: '传统转换（渲染格式）',
            children: (
              <div>
                <Paragraph>
                  将原始聊天数据转换为前端可渲染的格式。转换规则：
                </Paragraph>
                <ul>
                  <li>第一个 user 消息：用户的原始问题</li>
                  <li>assistant + user 对：AI工具调用 + 工具执行结果</li>
                  <li>finalResponse：最终回复</li>
                </ul>
              </div>
            )
          },
          {
            key: 'convert',
            label: '格式转换（字符串→对象）',
            children: (
              <div>
                <Paragraph>
                  将字符串格式的content转换为结构化的ChatMessageContent对象：
                </Paragraph>
                <ul>
                  <li><strong>工具调用</strong>：XML字符串 → `{'{ toolName: string, arguments: object }'}`</li>
                  <li><strong>工具结果</strong>：JSON字符串 → `{'{ success: boolean, data: object }'}`</li>
                  <li><strong>普通文本</strong>：保持字符串格式</li>
                </ul>
              </div>
            )
          }
        ]}
      />

      <Divider />

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* 输入区域 */}
        <Card 
          title="原始数据输入" 
          style={{ flex: '1', minWidth: '400px' }}
          extra={
            <Space>
              <Button type="link" onClick={loadExample}>
                加载原始格式示例
              </Button>
              <Button type="link" onClick={loadNewFormatExample}>
                加载对象格式示例
              </Button>
            </Space>
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
            <Space>
              {activeTab === 'traditional' ? (
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />}
                  onClick={handleTransform}
                >
                  转换为渲染格式
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  icon={<SwapOutlined />}
                  onClick={handleConvertToNewFormat}
                >
                  转换为对象格式
                </Button>
              )}
            </Space>
          </div>
        </Card>

        {/* 转换结果区域 */}
        {(transformedData || newFormatData) && (
          <Card 
            title={activeTab === 'traditional' ? "渲染格式转换结果" : "对象格式转换结果"} 
            style={{ flex: '1', minWidth: '400px' }}
            extra={
              <Button 
                type="link" 
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={() => {
                  const dataToCopy = activeTab === 'traditional' ? transformedData : newFormatData;
                  handleCopyData(dataToCopy);
                }}
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
                {JSON.stringify(
                  activeTab === 'traditional' ? transformedData : newFormatData, 
                  null, 
                  2
                )}
              </pre>
            </div>
          </Card>
        )}
      </div>

      {/* 渲染效果预览 */}
      {(transformedData || newFormatData) && (
        <>
          <Divider />
          <Card title={`渲染效果预览 - ${activeTab === 'traditional' ? '传统格式' : '新对象格式'}`} style={{ marginTop: '24px' }}>
            <div style={{ 
              background: '#f5f5f5', 
              borderRadius: '8px', 
              padding: '24px',
              maxHeight: '600px',
              overflow: 'auto'
            }}>
              {activeTab === 'traditional' && transformedData && (
                <ChatContainer data={transformedData} />
              )}
              {activeTab === 'convert' && newFormatData && (
                <div>
                  <Text type="secondary">新格式数据可以直接用于MessageItem组件渲染：</Text>
                  <div style={{ marginTop: '16px' }}>
                    {newFormatData.map((item: any, index: number) => {
                      if (item.type === 'message') {
                        return (
                          <div key={index} style={{ marginBottom: '16px' }}>
                            <MessageItem 
                              role={item.data.role} 
                              content={item.data.content} 
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
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