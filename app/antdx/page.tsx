"use client";
import React, { useState } from "react";
import { ThoughtChain } from "@ant-design/x";
import type { ThoughtChainProps, ThoughtChainItem } from "@ant-design/x";

import { CheckCircleOutlined, MoreOutlined } from "@ant-design/icons";

import { Card, Typography, Button } from "antd";

const { Paragraph, Text } = Typography;

const customizationProps: ThoughtChainItem = {
  title: "Thought Chain Item Title",
  description: "description",
  icon: <CheckCircleOutlined />,
  extra: <Button type="text" icon={<MoreOutlined />} />,
  footer: <Button block>Thought Chain Item Footer</Button>,
  content: (
    <Typography>
      <Paragraph>
        In the process of internal desktop applications development, many
        different design specs and implementations would be involved, which
        might cause designers and developers difficulties and duplication and
        reduce the efficiency of development.
      </Paragraph>
      <Paragraph>
        After massive project practice and summaries, Ant Design, a design
        language for background applications, is refined by Ant UED Team, which
        aims to{" "}
        <Text strong>
          uniform the user interface specs for internal background projects,
          lower the unnecessary cost of design differences and implementation
          and liberate the resources of design and front-end development
        </Text>
      </Paragraph>
    </Typography>
  ),
};

const items: ThoughtChainProps["items"] = [
  {
    ...customizationProps,
    status: "success",
    key: 'item-1'
  },
  {
    ...customizationProps,
    status: "error",
    key: 'item-2'
  },
  {
    ...customizationProps,
    status: "pending",
    key: 'item-3'
  },
];

export default function AntdX() {

  const [expandedKeys, setExpandedKeys] = useState(['item-2']);

  const collapsible: ThoughtChainProps['collapsible'] = {
    expandedKeys,
    onExpand: (keys: string[]) => {
      setExpandedKeys(keys);
    },
  };

  return (
    <Card style={{ width: 500 }}>
      <ThoughtChain items={items} collapsible={collapsible} />
    </Card>
  );
}
