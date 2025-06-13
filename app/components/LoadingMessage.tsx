'use client';

import React from 'react';
import { Spin, Alert, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingMessageProps {
  stage?: 'thinking' | 'calling_tool' | 'processing';
  toolName?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ stage = 'thinking', toolName }) => {
  const getStageText = () => {
    switch (stage) {
      case 'thinking':
        return '🤔 正在思考...';
      case 'calling_tool':
        return `🔧 正在调用工具: ${toolName || ''}`;
      case 'processing':
        return '⚙️ 正在处理...';
      default:
        return '💭 正在工作...';
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: '80%' }}>
        <Alert
          message={
            <Space>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
              <span style={{ marginLeft: 8 }}>{getStageText()}</span>
            </Space>
          }
          type="info"
          showIcon
        />
      </div>
    </div>
  );
};

export default LoadingMessage; 