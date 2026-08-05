import { Alert, App, Button, Checkbox, Flex, Form, Input, Space, Typography, theme } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layout/AuthLayout';
import { useAuth } from '@/context/useAuth';

const { Text } = Typography;

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isPending } = useAuth();
  const { message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const handleOnSubmit = async (values) => {
    try {
      const user = await signIn(values);
      message.success(`Welcome back, ${user.name}`);
      // DashboardLayout puts the page the visitor originally wanted into
      // location.state, so a deep link survives the detour through sign in.
      navigate(location.state?.from || '/dashboard/home', { replace: true });
    } catch (error) {
      message.error(error.message || 'Sign in failed. Please try again.');
    }
  };

  return (
    <AuthLayout
      eyebrow={t('auth.welcomeBack')}
      title={t('auth.signInTitle')}
      subtitle={t('auth.signInSubtitle')}
    >
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Alert type="info" showIcon message={t('auth.demoHint')} />

        <Form
          onFinish={handleOnSubmit}
          layout="vertical"
          style={{ width: '100%' }}
          initialValues={{ remember: true, email: 'admin@vitedash.dev' }}
        >
          <Form.Item
            label={t('auth.email')}
            name="email"
            rules={[
              { required: true, message: t('auth.emailRequired') },
              { type: 'email', message: t('auth.emailInvalid') },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="you@example.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label={t('auth.password')}
            name="password"
            rules={[{ required: true, message: t('auth.passwordRequired') }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder={t('auth.password')}
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{t('auth.remember')}</Checkbox>
              </Form.Item>
              <RouterLink to="/forgot-password" style={{ color: colorPrimary }}>
                {t('auth.forgot')}
              </RouterLink>
            </Flex>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" block loading={isPending}>
              {t('auth.signIn')}
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
          {t('auth.noAccount')}{' '}
          <RouterLink to="/signup" style={{ color: colorPrimary, fontWeight: 600 }}>
            {t('auth.signUpNow')}
          </RouterLink>
        </Text>
      </Space>
    </AuthLayout>
  );
};

export default SignIn;
