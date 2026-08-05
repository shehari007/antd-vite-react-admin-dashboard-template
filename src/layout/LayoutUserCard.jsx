import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Tooltip } from 'antd';
import { LockOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/useAuth';
import { ROLE_LABELS } from '@/context/auth-context';

/* Fixed 64px in both states, matching the brand block, so the rail has
 * symmetric caps and nothing snaps mid collapse. Collapsed, logout *moves*
 * into a dropdown rather than disappearing: it used to be unreachable.
 *
 * antd's Space is deliberately not used here. It wraps every child in a
 * .ant-space-item div that keeps min-width:auto, which is why the name never
 * ellipsised and a long one pushed the logout button past the rail edge into
 * overflow:hidden, silently making it unclickable. */
const LayoutUserCard = ({ collapsed }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, signOut, lock } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const menuItems = [
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

  const avatar = (
    <Avatar
      size={32}
      style={{ backgroundColor: 'var(--rail-accent, #1677ff)', flexShrink: 0 }}
      icon={<UserOutlined />}
    />
  );

  if (collapsed) {
    return (
      <div className="app-sider__footer">
        <Dropdown placement="topLeft" trigger={['click']} menu={{ items: menuItems }}>
          <Tooltip title={user?.name} placement="right">
            <Button
              type="text"
              className="app-sider__identity"
              aria-label={t('header.accountMenu')}
            >
              {avatar}
            </Button>
          </Tooltip>
        </Dropdown>
      </div>
    );
  }

  return (
    <div className="app-sider__footer">
      <Button
        type="text"
        className="app-sider__identity"
        onClick={() => navigate('/dashboard/profile')}
      >
        {avatar}
        <span className="app-sider__identity-text">
          <span className="app-sider__identity-name">{user?.name}</span>
          <span className="app-sider__identity-role">
            {ROLE_LABELS[user?.role] || user?.jobTitle}
          </span>
        </span>
      </Button>
      <Tooltip title={t('header.logout')}>
        <Button
          type="text"
          shape="circle"
          className="app-sider__logout"
          aria-label={t('header.logout')}
          icon={<LogoutOutlined />}
          onClick={handleSignOut}
        />
      </Tooltip>
    </div>
  );
};

export default LayoutUserCard;
