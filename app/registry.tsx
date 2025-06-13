'use client';

import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const Registry = ({ children }: { children: React.ReactNode }) => {
  return <AntdRegistry>{children}</AntdRegistry>;
}; 