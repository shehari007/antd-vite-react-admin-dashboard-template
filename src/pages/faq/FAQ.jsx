import { useMemo, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Collapse,
  Input,
  Space,
  Button,
  Tag,
  Form,
  Empty,
  Statistic,
  App,
} from 'antd';
import {
  SearchOutlined,
  MailOutlined,
  MessageOutlined,
  RocketOutlined,
  BgColorsOutlined,
  CreditCardOutlined,
  ToolOutlined,
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
  ClockCircleOutlined,
  SmileOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const categories = [
  { key: 'getting-started', label: 'Getting Started', icon: <RocketOutlined />, color: '#1677ff' },
  { key: 'customization', label: 'Customization', icon: <BgColorsOutlined />, color: '#722ed1' },
  { key: 'billing', label: 'Account & Billing', icon: <CreditCardOutlined />, color: '#52c41a' },
  { key: 'troubleshooting', label: 'Troubleshooting', icon: <ToolOutlined />, color: '#faad14' },
];

const faqItems = [
  {
    key: '1',
    category: 'customization',
    label: 'How do I change the theme from light to dark?',
    children:
      "Use the switch in the header, or go to Settings > Appearance. The whole app re-themes instantly through Ant Design's ConfigProvider, no page reload needed.",
  },
  {
    key: '2',
    category: 'getting-started',
    label: 'Can I add my own pages to the sidebar?',
    children:
      'Yes. Create a component under src/pages, add a route in src/App.jsx, then add a menu entry in src/layout/LayoutMenu.jsx.',
  },
  {
    key: '3',
    category: 'billing',
    label: 'How is authentication handled?',
    children:
      'The template ships with a demo sign-in flow using localStorage. Dashboard routes are open by default for easy previewing; flip REQUIRE_AUTH in ProtectedRoute.jsx to gate them.',
  },
  {
    key: '4',
    category: 'customization',
    label: 'Does this template use any charting library?',
    children:
      'No. Every visual, including gauges and mini bar charts, is built from core Ant Design components like Progress and Statistic to keep the dependency list minimal.',
  },
  {
    key: '5',
    category: 'getting-started',
    label: 'Is the layout responsive?',
    children:
      "Yes, the sidebar collapses into a drawer on mobile, and all dashboard grids reflow using Ant Design's breakpoint system.",
  },
  {
    key: '6',
    category: 'billing',
    label: 'Can I change or cancel my plan later?',
    children:
      'The Pricing page includes a plan comparison and selection flow you can wire up to your own billing provider whenever you are ready.',
  },
  {
    key: '7',
    category: 'troubleshooting',
    label: 'Lint is failing after I added a new page, what should I check?',
    children:
      'Run npm run lint locally. The most common causes are unused imports, missing key props in lists, and unescaped apostrophes inside JSX text.',
  },
  {
    key: '8',
    category: 'troubleshooting',
    label: 'The dev server will not start, what now?',
    children:
      'Confirm you are on Node 18+, delete node_modules and reinstall, and check that no other process is already using port 5173.',
  },
];

const FAQ = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [feedback, setFeedback] = useState({});

  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory = !activeCategory || item.category === activeCategory;
      const matchesSearch =
        !searchTerm ||
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.children.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const handleVote = (key, vote) => {
    setFeedback((prev) => ({ ...prev, [key]: vote }));
  };

  const handleContactSubmit = (values) => {
    message.success(`Thanks ${values.name}, we will reply to ${values.email} soon.`);
    form.resetFields();
  };

  const collapseItems = filteredItems.map((item) => ({
    key: item.key,
    label: item.label,
    children: (
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {item.children}
        </Paragraph>
        <Space size={8} align="center">
          <Text type="secondary" style={{ fontSize: 12 }}>
            Was this helpful?
          </Text>
          <Button
            type="text"
            size="small"
            icon={feedback[item.key] === 'up' ? <LikeFilled /> : <LikeOutlined />}
            onClick={() => handleVote(item.key, 'up')}
          />
          <Button
            type="text"
            size="small"
            icon={feedback[item.key] === 'down' ? <DislikeFilled /> : <DislikeOutlined />}
            onClick={() => handleVote(item.key, 'down')}
          />
          {feedback[item.key] && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Thanks for the feedback!
            </Text>
          )}
        </Space>
      </Space>
    ),
  }));

  return (
    <div>
      <Space
        orientation="vertical"
        size={4}
        style={{ width: '100%', textAlign: 'center', marginBottom: 24 }}
      >
        <Title level={4} style={{ marginBottom: 0 }}>
          Help Center
        </Title>
        <Text type="secondary">Answers to common questions about this template.</Text>
        <div style={{ marginTop: 12, maxWidth: 420, marginInline: 'auto', width: '100%' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search help articles"
            size="large"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Space>

      <Row gutter={[16, 16]} align="stretch" style={{ marginBottom: 16 }}>
        {categories.map((category) => (
          <Col xs={12} md={6} key={category.key}>
            <Card
              hoverable
              size="small"
              style={{
                height: '100%',
                textAlign: 'center',
                borderTop:
                  activeCategory === category.key ? `2px solid ${category.color}` : undefined,
              }}
              onClick={() =>
                setActiveCategory((prev) => (prev === category.key ? null : category.key))
              }
            >
              <Space orientation="vertical" size={4}>
                <span style={{ fontSize: 22, color: category.color }}>{category.icon}</span>
                <Text strong style={{ fontSize: 13 }}>
                  {category.label}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {faqItems.filter((item) => item.category === category.key).length} articles
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} lg={16}>
          <Card
            style={{ height: '100%' }}
            title={
              activeCategory
                ? categories.find((c) => c.key === activeCategory)?.label
                : 'All Articles'
            }
            extra={
              activeCategory && (
                <Button type="link" size="small" onClick={() => setActiveCategory(null)}>
                  Clear filter
                </Button>
              )
            }
          >
            {collapseItems.length > 0 ? (
              <Collapse
                defaultActiveKey={['1']}
                items={collapseItems}
                bordered={false}
                expandIconPosition="end"
              />
            ) : (
              <Empty description="No articles match your search" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Space orientation="vertical" size={16} style={{ width: '100%', height: '100%' }}>
            <Card>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Avg. Response"
                    value="2h"
                    prefix={<ClockCircleOutlined style={{ color: '#1677ff' }} />}
                    valueStyle={{ fontSize: 20 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Satisfaction"
                    value={97}
                    suffix="%"
                    prefix={<SmileOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ fontSize: 20 }}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Still need help?" style={{ flex: 1 }}>
              <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                <Space wrap size={8}>
                  <Button icon={<MailOutlined />} href="mailto:shehariyar@gmail.com">
                    Email
                  </Button>
                  <Button icon={<MessageOutlined />}>Live Chat</Button>
                  <Tag color="green">Online now</Tag>
                </Space>

                <Form form={form} layout="vertical" onFinish={handleContactSubmit}>
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input placeholder="Your name" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input placeholder="Your email" />
                  </Form.Item>
                  <Form.Item
                    name="message"
                    rules={[{ required: true, message: 'Please add a short message' }]}
                  >
                    <TextArea rows={3} placeholder="How can we help?" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Send Message
                  </Button>
                </Form>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default FAQ;
