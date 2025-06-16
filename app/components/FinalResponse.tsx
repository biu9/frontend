/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, Typography } from 'antd';
import { CheckCircleOutlined, BookOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Title } = Typography;

interface FinalResponseProps {
  content: string;
  id?: string;
}

const FinalResponse: React.FC<FinalResponseProps> = ({ content }) => {
  // 自定义 markdown 组件样式
  const markdownComponents = {
    // 标题样式
    h1: ({ children }: any) => (
      <Title level={1} style={{ color: '#52c41a', marginTop: '24px', marginBottom: '16px' }}>
        {children}
      </Title>
    ),
    h2: ({ children }: any) => (
      <Title level={2} style={{ color: '#52c41a', marginTop: '20px', marginBottom: '12px' }}>
        {children}
      </Title>
    ),
    h3: ({ children }: any) => (
      <Title level={3} style={{ color: '#52c41a', marginTop: '16px', marginBottom: '8px' }}>
        {children}
      </Title>
    ),
    h4: ({ children }: any) => (
      <Title level={4} style={{ color: '#52c41a', marginTop: '12px', marginBottom: '6px' }}>
        {children}
      </Title>
    ),
    // 段落样式
    p: ({ children }: any) => (
      <p style={{ 
        marginBottom: '12px', 
        lineHeight: '1.6',
        color: '#262626'
      }}>
        {children}
      </p>
    ),
    // 列表样式
    ul: ({ children }: any) => (
      <ul style={{ 
        marginLeft: '20px', 
        marginBottom: '12px',
        color: '#262626'
      }}>
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol style={{ 
        marginLeft: '20px', 
        marginBottom: '12px',
        color: '#262626'
      }}>
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li style={{ marginBottom: '4px', lineHeight: '1.5' }}>
        {children}
      </li>
    ),
    // 代码块样式
    code: ({ inline, children, ...props }: any) => 
      inline ? (
        <code
          style={{
            background: '#f6f8fa',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#d73a49',
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace'
          }}
          {...props}
        >
          {children}
        </code>
      ) : (
        <pre
          style={{
            background: '#f6f8fa',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.4',
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            marginBottom: '16px'
          }}
        >
          <code {...props}>{children}</code>
        </pre>
      ),
    // 表格样式
    table: ({ children }: any) => (
      <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #d9d9d9'
        }}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead style={{ background: '#fafafa' }}>
        {children}
      </thead>
    ),
    th: ({ children }: any) => (
      <th style={{ 
        padding: '8px 16px', 
        border: '1px solid #d9d9d9',
        textAlign: 'left',
        fontWeight: 'bold'
      }}>
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td style={{ 
        padding: '8px 16px', 
        border: '1px solid #d9d9d9'
      }}>
        {children}
      </td>
    ),
    // 引用块样式
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: '4px solid #52c41a',
        paddingLeft: '16px',
        margin: '16px 0',
        color: '#666',
        fontStyle: 'italic',
        background: '#f9f9f9',
        padding: '12px 16px',
        borderRadius: '0 4px 4px 0'
      }}>
        {children}
      </blockquote>
    ),
    // 分割线样式
    hr: () => (
      <hr style={{
        margin: '24px 0',
        border: 'none',
        borderTop: '1px solid #e8e8e8'
      }} />
    ),
    // 强调样式
    strong: ({ children }: any) => (
      <strong style={{ color: '#262626', fontWeight: 'bold' }}>
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em style={{ color: '#666', fontStyle: 'italic' }}>
        {children}
      </em>
    ),
    // 链接样式
    a: ({ children, href, ...props }: any) => (
      <a 
        href={href}
        style={{ 
          color: '#1890ff', 
          textDecoration: 'none',
          borderBottom: '1px solid transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderBottomColor = '#1890ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderBottomColor = 'transparent';
        }}
        {...props}
      >
        {children}
      </a>
    )
  };

  return (
    <Card
      style={{
        background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)',
        border: '1px solid #b7eb8f',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
          <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '16px' }}>
            最终回复
          </span>
          <BookOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
        </div>
      }
      size="small"
    >
      <div style={{ 
        fontSize: '15px',
        lineHeight: '1.6'
      }}>
        <ReactMarkdown
          components={markdownComponents}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </Card>
  );
};

export default FinalResponse; 