import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  theme,
  Space,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Tooltip,
  Input,
  Switch,
  Divider,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  PlusOutlined,
  FileAddOutlined,
  UsergroupAddOutlined,
  TableOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SunOutlined,
  MoonOutlined,
  DownOutlined,
} from '@ant-design/icons';
import handleLogOut from '../Utils/Auth/Logout';
import { useThemeMode } from '../context/useThemeMode';

const { Header } = Layout;

const notifications = [
  { key: 'n1', label: 'New order received', description: '2 minutes ago' },
  { key: 'n2', label: 'Server usage above 80%', description: '1 hour ago' },
  { key: 'n3', label: 'Weekly report is ready', description: '3 hours ago' },
];

const iconButtonStyle = { fontSize: 16, width: 36, height: 36 };

const LayoutHeader = ({ navExpanded, toggleSidebar, isMobile }) => {
  const navigate = useNavigate();
  const { isDark, toggleMode } = useThemeMode();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const {
    token: { colorBgContainer, colorBorderSecondary, boxShadowTertiary },
  } = theme.useToken();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const quickActionItems = [
    {
      key: 'new-page',
      icon: <FileAddOutlined />,
      label: 'New Page',
      onClick: () => navigate('/dashboard/blank'),
    },
    {
      key: 'new-user',
      icon: <UsergroupAddOutlined />,
      label: 'Invite User',
      onClick: () => navigate('/dashboard/users'),
    },
    {
      key: 'new-table',
      icon: <TableOutlined />,
      label: 'View Records',
      onClick: () => navigate('/dashboard/tables'),
    },
  ];

  const notificationItems = notifications.map((item) => ({
    key: item.key,
    label: (
      <Space direction="vertical" size={0}>
        <span>{item.label}</span>
        <span style={{ fontSize: 12, opacity: 0.65 }}>{item.description}</span>
      </Space>
    ),
  }));

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/dashboard/settings'),
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
        background: colorBgContainer,
        borderBottom: `1px solid ${colorBorderSecondary}`,
        boxShadow: boxShadowTertiary,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        gap: 12,
      }}
    >
      <Space size={isMobile ? 4 : 12} style={{ minWidth: 0 }}>
        {/* Driven by the real nav state. The old `collapsed || isMobile`
            expression always rendered the unfold glyph on mobile, even with the
            drawer wide open. */}
        <Button
          type="text"
          shape="circle"
          icon={navExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={toggleSidebar}
          aria-label={navExpanded ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navExpanded}
          aria-controls="app-sidebar"
          style={iconButtonStyle}
        />
        {!isMobile && (
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Search anything..."
            variant="filled"
            style={{ width: 260 }}
          />
        )}
      </Space>

      <Space size={isMobile ? 4 : 4} align="center">
        <Space.Compact>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/dashboard/blank')}>
            {!isMobile && 'Quick Actions'}
          </Button>
          <Dropdown menu={{ items: quickActionItems }} placement="bottomRight" trigger={['click']}>
            <Button type="primary" icon={<DownOutlined />} />
          </Dropdown>
        </Space.Compact>

        {!isMobile && (
          <>
            <Divider type="vertical" style={{ margin: '0 4px' }} />
            <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              <Button
                type="text"
                shape="circle"
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                style={iconButtonStyle}
              />
            </Tooltip>
          </>
        )}

        <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <Switch
            checked={isDark}
            onChange={toggleMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Tooltip>

        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Badge count={notifications.length} size="small">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              aria-label={`Notifications, ${notifications.length} unread`}
              style={iconButtonStyle}
            />
          </Badge>
        </Dropdown>

        <Divider type="vertical" style={{ margin: '0 4px' }} />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
          <Button
            type="text"
            style={{
              height: 48,
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Avatar
              size={32}
              style={{ backgroundColor: '#1677ff', border: `1px solid ${colorBorderSecondary}` }}
              icon={<UserOutlined />}
            />
            {!isMobile && (
              <>
                <Space direction="vertical" size={0} style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Admin User</span>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>Administrator</span>
                </Space>
                <DownOutlined style={{ fontSize: 10, opacity: 0.45 }} />
              </>
            )}
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default LayoutHeader;
