'use client';

import React from 'react';
import { Collapse, Space, Typography, Tag } from 'antd';
import { FileTextOutlined, FileMarkdownOutlined, FileUnknownOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface FileViewerProps {
  filePath: string;
  content: string;
  success?: boolean;
}

const FileViewer: React.FC<FileViewerProps> = ({ filePath, content, success = true }) => {
  const getFileExtension = (path: string) => path.split('.').pop()?.toLowerCase() || '';
  const getFileName = (path: string) => path.split('/').pop() || path;
  
  const fileExtension = getFileExtension(filePath);
  const fileName = getFileName(filePath);

  const getFileIcon = (ext: string) => {
    switch (ext) {
      case 'js': case 'ts': case 'jsx': case 'tsx': return <FileTextOutlined />;
      case 'json': return <FileTextOutlined />;
      case 'md': case 'readme': return <FileMarkdownOutlined />;
      case 'css': case 'html': return <FileTextOutlined />;
      default: return <FileUnknownOutlined />;
    }
  };

  const header = (
    <Space>
        {getFileIcon(fileExtension)}
        <Text strong>{fileName}</Text>
        <Text type="secondary">{filePath}</Text>
        {success ? <Tag icon={<CheckCircleOutlined />} color="success">成功</Tag> : <Tag icon={<CloseCircleOutlined />} color="error">失败</Tag>}
    </Space>
  );

  return (
    <Collapse>
      <Collapse.Panel header={header} key={filePath}>
        <Paragraph>
          <pre style={{whiteSpace: 'pre-wrap', background: '#fafafa', padding: '8px', borderRadius: '4px', maxHeight: '300px', overflowY: 'auto'}}>
            {content}
          </pre>
        </Paragraph>
      </Collapse.Panel>
    </Collapse>
  );
};

export default FileViewer; 