import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Tooltip } from 'antd';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import handleLogOut from '../Utils/Auth/Logout';

/* Fixed 64px in both states, matching the brand block, so the rail has
 * symmetric caps and nothing snaps mid-collapse. Collapsed, logout *moves*
 * into a dropdown rather than disappearing — it used to be unreachable.
 *
 * antd's Space is deliberately not used here: it wraps every child in a
 * .ant-space-item div that keeps min-width:auto, which is why the name never
 * ellipsised and a long one pushed the logout button past the rail edge into
 * overflow:hidden, silently making it unclickable. */
const LayoutUserCard = ({ collapsed }) => {
  const navigate = useNavigate();

  const avatar = (
    <Avatar size={32} style={{ backgroundColor: '#1677ff', flexShrink: 0 }} icon={<UserOutlined />} />
  );

  if (collapsed) {
    return (
      <div className="app-sider__footer">
        <Dropdown
          placement="topLeft"
          trigger={['click']}
          menu={{
            items: [
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
              { type: 'divider' },
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Log out',
                danger: true,
                onClick: () => handleLogOut(),
              },
            ],
          }}
        >
          <Tooltip title="Admin User" placement="right">
            <Button type="text" className="app-sider__identity" aria-label="Account menu">
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
          <span className="app-sider__identity-name">Admin User</span>
          <span className="app-sider__identity-role">Administrator</span>
        </span>
      </Button>
      <Tooltip title="Log out">
        <Button
          type="text"
          shape="circle"
          className="app-sider__logout"
          aria-label="Log out"
          icon={<LogoutOutlined />}
          onClick={() => handleLogOut()}
        />
      </Tooltip>
    </div>
  );
};

export default LayoutUserCard;
