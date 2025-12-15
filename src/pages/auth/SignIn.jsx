import React from 'react';
import {
  Flex,
  Input,
  Form,
  Button,
  Card,
  Space,
  Image,
  Typography,
  Divider,
  Checkbox,
  Grid,
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import handleSignIn from '../../Utils/Auth/SignIn';

const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;

const SignIn = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const handleOnSubmit = async (values) => {
    console.log('Received values of form: ', values);
    await handleSignIn(values);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: isMobile ? 16 : 24,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          borderRadius: 12,
        }}
      >
        <Space
          direction="vertical"
          size="middle"
          style={{ width: '100%', textAlign: 'center' }}
        >
          <div>
            <Image
              src="/vite.svg"
              height={60}
              width={60}
              preview={false}
              alt="logo"
            />
            <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
              Welcome Back
            </Title>
            <Text type="secondary">Sign in to continue to your dashboard</Text>
          </div>

          <Form
            onFinish={handleOnSubmit}
            layout="vertical"
            style={{ width: '100%', marginTop: 8 }}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email!',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email!',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Email address"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your password!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link>Forgot password?</Link>
              </Flex>
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{ height: 45, fontWeight: 500 }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <Text type="secondary">or continue with</Text>
          </Divider>

          <Space size="middle">
            <Button
              icon={<GoogleOutlined />}
              size="large"
              style={{ width: 100 }}
            >
              Google
            </Button>
            <Button
              icon={<GithubOutlined />}
              size="large"
              style={{ width: 100 }}
            >
              GitHub
            </Button>
          </Space>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              Don't have an account?{' '}
              <Link strong>Sign up now</Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default SignIn;
