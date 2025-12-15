import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { HeartFilled, GithubOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Link, Text } = Typography;

const LayoutFooter = () => {
  return (
    <Footer
      style={{
        textAlign: 'center',
        padding: '16px 24px',
        background: 'transparent',
      }}
    >
      <Space direction="vertical" size={4}>
        <Text type="secondary">
          Vite + React 19 + Ant Design 6 Admin Dashboard Template
        </Text>
        <Text type="secondary">
          Made with <HeartFilled style={{ color: '#eb2f96' }} /> by{' '}
          <Link href="https://github.com/shehari007" target="_blank">
            <GithubOutlined /> Muhammad Sheharyar Butt
          </Link>
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          © {new Date().getFullYear()} All rights reserved.
        </Text>
      </Space>
    </Footer>
  );
};

export default LayoutFooter;
