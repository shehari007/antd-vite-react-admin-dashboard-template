import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Dropdown,
  Layout,
  Space,
  Switch,
  Tag,
  Tooltip,
  theme,
} from 'antd';
import {
  BellOutlined,
  BgColorsOutlined,
  DownOutlined,
  FileAddOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  GlobalOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  SunOutlined,
  TableOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CommandPalette from '@/components/CommandPalette';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import { useThemeMode } from '@/context/useThemeMode';
import { useAuth } from '@/context/useAuth';
import { ROLE_LABELS } from '@/context/auth-context';
import { NOTIFICATIONS } from '@/data/workspace';
import { LANGUAGES } from '@/i18n';

const { Header } = Layout;

const iconButtonStyle = { fontSize: 16, width: 36, height: 36 };

const LayoutHeader = ({ navExpanded, toggleSidebar, isMobile }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark, toggleMode, language, setLanguage } = useThemeMode();
  const { user, signOut, lock } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const {
    token: { colorBgContainer, colorBorderSecondary, colorTextTertiary, boxShadowTertiary },
  } = theme.useToken();

  const unread = NOTIFICATIONS.filter((item) => !item.read);

  // Ctrl+K on Windows and Linux, Cmd+K on macOS.
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // The fullscreen state can also change from the Escape key or the browser
  // chrome, so it is read from the document rather than tracked on click.
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const quickActionItems = [
    {
      key: 'new-page',
      icon: <FileAddOutlined />,
      label: t('header.newPage'),
      onClick: () => navigate('/dashboard/blank'),
    },
    {
      key: 'new-user',
      icon: <UsergroupAddOutlined />,
      label: t('header.inviteUser'),
      onClick: () => navigate('/dashboard/users'),
    },
    {
      key: 'new-table',
      icon: <TableOutlined />,
      label: t('header.viewRecords'),
      onClick: () => navigate('/dashboard/tables'),
    },
  ];

  const notificationItems = [
    ...NOTIFICATIONS.slice(0, 4).map((item) => ({
      key: item.key || item.id,
      label: (
        <Space orientation="vertical" size={0} style={{ maxWidth: 260 }}>
          <span style={{ fontWeight: item.read ? 400 : 600 }}>{item.title}</span>
          <span style={{ fontSize: 12, opacity: 0.65 }}>{item.body}</span>
        </Space>
      ),
      onClick: () => navigate('/dashboard/notifications'),
    })),
    { type: 'divider' },
    {
      key: 'all',
      label: t('common.seeAll'),
      onClick: () => navigate('/dashboard/notifications'),
    },
  ];

  const languageItems = LANGUAGES.map((item) => ({
    key: item.code,
    label: item.label,
    onClick: () => setLanguage(item.code),
  }));

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('header.profile'),
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('header.settings'),
      onClick: () => navigate('/dashboard/settings'),
    },
    { type: 'divider' },
    {
      key: 'lock',
      icon: <LockOutlined />,
      label: t('nav.items.lock'),
      onClick: () => {
        lock();
        navigate('/lock');
      },
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('header.logout'),
      danger: true,
      onClick: handleSignOut,
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
        {/* Driven by the real nav state. A `collapsed || isMobile` expression
            always renders the unfold glyph on mobile, even with the drawer
            wide open. */}
        <Button
          type="text"
          shape="circle"
          icon={navExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={toggleSidebar}
          aria-label={navExpanded ? t('nav.closeNav') : t('nav.openNav')}
          aria-expanded={navExpanded}
          aria-controls="app-sidebar"
          style={iconButtonStyle}
        />

        {isMobile ? (
          <Button
            type="text"
            shape="circle"
            icon={<SearchOutlined />}
            onClick={() => setPaletteOpen(true)}
            aria-label={t('common.search')}
            style={iconButtonStyle}
          />
        ) : (
          <Button
            onClick={() => setPaletteOpen(true)}
            icon={<SearchOutlined />}
            style={{
              width: 280,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'flex-start',
            }}
          >
            <span style={{ flex: 1, textAlign: 'start', color: colorTextTertiary }}>
              {t('header.searchPlaceholder')}
            </span>
            <Tag style={{ margin: 0, fontSize: 11 }}>{t('header.commandHint')}</Tag>
          </Button>
        )}
      </Space>

      <Space size={4} align="center">
        <Space.Compact>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/dashboard/blank')}
          >
            {!isMobile && t('header.quickActions')}
          </Button>
          <Dropdown menu={{ items: quickActionItems }} placement="bottomRight" trigger={['click']}>
            <Button type="primary" icon={<DownOutlined />} aria-label={t('header.quickActions')} />
          </Dropdown>
        </Space.Compact>

        {!isMobile && (
          <>
            <Divider vertical style={{ margin: '0 4px' }} />
            <Tooltip title={isFullscreen ? t('header.exitFullscreen') : t('header.fullscreen')}>
              <Button
                type="text"
                shape="circle"
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? t('header.exitFullscreen') : t('header.fullscreen')}
                style={iconButtonStyle}
              />
            </Tooltip>

            <Dropdown menu={{ items: languageItems, selectedKeys: [language] }} trigger={['click']}>
              <Tooltip title={t('header.language')}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<GlobalOutlined />}
                  aria-label={t('header.language')}
                  style={iconButtonStyle}
                />
              </Tooltip>
            </Dropdown>

            <Tooltip title={t('header.customize')}>
              <Button
                type="text"
                shape="circle"
                icon={<BgColorsOutlined />}
                onClick={() => setCustomizerOpen(true)}
                aria-label={t('header.customize')}
                style={iconButtonStyle}
              />
            </Tooltip>
          </>
        )}

        <Tooltip title={isDark ? t('header.lightMode') : t('header.darkMode')}>
          <Switch
            checked={isDark}
            onChange={toggleMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            aria-label={isDark ? t('header.lightMode') : t('header.darkMode')}
          />
        </Tooltip>

        <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']}>
          <Badge count={unread.length} size="small">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              aria-label={t('header.notificationsUnread', { count: unread.length })}
              style={iconButtonStyle}
            />
          </Badge>
        </Dropdown>

        <Divider vertical style={{ margin: '0 4px' }} />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
          <Button
            type="text"
            aria-label={t('header.accountMenu')}
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
              style={{ backgroundColor: 'var(--rail-accent, #1677ff)' }}
              icon={<UserOutlined />}
            />
            {!isMobile && (
              <>
                <Space
                  orientation="vertical"
                  size={0}
                  style={{ textAlign: 'start', lineHeight: 1.2 }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</span>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>
                    {ROLE_LABELS[user?.role] || user?.jobTitle}
                  </span>
                </Space>
                <DownOutlined style={{ fontSize: 10, opacity: 0.45 }} />
              </>
            )}
          </Button>
        </Dropdown>
      </Space>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenCustomizer={() => setCustomizerOpen(true)}
      />
      <ThemeCustomizer open={customizerOpen} onClose={() => setCustomizerOpen(false)} />
    </Header>
  );
};

export default LayoutHeader;
