'use client';

import React from 'react';
import { Space } from 'antd';
import MessageItem from './MessageItem';

interface ChatItem {
  type: 'message' | 'finalResponse';
  data: {
    role?: 'user' | 'assistant';
    content: string;
  } | string;
}

interface ChatData {
  items: ChatItem[];
}

interface ChatContainerProps {
  data: ChatData;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ data }) => {
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {data.items.map((item, index) => {
        if (item.type === 'message') {
          const messageData = item.data as { role: 'user' | 'assistant'; content: string };
          return (
            <MessageItem
              key={index}
              role={messageData.role}
              content={messageData.content}
            />
          );
        } else if (item.type === 'finalResponse') {
          return (
            <div key={index} style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px', padding: '16px' }}>
                <p style={{ fontWeight: 'bold', color: '#52c41a' }}>最终回复</p>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                    {typeof item.data === 'string' ? item.data : JSON.stringify(item.data)}
                </div>
            </div>
          );
        }
        return null;
      })}
    </Space>
  );
};

export default ChatContainer; 