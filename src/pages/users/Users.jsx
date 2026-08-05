import { useState } from 'react';
import { Card, Table, Avatar, Tag, Space, Button, Input, Dropdown, Typography } from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const roleColors = {
  Admin: 'red',
  Editor: 'blue',
  Viewer: 'default',
};

const statusColors = {
  active: 'success',
  invited: 'processing',
  suspended: 'error',
};

const initialUsers = [
  {
    key: '1',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    role: 'Admin',
    status: 'active',
    joined: '2025-01-12',
  },
  {
    key: '2',
    name: 'Liam Carter',
    email: 'liam@example.com',
    role: 'Editor',
    status: 'active',
    joined: '2025-03-04',
  },
  {
    key: '3',
    name: 'Olivia Chen',
    email: 'olivia@example.com',
    role: 'Viewer',
    status: 'invited',
    joined: '2025-05-19',
  },
  {
    key: '4',
    name: 'Noah Patel',
    email: 'noah@example.com',
    role: 'Editor',
    status: 'active',
    joined: '2025-06-30',
  },
  {
    key: '5',
    name: 'Ava Martinez',
    email: 'ava@example.com',
    role: 'Viewer',
    status: 'suspended',
    joined: '2025-09-08',
  },
  {
    key: '6',
    name: 'William Turner',
    email: 'william@example.com',
    role: 'Admin',
    status: 'active',
    joined: '2025-11-21',
  },
];

const Users = () => {
  const [users] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Space orientation="vertical" size={0}>
            <span>{name}</span>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              <MailOutlined /> {record.email}
            </Typography.Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: Object.keys(roleColors).map((role) => ({ text: role, value: role })),
      onFilter: (value, record) => record.role === value,
      render: (role) => <Tag color={roleColors[role]}>{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      responsive: ['sm'],
      render: (status) => <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>,
    },
    {
      title: 'Joined',
      dataIndex: 'joined',
      key: 'joined',
      responsive: ['md'],
      sorter: (a, b) => new Date(a.joined) - new Date(b.joined),
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: 'edit', icon: <EditOutlined />, label: 'Edit' },
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
            Users
          </Title>
          <Typography.Text type="secondary">
            Manage team members, roles, and access.
          </Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Invite User
        </Button>
      </Space>

      <Card>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name or email"
          allowClear
          style={{ maxWidth: 320, marginBottom: 16 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowSelection={{}}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
};

export default Users;
