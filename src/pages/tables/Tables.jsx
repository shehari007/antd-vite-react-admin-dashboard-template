import { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Progress,
  Rate,
  Avatar,
  Typography,
  Space,
  Button,
  Input,
  Dropdown,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  DownloadOutlined,
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  InboxOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  ProjectOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const priorityColors = {
  High: 'red',
  Medium: 'gold',
  Low: 'green',
};

const statusConfig = {
  'on-track': { color: 'success', icon: <CheckCircleOutlined />, label: 'On Track' },
  'at-risk': { color: 'warning', icon: <ExclamationCircleOutlined />, label: 'At Risk' },
  delayed: { color: 'error', icon: <ClockCircleOutlined />, label: 'Delayed' },
};

const projects = [
  {
    key: '1',
    name: 'Website Redesign',
    description: 'Marketing site revamp',
    owner: { name: 'Emma Wilson', color: '#1677ff' },
    team: [
      { name: 'Emma Wilson', color: '#1677ff' },
      { name: 'Liam Carter', color: '#52c41a' },
      { name: 'Olivia Chen', color: '#faad14' },
    ],
    priority: 'High',
    status: 'on-track',
    progress: 78,
    trend: 12,
    rating: 5,
    budgetSpent: 8200,
    budgetTotal: 12400,
  },
  {
    key: '2',
    name: 'Mobile App Launch',
    description: 'iOS and Android release',
    owner: { name: 'Liam Carter', color: '#52c41a' },
    team: [
      { name: 'Liam Carter', color: '#52c41a' },
      { name: 'Noah Patel', color: '#eb2f96' },
    ],
    priority: 'High',
    status: 'at-risk',
    progress: 45,
    trend: -6,
    rating: 3,
    budgetSpent: 21400,
    budgetTotal: 28900,
  },
  {
    key: '3',
    name: 'Internal Tooling',
    description: 'Admin dashboard for support team',
    owner: { name: 'Olivia Chen', color: '#faad14' },
    team: [{ name: 'Olivia Chen', color: '#faad14' }],
    priority: 'Medium',
    status: 'on-track',
    progress: 62,
    trend: 4,
    rating: 4,
    budgetSpent: 3400,
    budgetTotal: 6200,
  },
  {
    key: '4',
    name: 'Marketing Campaign',
    description: 'Q3 multi-channel campaign',
    owner: { name: 'Noah Patel', color: '#eb2f96' },
    team: [
      { name: 'Noah Patel', color: '#eb2f96' },
      { name: 'Ava Martinez', color: '#722ed1' },
      { name: 'Emma Wilson', color: '#1677ff' },
    ],
    priority: 'Low',
    status: 'on-track',
    progress: 90,
    trend: 8,
    rating: 5,
    budgetSpent: 4300,
    budgetTotal: 4800,
  },
  {
    key: '5',
    name: 'API Migration',
    description: 'Move legacy endpoints to v2',
    owner: { name: 'Ava Martinez', color: '#722ed1' },
    team: [
      { name: 'Ava Martinez', color: '#722ed1' },
      { name: 'William Turner', color: '#13c2c2' },
    ],
    priority: 'Medium',
    status: 'delayed',
    progress: 33,
    trend: -11,
    rating: 2,
    budgetSpent: 9800,
    budgetTotal: 15000,
  },
  {
    key: '6',
    name: 'Customer Portal',
    description: 'Self-service billing and support',
    owner: { name: 'William Turner', color: '#13c2c2' },
    team: [
      { name: 'William Turner', color: '#13c2c2' },
      { name: 'Olivia Chen', color: '#faad14' },
    ],
    priority: 'High',
    status: 'at-risk',
    progress: 21,
    trend: -3,
    rating: 3,
    budgetSpent: 6100,
    budgetTotal: 19500,
  },
  {
    key: '7',
    name: 'Design System',
    description: 'Shared component library v2',
    owner: { name: 'Emma Wilson', color: '#1677ff' },
    team: [
      { name: 'Emma Wilson', color: '#1677ff' },
      { name: 'Liam Carter', color: '#52c41a' },
    ],
    priority: 'Low',
    status: 'on-track',
    progress: 100,
    trend: 2,
    rating: 5,
    budgetSpent: 9300,
    budgetTotal: 9300,
  },
];

const Tables = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.owner.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBudget = projects.reduce((sum, p) => sum + p.budgetTotal, 0);
  const avgProgress = Math.round(
    projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
  );
  const atRiskCount = projects.filter((p) => p.status !== 'on-track').length;

  const columns = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: owner.color }}>
            {owner.name[0]}
          </Avatar>
          <Text>{owner.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
      responsive: ['lg'],
      render: (team) => (
        <Avatar.Group size="small" max={{ count: 3 }}>
          {team.map((member) => (
            <Avatar key={member.name} style={{ backgroundColor: member.color }}>
              {member.name[0]}
            </Avatar>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      filters: Object.keys(priorityColors).map((priority) => ({ text: priority, value: priority })),
      onFilter: (value, record) => record.priority === value,
      render: (priority) => <Tag color={priorityColors[priority]}>{priority}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      responsive: ['sm'],
      filters: Object.entries(statusConfig).map(([value, config]) => ({
        text: config.label,
        value,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      sorter: (a, b) => a.progress - b.progress,
      render: (progress) => <Progress percent={progress} size="small" style={{ minWidth: 100 }} />,
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      responsive: ['lg'],
      sorter: (a, b) => a.trend - b.trend,
      render: (trend) => (
        <Tag
          color={trend >= 0 ? 'success' : 'error'}
          icon={trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        >
          {Math.abs(trend)}%
        </Tag>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      responsive: ['xl'],
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />,
    },
    {
      title: 'Budget',
      dataIndex: 'budgetTotal',
      key: 'budget',
      responsive: ['md'],
      sorter: (a, b) => a.budgetTotal - b.budgetTotal,
      render: (_, record) => (
        <Space orientation="vertical" size={2} style={{ minWidth: 110 }}>
          <Text style={{ fontSize: 12 }}>
            ${record.budgetSpent.toLocaleString()} / ${record.budgetTotal.toLocaleString()}
          </Text>
          <Progress
            percent={Math.round((record.budgetSpent / record.budgetTotal) * 100)}
            size="small"
            showInfo={false}
            strokeColor={record.budgetSpent >= record.budgetTotal ? '#52c41a' : '#1677ff'}
          />
        </Space>
      ),
    },
    {
      title: '',
      key: 'actions',
      fixed: 'right',
      align: 'right',
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: 'View' },
              { key: 'edit', icon: <EditOutlined />, label: 'Edit' },
              { key: 'archive', icon: <InboxOutlined />, label: 'Archive' },
              { type: 'divider' },
              { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }} wrap>
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            Projects
          </Title>
          <Text type="secondary">
            A richly-columned table example: avatars, tags, progress, ratings, trends, and row
            actions.
          </Text>
        </div>
        <Button icon={<DownloadOutlined />}>Export CSV</Button>
      </Space>

      <Row gutter={[16, 16]} align="stretch" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Total Projects"
              value={projects.length}
              prefix={<ProjectOutlined style={{ color: '#1677ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Statistic title="Avg. Progress" value={avgProgress} suffix="%" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Total Budget"
              value={totalBudget}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Needs Attention"
              value={atRiskCount}
              prefix={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by project or owner"
          allowClear
          style={{ maxWidth: 320, marginBottom: 16 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowSelection={{}}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 960 }}
          expandable={{
            expandedRowRender: (record) => (
              <Space orientation="vertical" size={4}>
                <Text type="secondary">{record.description}</Text>
                <Text type="secondary">
                  Team: {record.team.map((member) => member.name).join(', ')}
                </Text>
              </Space>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default Tables;
