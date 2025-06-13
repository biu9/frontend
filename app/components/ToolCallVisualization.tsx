'use client';

import React from 'react';
import { Collapse, Space, Typography, Card } from 'antd';
import { CodeOutlined, ForkOutlined, FileTextOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface ToolCallVisualizationProps {
  toolCallXml: string;
}

interface ToolCall {
  tool_name: string;
  input?: Record<string, unknown>;
}

interface BatchArguments {
  description: string;
  invocations: ToolCall[];
}

const ToolCallVisualization: React.FC<ToolCallVisualizationProps> = ({ toolCallXml }) => {
  const parseToolCall = (xml: string) => {
    try {
      const toolNameMatch = xml.match(/<tool_name>(.*?)<\/tool_name>/s);
      const toolName = toolNameMatch ? toolNameMatch[1].trim() : 'Unknown Tool';
      
      const argumentsMatch = xml.match(/<arguments>(.*?)<\/arguments>/s);
      let arguments_data = null;
      
      if (argumentsMatch) {
        try {
          arguments_data = JSON.parse(argumentsMatch[1].trim());
        } catch {
          arguments_data = argumentsMatch[1].trim();
        }
      }
      
      return { toolName, arguments: arguments_data };
    } catch {
      return { toolName: 'Parse Error', arguments: xml };
    }
  };
  
  const { toolName, arguments: toolArgs } = parseToolCall(toolCallXml);

  const header = (
    <Space>
      <CodeOutlined />
      <Text strong>工具调用: {toolName}</Text>
    </Space>
  );

  const renderBatchTool = (args: BatchArguments) => (
    <Space direction="vertical" style={{width: '100%'}}>
        <Text type="secondary">{args.description}</Text>
        {args.invocations.map((invocation, index) => (
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

  const renderSingleTool = () => (
    <Paragraph>
      <Text type="secondary">参数:</Text>
      <pre style={{whiteSpace: 'pre-wrap', background: '#fafafa', padding: '8px', borderRadius: '4px'}}>{JSON.stringify(toolArgs, null, 2)}</pre>
    </Paragraph>
  );
  
  return (
    <Collapse>
        <Collapse.Panel header={header} key="1">
            {toolName === 'BatchTool' && toolArgs ? 
                renderBatchTool(toolArgs as BatchArguments) : 
                renderSingleTool()
            }
        </Collapse.Panel>
    </Collapse>
  );
};

export default ToolCallVisualization; 