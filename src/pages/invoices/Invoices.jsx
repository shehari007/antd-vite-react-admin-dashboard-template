import { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Drawer,
  Descriptions,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  DownloadOutlined,
  EyeOutlined,
  DollarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const statusColors = {
  paid: 'success',
  pending: 'warning',
  overdue: 'error',
};

const invoices = [
  {
    key: 'INV-1001',
    client: 'Acme Corp',
    issued: '2026-06-01',
    due: '2026-06-15',
    amount: 4200,
    status: 'paid',
  },
  {
    key: 'INV-1002',
    client: 'Globex Inc',
    issued: '2026-06-04',
    due: '2026-06-18',
    amount: 1850,
    status: 'pending',
  },
  {
    key: 'INV-1003',
    client: 'Initech',
    issued: '2026-06-08',
    due: '2026-06-22',
    amount: 3120,
    status: 'overdue',
  },
  {
    key: 'INV-1004',
    client: 'Umbrella LLC',
    issued: '2026-06-12',
    due: '2026-06-26',
    amount: 960,
    status: 'paid',
  },
  {
    key: 'INV-1005',
    client: 'Hooli',
    issued: '2026-06-20',
    due: '2026-07-04',
    amount: 5400,
    status: 'pending',
  },
];

const Invoices = () => {
  const [selected, setSelected] = useState(null);

  const columns = [
    { title: 'Invoice', dataIndex: 'key', key: 'key' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Issued', dataIndex: 'issued', key: 'issued', responsive: ['md'] },
    { title: 'Due', dataIndex: 'due', key: 'due', responsive: ['md'] },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toLocaleString()}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>,
      filters: Object.keys(statusColors).map((status) => ({ text: status, value: status })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => setSelected(record)}>
          View
        </Button>
      ),
    },
  ];

  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices
    .filter((i) => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }} wrap>
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            Invoices
          </Title>
          <Text type="secondary">Billing overview with a detail drawer example.</Text>
        </div>
        <Button icon={<DownloadOutlined />}>Export</Button>
      </Space>

      <Row gutter={[16, 16]} align="stretch" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Paid"
              value={totalPaid}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Pending"
              value={totalPending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Overdue"
              value={totalOverdue}
              prefix={<FileTextOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={invoices}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 600 }}
        />
      </Card>

      <Drawer
        title={selected?.key}
        open={!!selected}
        onClose={() => setSelected(null)}
        size={400}
        extra={
          <Button type="primary" icon={<DownloadOutlined />}>
            Download
          </Button>
        }
      >
        {selected && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Client">{selected.client}</Descriptions.Item>
            <Descriptions.Item label="Issued">{selected.issued}</Descriptions.Item>
            <Descriptions.Item label="Due">{selected.due}</Descriptions.Item>
            <Descriptions.Item label="Amount">
              ${selected.amount.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selected.status]}>{selected.status.toUpperCase()}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default Invoices;
