import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Progress,
  Statistic,
  Space,
  Segmented,
  Table,
  Tag,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const trafficSources = [
  { label: 'Organic Search', value: 42, color: '#1677ff' },
  { label: 'Direct', value: 26, color: '#52c41a' },
  { label: 'Social Media', value: 18, color: '#faad14' },
  { label: 'Referral', value: 14, color: '#eb2f96' },
];

const weeklyVisitors = [
  { day: 'Mon', value: 62 },
  { day: 'Tue', value: 74 },
  { day: 'Wed', value: 58 },
  { day: 'Thu', value: 88 },
  { day: 'Fri', value: 95 },
  { day: 'Sat', value: 47 },
  { day: 'Sun', value: 40 },
];

const deviceBreakdown = [
  { label: 'Desktop', value: 58, color: '#1677ff', icon: <DesktopOutlined /> },
  { label: 'Mobile', value: 34, color: '#52c41a', icon: <MobileOutlined /> },
  { label: 'Tablet', value: 8, color: '#faad14', icon: <TabletOutlined /> },
];

const funnelStages = [
  { label: 'Visitors', value: 12400, percent: 100 },
  { label: 'Product Views', value: 8200, percent: 66 },
  { label: 'Added to Cart', value: 3100, percent: 25 },
  { label: 'Checkout Started', value: 1850, percent: 15 },
  { label: 'Purchased', value: 980, percent: 8 },
];

const topPages = [
  { key: '1', page: '/dashboard/home', views: 18420, avgTime: '3m 42s', bounce: 28, trend: 12 },
  { key: '2', page: '/pricing', views: 12980, avgTime: '2m 05s', bounce: 41, trend: -6 },
  { key: '3', page: '/dashboard/analytics', views: 9410, avgTime: '4m 18s', bounce: 22, trend: 9 },
  { key: '4', page: '/signup', views: 7635, avgTime: '1m 32s', bounce: 55, trend: -3 },
  { key: '5', page: '/dashboard/users', views: 5220, avgTime: '3m 05s', bounce: 30, trend: 4 },
];

const topPageColumns = [
  { title: 'Page', dataIndex: 'page', key: 'page' },
  {
    title: 'Views',
    dataIndex: 'views',
    key: 'views',
    sorter: (a, b) => a.views - b.views,
    render: (views) => views.toLocaleString(),
  },
  { title: 'Avg. Time', dataIndex: 'avgTime', key: 'avgTime', responsive: ['md'] },
  {
    title: 'Bounce Rate',
    dataIndex: 'bounce',
    key: 'bounce',
    responsive: ['sm'],
    render: (bounce) => <Progress percent={bounce} size="small" style={{ maxWidth: 120 }} />,
  },
  {
    title: 'Trend',
    dataIndex: 'trend',
    key: 'trend',
    align: 'right',
    render: (trend) => (
      <Tag
        color={trend >= 0 ? 'success' : 'error'}
        icon={trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      >
        {Math.abs(trend)}%
      </Tag>
    ),
  },
];

const Analytics = () => {
  const [range, setRange] = useState('7d');
  const maxVisitors = Math.max(...weeklyVisitors.map((entry) => entry.value));

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }} wrap>
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            Analytics
          </Title>
          <Text type="secondary">
            {"Key metrics built with Ant Design's Progress and Statistic components."}
          </Text>
        </div>
        <Segmented
          value={range}
          onChange={setRange}
          options={[
            { label: '7 Days', value: '7d' },
            { label: '30 Days', value: '30d' },
            { label: '90 Days', value: '90d' },
          ]}
        />
      </Space>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Page Views"
              value={128430}
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 18%
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Bounce Rate"
              value={34.6}
              suffix={
                <Text type="danger" style={{ fontSize: 14 }}>
                  <ArrowDownOutlined /> 4%
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Avg. Session"
              value="4m 12s"
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 6%
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Conversion Rate"
              value={3.8}
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 1.2%
                </Text>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="stretch" style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Traffic Sources" style={{ height: '100%' }}>
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              {trafficSources.map((source) => (
                <div key={source.label}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>{source.label}</Text>
                    <Text type="secondary">{source.value}%</Text>
                  </Space>
                  <Progress percent={source.value} showInfo={false} strokeColor={source.color} />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Device Breakdown" style={{ height: '100%' }}>
            <Row gutter={16}>
              {deviceBreakdown.map((device) => (
                <Col span={8} key={device.label} style={{ textAlign: 'center' }}>
                  <Progress
                    type="circle"
                    percent={device.value}
                    size={88}
                    strokeColor={device.color}
                    format={(percent) => (
                      <Space orientation="vertical" size={0}>
                        <span style={{ color: device.color, fontSize: 16 }}>{device.icon}</span>
                        <span style={{ fontSize: 14 }}>{percent}%</span>
                      </Space>
                    )}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">{device.label}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="stretch" style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Weekly Visitors" style={{ height: '100%' }}>
            <Space
              align="end"
              size="middle"
              style={{ width: '100%', justifyContent: 'space-between', height: 180 }}
            >
              {weeklyVisitors.map((entry) => (
                <Space
                  key={entry.day}
                  orientation="vertical"
                  align="center"
                  size={8}
                  style={{ height: '100%', justifyContent: 'flex-end' }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {entry.value}
                  </Text>
                  <div
                    style={{
                      width: 24,
                      height: `${(entry.value / maxVisitors) * 120}px`,
                      borderRadius: 6,
                      background: 'linear-gradient(180deg, #1677ff 0%, #69b1ff 100%)',
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {entry.day}
                  </Text>
                </Space>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Conversion Funnel" style={{ height: '100%' }}>
            <Space orientation="vertical" size={12} style={{ width: '100%' }}>
              {funnelStages.map((stage) => (
                <div key={stage.label}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>{stage.label}</Text>
                    <Text type="secondary">{stage.value.toLocaleString()}</Text>
                  </Space>
                  <div
                    style={{
                      width: `${stage.percent}%`,
                      height: 10,
                      borderRadius: 6,
                      marginTop: 4,
                      background: 'linear-gradient(90deg, #1677ff 0%, #69b1ff 100%)',
                    }}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Top Pages" extra={<a href="#top-pages">View All</a>}>
            <Table
              columns={topPageColumns}
              dataSource={topPages}
              pagination={false}
              size="small"
              scroll={{ x: 520 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
