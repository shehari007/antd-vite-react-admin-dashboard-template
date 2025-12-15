import { Image, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const LayoutLogo = ({ collapsed }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 64,
        padding: collapsed ? '16px 8px' : '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        gap: 8,
      }}
    >
      <Image
        src="/vite.svg"
        alt="logo"
        height={collapsed ? 32 : 36}
        width={collapsed ? 32 : 36}
        preview={false}
        style={{ transition: 'all 0.2s' }}
      />
      {!collapsed && (
        <Title
          level={5}
          style={{
            color: 'white',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          Admin Panel
        </Title>
      )}
    </div>
  );
};

export default LayoutLogo;
