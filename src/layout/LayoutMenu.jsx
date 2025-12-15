import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  DashboardOutlined,
  FileOutlined,
  SettingOutlined,
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const LayoutMenu = ({ onItemClick }) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const selectedMenu = pathParts[pathParts.length - 1];

  const items = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard/home">Dashboard</Link>,
    },
    {
      key: 'pages',
      icon: <AppstoreOutlined />,
      label: 'Pages',
      children: [
        {
          key: 'blank',
          icon: <FileOutlined />,
          label: <Link to="/dashboard/blank">Blank Page</Link>,
        },
      ],
    },
    {
      key: 'components',
      icon: <DashboardOutlined />,
      label: 'Components',
      children: [
        {
          key: 'tables',
          label: 'Tables',
          disabled: true,
        },
        {
          key: 'forms',
          label: 'Forms',
          disabled: true,
        },
        {
          key: 'charts',
          label: 'Charts',
          disabled: true,
        },
      ],
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      disabled: true,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      disabled: true,
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      selectedKeys={[selectedMenu]}
      defaultOpenKeys={['pages']}
      onClick={onItemClick}
      style={{ borderRight: 0 }}
    />
  );
};

export default LayoutMenu;
