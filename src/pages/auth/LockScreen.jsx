import { App, Avatar, Button, Form, Input, Space, Typography, theme } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layout/AuthLayout';
import { useAuth } from '@/context/useAuth';

const { Text } = Typography;

/**
 * Locking keeps the session but blocks the app, which is what you want when
 * someone steps away from a shared machine. DashboardLayout redirects here
 * while `locked` is set, so there is no route left to poke at.
 */
const LockScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, unlock, signOut } = useAuth();
  const { message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const handleUnlock = () => {
    // A real implementation re-checks the password against your backend before
    // clearing the lock.
    unlock();
    message.success('Welcome back');
    navigate('/dashboard/home', { replace: true });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin', { replace: true });
  };

  return (
    <AuthLayout
      eyebrow={t('auth.signedInAs')}
      title={t('auth.lockTitle')}
      subtitle={t('auth.lockSubtitle')}
    >
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Space align="center" size={12}>
          <Avatar size={48} style={{ backgroundColor: colorPrimary }} icon={<UserOutlined />} />
          <Space orientation="vertical" size={0}>
            <Text strong>{user?.name || 'Guest User'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email}
            </Text>
          </Space>
        </Space>

        <Form onFinish={handleUnlock} layout="vertical" style={{ width: '100%' }}>
          <Form.Item
            label={t('auth.password')}
            name="password"
            rules={[{ required: true, message: t('auth.passwordRequired') }]}
          >
            <Input.Password
              /* The only field on a screen whose entire purpose is typing this
                 password, so focusing it is the helpful behaviour rather than
                 the disorienting one the rule guards against. */
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder={t('auth.password')}
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" block>
              {t('auth.unlock')}
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
          <RouterLink to="/signin" onClick={handleSignOut} style={{ color: colorPrimary }}>
            {t('auth.notYou')}
          </RouterLink>
        </Text>
      </Space>
    </AuthLayout>
  );
};

export default LockScreen;
