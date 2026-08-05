import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Progress,
  Space,
  Table,
  Tag,
  Avatar,
  List,
  Timeline,
  Calendar,
  Button,
  Divider,
} from 'antd';
import SectionLabel from '../../components/SectionLabel';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  PlusOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const recentOrders = [
  {
    key: '1',
    order: '#ORD-001',
    customer: 'John Doe',
    date: '2026-06-28',
    amount: '$250.00',
    status: 'completed',
  },
  {
    key: '2',
    order: '#ORD-002',
    customer: 'Jane Smith',
    date: '2026-06-27',
    amount: '$180.00',
    status: 'pending',
  },
  {
    key: '3',
    order: '#ORD-003',
    customer: 'Bob Johnson',
    date: '2026-06-27',
    amount: '$320.00',
    status: 'processing',
  },
  {
    key: '4',
    order: '#ORD-004',
    customer: 'Alice Brown',
    date: '2026-06-26',
    amount: '$95.00',
    status: 'completed',
  },
];

const orderColumns = [
  { title: 'Order', dataIndex: 'order', key: 'order' },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  { title: 'Date', dataIndex: 'date', key: 'date', responsive: ['md'] },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const statusConfig = {
        completed: { color: 'success', icon: <CheckCircleOutlined /> },
        pending: { color: 'warning', icon: <ClockCircleOutlined /> },
        processing: { color: 'processing', icon: <SyncOutlined spin /> },
      };
      const config = statusConfig[status];
      return (
        <Tag icon={config.icon} color={config.color}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
];

const activityEvents = [
  { color: 'green', event: 'Order #ORD-001 has been delivered', time: '15 minutes ago' },
  { color: 'blue', event: 'John Doe created a new account', time: '32 minutes ago' },
  { color: 'gray', event: '$520.00 payment processed', time: '1 hour ago' },
  { color: 'red', event: 'Server CPU spiked to 92%', time: '2 hours ago' },
  { color: 'green', event: '5-star review received from Alice', time: '3 hours ago' },
];

const teamMembers = [
  { name: 'Emma Wilson', role: 'Product Designer', progress: 92 },
  { name: 'Liam Carter', role: 'Frontend Engineer', progress: 78 },
  { name: 'Olivia Chen', role: 'Backend Engineer', progress: 64 },
  { name: 'Noah Patel', role: 'QA Engineer', progress: 55 },
];

const taskList = [
  { title: 'Finalize Q3 marketing plan', due: 'Due tomorrow', percent: 80 },
  { title: 'Ship dashboard redesign', due: 'Due in 3 days', percent: 45 },
  { title: 'Review onboarding flow', due: 'Due in 5 days', percent: 20 },
  { title: 'Prepare investor deck', due: 'Due next week', percent: 10 },
];

const Home = () => {
  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }} gutter={[16, 16]}>
        <Col>
          <Title level={4} style={{ marginBottom: 4 }}>
            Dashboard Overview
          </Title>
          <Text type="secondary">Welcome back, here is what is happening today.</Text>
        </Col>
        <Col>
          <Space wrap>
            <Button icon={<FileTextOutlined />}>Export Report</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              New Order
            </Button>
          </Space>
        </Col>
      </Row>

      <SectionLabel style={{ marginTop: 0 }}>Overview</SectionLabel>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ height: '100%' }}>
            <Statistic
              title="Total Users"
              value={2847}
              prefix={<UserOutlined style={{ color: '#1677ff' }} />}
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 12%
                </Text>
              }
            />
            <Progress percent={75} showInfo={false} strokeColor="#1677ff" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ height: '100%' }}>
            <Statistic
              title="Total Orders"
              value={1254}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 8%
                </Text>
              }
            />
            <Progress percent={62} showInfo={false} strokeColor="#52c41a" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ height: '100%' }}>
            <Statistic
              title="Revenue"
              value={48520}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              suffix={
                <Text type="danger" style={{ fontSize: 14 }}>
                  <ArrowDownOutlined /> 3%
                </Text>
              }
            />
            <Progress percent={45} showInfo={false} strokeColor="#faad14" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ height: '100%' }}>
            <Statistic
              title="Growth"
              value={23.5}
              precision={1}
              prefix={<RiseOutlined style={{ color: '#eb2f96' }} />}
              suffix="%"
            />
            <Progress percent={85} showInfo={false} strokeColor="#eb2f96" />
          </Card>
        </Col>
      </Row>

      <SectionLabel>System Health</SectionLabel>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} sm={8}>
          <Card style={{ height: '100%' }}>
            <Space
              align="center"
              size="large"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <Space orientation="vertical" size={0}>
                <Text type="secondary">Server Load</Text>
                <Text strong style={{ fontSize: 20 }}>
                  Healthy
                </Text>
              </Space>
              <Progress
                type="dashboard"
                percent={64}
                size={72}
                strokeColor="#1677ff"
                format={(percent) => `${percent}%`}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ height: '100%' }}>
            <Space
              align="center"
              size="large"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <Space orientation="vertical" size={0}>
                <Text type="secondary">Storage Used</Text>
                <Text strong style={{ fontSize: 20 }}>
                  <DatabaseOutlined /> 318 GB
                </Text>
              </Space>
              <Progress
                type="dashboard"
                percent={38}
                size={72}
                strokeColor="#52c41a"
                format={(percent) => `${percent}%`}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ height: '100%' }}>
            <Space
              align="center"
              size="large"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <Space orientation="vertical" size={0}>
                <Text type="secondary">API Uptime</Text>
                <Text strong style={{ fontSize: 20 }}>
                  <ThunderboltOutlined /> 99.9%
                </Text>
              </Space>
              <Progress
                type="dashboard"
                percent={99}
                size={72}
                strokeColor="#eb2f96"
                format={(percent) => `${percent}%`}
              />
            </Space>
          </Card>
        </Col>
      </Row>

      <SectionLabel>Orders and Activity</SectionLabel>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} lg={16}>
          <Card
            title="Recent Orders"
            extra={<a href="#recent-orders">View All</a>}
            style={{ height: '100%' }}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
              scroll={{ x: 400 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Recent Activity" style={{ height: '100%' }}>
            <Timeline
              items={activityEvents.map((item) => ({
                color: item.color,
                content: (
                  <Space orientation="vertical" size={0}>
                    <Text>{item.event}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.time}
                    </Text>
                  </Space>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      <SectionLabel>Team and Schedule</SectionLabel>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <Space>
                <TeamOutlined /> Team Performance
              </Space>
            }
            style={{ height: '100%' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={teamMembers}
              renderItem={(member) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={member.name}
                    description={member.role}
                  />
                  <Progress percent={member.progress} size="small" style={{ width: 96 }} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="Task Progress" style={{ height: '100%' }}>
            <List
              itemLayout="vertical"
              dataSource={taskList}
              renderItem={(task) => (
                <List.Item style={{ padding: '10px 0' }}>
                  <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text strong>{task.title}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {task.due}
                      </Text>
                    </Space>
                    <Progress percent={task.percent} size="small" />
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={24} lg={8}>
          <Card
            title="Schedule"
            style={{ height: '100%' }}
            styles={{ body: { padding: '0 12px 12px' } }}
          >
            <Calendar fullscreen={false} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card>
            <Space orientation="vertical" size={8} style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>
                Welcome to ViteDash
              </Title>
              <Text type="secondary">
                {
                  "ViteDash is built with React 19, Vite 8, and Ant Design 6. It includes responsive layouts, a system-wide light/dark theme powered by Ant Design's ConfigProvider, authentication, and a growing set of starter pages."
                }
              </Text>
              <Divider style={{ margin: '8px 0' }} />
              <Space wrap>
                <Button type="primary">Explore Tables</Button>
                <Button>View Forms</Button>
                <Button>Manage Users</Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
