import { App, Input, Form, Button, Space, Typography, Checkbox, theme } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthLayout from '@/layout/AuthLayout';
import { useAuth } from '@/context/useAuth';

const { Text } = Typography;

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, isPending } = useAuth();
  const { message } = App.useApp();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const handleOnSubmit = async (values) => {
    try {
      const user = await signUp(values);
      message.success(`Welcome, ${user.name}`);
      navigate('/dashboard/home', { replace: true });
    } catch (error) {
      message.error(error.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Set up your workspace in less than a minute."
    >
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Form onFinish={handleOnSubmit} layout="vertical" style={{ width: '100%' }}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Jane Doe"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="you@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please create a password!' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Create a password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Re-enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms')),
              },
            ]}
          >
            <Checkbox>
              I agree to the{' '}
              <RouterLink to="#" style={{ color: colorPrimary }}>
                Terms of Service
              </RouterLink>{' '}
              and{' '}
              <RouterLink to="#" style={{ color: colorPrimary }}>
                Privacy Policy
              </RouterLink>
            </Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" block loading={isPending}>
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
          Already have an account?{' '}
          <RouterLink to="/signin" style={{ color: colorPrimary, fontWeight: 600 }}>
            Sign in
          </RouterLink>
        </Text>
      </Space>
    </AuthLayout>
  );
};

export default SignUp;
