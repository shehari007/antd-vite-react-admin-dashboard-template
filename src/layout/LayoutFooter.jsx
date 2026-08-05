import { Layout, Typography, Space, Button, Tag, Tooltip, theme } from 'antd';
import { GithubOutlined, MailOutlined, ReadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import logoIcon from '@/assets/logo/logo-icon.png';
import { APP_LINKS, APP_NAME, APP_VERSION } from '@/config/appInfo';

const { Footer } = Layout;
const { Text } = Typography;

const LayoutFooter = () => {
  const { t } = useTranslation();
  const {
    token: { colorBorderSecondary },
  } = theme.useToken();

  const links = [
    {
      key: 'mail',
      label: t('footer.email'),
      href: APP_LINKS.email,
      icon: <MailOutlined />,
      color: '#1677ff',
    },
    {
      key: 'docs',
      label: t('footer.docs'),
      href: APP_LINKS.docs,
      icon: <ReadOutlined />,
      color: '#13c2c2',
      external: true,
    },
    {
      key: 'github',
      label: t('footer.github'),
      href: APP_LINKS.github,
      icon: <GithubOutlined />,
      color: '#722ed1',
      external: true,
    },
  ];

  return (
    <Footer
      style={{
        padding: '14px 24px',
        background: 'transparent',
        borderTop: `1px solid ${colorBorderSecondary}`,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <Space size={8}>
        <img src={logoIcon} alt="" width={18} height={18} style={{ display: 'block' }} />
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('footer.builtBy', { year: new Date().getFullYear(), app: APP_NAME })}
        </Text>
        <Tag style={{ fontSize: 11, marginInlineStart: 4 }}>v{APP_VERSION}</Tag>
      </Space>

      <Space size={4}>
        {links.map((link) => (
          <Tooltip key={link.key} title={link.label}>
            <Button
              type="text"
              shape="circle"
              size="small"
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
              icon={link.icon}
              style={{ color: link.color }}
            />
          </Tooltip>
        ))}
      </Space>
    </Footer>
  );
};

export default LayoutFooter;
