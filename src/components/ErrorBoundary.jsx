import { Component } from 'react';
import { Button, Result, Typography } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

/**
 * Catches render errors so one broken component cannot blank the whole app.
 *
 * This has to be a class: there is still no hook equivalent of
 * componentDidCatch. Two instances are mounted, one around the entire app in
 * main.jsx, and one inside the dashboard shell in MainLayout, so a page level
 * crash keeps the sidebar and header usable.
 *
 * `resetKey` clears the error when it changes, which is how navigating to
 * another route recovers without a full reload.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Swap this for your error reporting service.
    console.error('Unhandled render error:', error, info?.componentStack);
  }

  componentDidUpdate(previousProps) {
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (!error) return children;
    if (fallback) return fallback(error, () => this.setState({ error: null }));

    return (
      <Result
        status="500"
        title="Something went wrong"
        subTitle="The page hit an unexpected error. Reloading usually clears it."
        extra={[
          <Button
            key="reload"
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
          >
            Reload the page
          </Button>,
          <Button key="home" icon={<HomeOutlined />} href="/dashboard/home">
            Back to dashboard
          </Button>,
        ]}
      >
        {import.meta.env.DEV && (
          <Paragraph>
            <Text code style={{ whiteSpace: 'pre-wrap' }}>
              {error.message}
            </Text>
          </Paragraph>
        )}
      </Result>
    );
  }
}

export default ErrorBoundary;
