import { useState } from 'react';
import { Input, Form, Button, Space, Typography, Result, theme } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link as RouterLink } from 'react-router-dom';
import AuthLayout from '@/layout/AuthLayout';
import { requestPasswordReset } from '@/services/authService';

const { Text } = Typography;

const ForgotPassword = () => {
  const [submittedEmail, setSubmittedEmail] = useState(null);
  const [sending, setSending] = useState(false);
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const handleOnSubmit = async (values) => {
    setSending(true);
    try {
      const result = await requestPasswordReset(values);
      setSubmittedEmail(result.sentTo);
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot your password?"
      subtitle="Enter the email linked to your account and we'll send you a reset link."
    >
      {submittedEmail ? (
        <Result
          status="success"
          title="Check your inbox"
          subTitle={`We sent a password reset link to ${submittedEmail}.`}
          extra={
            <RouterLink to="/signin" style={{ color: colorPrimary, fontWeight: 600 }}>
              <ArrowLeftOutlined /> Back to sign in
            </RouterLink>
          }
        />
      ) : (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Form onFinish={handleOnSubmit} layout="vertical" style={{ width: '100%' }}>
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

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" size="large" block loading={sending}>
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>

          <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
            <RouterLink to="/signin" style={{ color: colorPrimary, fontWeight: 600 }}>
              <ArrowLeftOutlined /> Back to sign in
            </RouterLink>
          </Text>
        </Space>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
