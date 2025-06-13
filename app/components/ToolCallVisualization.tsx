'use client';

import React from 'react';
import { Collapse, Space, Typography, Card, Tag } from 'antd';
import { CodeOutlined, ForkOutlined, FileTextOutlined } from '@ant-design/icons';
import { ToolCall, BatchToolCall, BatchInvocation } from '../types/chat';

const { Text, Paragraph } = Typography;

interface ToolCallVisualizationProps {
  toolCall?: ToolCall;
  toolCallXml?: string; // 保持向后兼容
  compact?: boolean;
}

const ToolCallVisualization: React.FC<ToolCallVisualizationProps> = ({ 
  toolCall, 
  toolCallXml, 
  compact = false 
}) => {
  // 如果传入了新的toolCall对象，使用它；否则解析XML（向后兼容）
  const parsedToolCall = toolCall || parseToolCallFromXml(toolCallXml || '');
  
  if (!parsedToolCall) {
    return null;
  }

  const { tool_name, arguments: toolArgs } = parsedToolCall;

  const header = (
    <Space>
      <CodeOutlined />
      <Text strong>工具调用: {tool_name}</Text>
      {compact && <Tag color="blue">紧凑模式</Tag>}
    </Space>
  );

  const renderBatchTool = (args: BatchToolCall) => {
    if (!args.invocations) return null;
    
    return (
      <Space direction="vertical" style={{width: '100%'}}>
        <Text type="secondary">{args.description}</Text>
        {args.invocations.map((invocation: BatchInvocation, index: number) => (
          <Card size="small" key={index} title={
            <Space>
              <ForkOutlined />
              <Text style={{ fontSize: '14px' }}>{invocation.tool_name}</Text>
            </Space>
          }>
            {(() => {
              const filePath = invocation.input?.file_path;
              if (typeof filePath === 'string' && filePath) {
                return (
                  <Space>
                    <FileTextOutlined/>
                    <Text code>{filePath}</Text>
                  </Space>
                );
              }
              return null;
            })()}
          </Card>
        ))}
      </Space>
    );
  };

  const renderSingleTool = () => (
    <Paragraph>
      <Text type="secondary">参数:</Text>
      <pre style={{
        whiteSpace: 'pre-wrap', 
        background: '#fafafa', 
        padding: '8px', 
        borderRadius: '4px',
        fontSize: compact ? '12px' : '14px'
      }}>
        {JSON.stringify(toolArgs, null, compact ? 1 : 2)}
      </pre>
    </Paragraph>
  );
  
  if (compact) {
    return (
      <Card size="small" title={header}>
        {tool_name === 'BatchTool' && toolArgs ? 
          renderBatchTool(toolArgs as BatchToolCall) : 
          renderSingleTool()
        }
      </Card>
    );
  }
  
  return (
    <Collapse>
      <Collapse.Panel header={header} key="1">
        {tool_name === 'BatchTool' && toolArgs ? 
          renderBatchTool(toolArgs as BatchToolCall) : 
          renderSingleTool()
        }
      </Collapse.Panel>
    </Collapse>
  );
};

// 解析XML格式的工具调用（向后兼容）
function parseToolCallFromXml(xml: string): ToolCall | null {
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
        arguments_data = { raw: argumentsMatch[1].trim() };
      }
    }
    
    return {
      tool_name: toolName,
      arguments: arguments_data
    };
  } catch {
    return null;
  }
}

export default ToolCallVisualization; 