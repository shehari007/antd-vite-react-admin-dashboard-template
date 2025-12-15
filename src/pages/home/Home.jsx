import React from 'react';
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
} from 'antd';
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
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Home = () => {
  // Sample data for the table
  const recentOrders = [
    {
      key: '1',
      order: '#ORD-001',
      customer: 'John Doe',
      date: '2024-01-15',
      amount: '$250.00',
      status: 'completed',
    },
    {
      key: '2',
      order: '#ORD-002',
      customer: 'Jane Smith',
      date: '2024-01-14',
      amount: '$180.00',
      status: 'pending',
    },
    {
      key: '3',
      order: '#ORD-003',
      customer: 'Bob Johnson',
      date: '2024-01-14',
      amount: '$320.00',
      status: 'processing',
    },
    {
      key: '4',
      order: '#ORD-004',
      customer: 'Alice Brown',
      date: '2024-01-13',
      amount: '$95.00',
      status: 'completed',
    },
  ];

  const columns = [
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      responsive: ['md'],
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
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

  const recentActivities = [
    {
      title: 'New user registered',
      description: 'John Doe created a new account',
      time: '2 minutes ago',
    },
    {
      title: 'Order completed',
      description: 'Order #ORD-001 has been delivered',
      time: '15 minutes ago',
    },
    {
      title: 'Payment received',
      description: '$520.00 payment processed',
      time: '1 hour ago',
    },
    {
      title: 'New review',
      description: '5-star rating from Alice',
      time: '3 hours ago',
    },
  ];

  return (
    <div style={{ padding: '0' }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Dashboard Overview
      </Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Users"
              value={2847}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 12%
                </Text>
              }
            />
            <Progress percent={75} showInfo={false} strokeColor="#1890ff" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
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
          <Card hoverable>
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
          <Card hoverable>
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

      {/* Tables and Lists */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Recent Orders" extra={<a href="#">View All</a>}>
            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
              scroll={{ x: 400 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Recent Activity">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.title}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.description}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {item.time}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Welcome Message */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card>
            <Space direction="vertical">
              <Title level={5}>Welcome to your Admin Dashboard! 🎉</Title>
              <Text type="secondary">
                This template is built with React 19, Vite 7, and Ant Design 6.
                It includes responsive layouts, authentication, and a clean
                component structure to help you get started quickly.
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
