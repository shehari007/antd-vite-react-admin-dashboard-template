import { Row, Col, Typography, Space, Grid, theme } from 'antd';
import { CheckCircleFilled, GithubOutlined, MailOutlined } from '@ant-design/icons';
import logoIcon from '@/assets/logo/logo-icon.png';
import { APP_LINKS, APP_NAME } from '@/config/appInfo';

const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;

const highlights = [
  'Responsive layouts tuned for desktop, tablet, and mobile',
  'System wide light and dark mode via Ant Design theming',
  'Role aware navigation, charts, and a searchable command palette',
];

const AuthLayout = ({ eyebrow, title, subtitle, children }) => {
  const screens = useBreakpoint();
  const {
    token: { colorPrimary, colorBgLayout, borderRadiusLG },
  } = theme.useToken();

  return (
    <Row style={{ minHeight: '100vh' }}>
      {screens.lg && (
        <Col
          lg={11}
          xl={10}
          style={{
            background: colorPrimary,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 48,
          }}
        >
          <Space size={12} align="center">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.92)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <img
                src={logoIcon}
                alt={APP_NAME}
                width={30}
                height={30}
                style={{ display: 'block' }}
              />
            </div>
            <Text style={{ color: '#fff', fontWeight: 600, fontSize: 20 }}>
              <span style={{ fontWeight: 700 }}>Vite</span>
              <span style={{ fontWeight: 400, opacity: 0.85 }}>Dash</span>
            </Text>
          </Space>

          <div>
            <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
              Manage your business from one clean dashboard.
            </Title>
            <Space orientation="vertical" size={12}>
              {highlights.map((item) => (
                <Space key={item} align="start" size={10}>
                  <CheckCircleFilled style={{ marginTop: 4, color: 'rgba(255,255,255,0.85)' }} />
                  <Text style={{ color: 'rgba(255,255,255,0.85)' }}>{item}</Text>
                </Space>
              ))}
            </Space>
          </div>

          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            © {new Date().getFullYear()} ViteDash
          </Text>
        </Col>
      )}

      <Col
        xs={24}
        lg={13}
        xl={14}
        style={{
          background: colorBgLayout,
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ marginBottom: 32, textAlign: screens.lg ? 'left' : 'center' }}>
              {eyebrow && (
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 0.6,
                    textTransform: 'uppercase',
                  }}
                >
                  {eyebrow}
                </Text>
              )}
              <Title level={3} style={{ marginTop: 8, marginBottom: 4 }}>
                {title}
              </Title>
              {subtitle && <Text type="secondary">{subtitle}</Text>}
            </div>
            <div style={{ borderRadius: borderRadiusLG }}>{children}</div>
          </div>
        </div>

        <Space size="middle" style={{ justifyContent: 'center', width: '100%', paddingTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} {APP_NAME}
          </Text>
          <Link href={APP_LINKS.email} style={{ fontSize: 12 }}>
            <MailOutlined /> Support
          </Link>
          <Link
            href={APP_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12 }}
          >
            <GithubOutlined /> GitHub
          </Link>
        </Space>
      </Col>
    </Row>
  );
};

export default AuthLayout;
