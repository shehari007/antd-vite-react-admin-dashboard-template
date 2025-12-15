import React from 'react';
import {
  Layout,
  theme,
  Space,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Tooltip,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import handleLogOut from '../Utils/Auth/Logout';

const { Header } = Layout;

const LayoutHeader = ({ collapsed, toggleSidebar, isMobile }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => handleLogOut(),
    },
  ];

  return (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
      }}
    >
      <Button
        type="text"
        icon={collapsed || isMobile ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleSidebar}
        style={{
          fontSize: '16px',
          width: 48,
          height: 48,
        }}
      />
      <Space size="middle">
        <Tooltip title="Notifications">
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px' }}
            />
          </Badge>
        </Tooltip>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              style={{ backgroundColor: '#1890ff' }}
              icon={<UserOutlined />}
            />
            {!isMobile && <span>Admin User</span>}
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default LayoutHeader;
