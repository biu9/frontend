'use client';

import React from 'react';

interface TimeStampProps {
  timestamp?: Date;
}

const TimeStamp: React.FC<TimeStampProps> = ({ timestamp }) => {
  const time = timestamp || new Date();
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  return (
    <span className="text-xs text-gray-400 ml-2">
      {formatTime(time)}
    </span>
  );
};

export default TimeStamp; 