'use client';

import React from 'react';
import { Space, Alert, Empty } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import MessageItem from './MessageItem';
import FinalResponse from './FinalResponse';
import { ChatData, ChatItem, ChatMessage } from '../types/chat';

interface ChatContainerProps {
  data: ChatData;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ data }) => {
  if (!data.items || data.items.length === 0) {
    return (
      <Empty
        image={<CommentOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
        description="暂无对话内容"
      />
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {data.items.map((item: ChatItem, index: number) => {
        // 处理消息类型
        if (item.type === 'message') {
          const messageData = item.data as ChatMessage;
          return (
            <MessageItem
              key={item.id || index}
              role={messageData.role}
              content={messageData.content}
            />
          );
        } 
        // 处理最终回复类型 - 使用新的 FinalResponse 组件
        else if (item.type === 'finalResponse') {
          const content = typeof item.data === 'string' ? item.data : JSON.stringify(item.data);
          return (
            <FinalResponse
              key={item.id || index}
              content={content}
              id={item.id}
            />
          );
        }
        // 处理错误类型
        else if (item.type === 'error') {
          const content = typeof item.data === 'string' ? item.data : JSON.stringify(item.data);
          return (
            <Alert
              key={item.id || index}
              message="错误"
              description={content}
              type="error"
              style={{ borderRadius: '8px' }}
            />
          );
        }
        // 处理思考类型
        else if (item.type === 'thinking') {
          const content = typeof item.data === 'string' ? item.data : JSON.stringify(item.data);
          return (
            <Alert
              key={item.id || index}
              message="AI思考中..."
              description={content}
              type="info"
              style={{ borderRadius: '8px' }}
            />
          );
        }
        
        return null;
      })}
    </Space>
  );
};

export default ChatContainer; 