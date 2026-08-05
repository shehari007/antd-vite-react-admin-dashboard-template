import { useCallback } from 'react';
import { Alert, Card, Col, Row, Space, Table, Tag, Typography } from 'antd';
import { CheckCircleFilled, CloseOutlined, TeamOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader';
import ErrorState from '@/components/ErrorState';
import { useAsync } from '@/hooks/useAsync';
import { getRoles } from '@/services/workspaceService';
import { useAuth } from '@/context/useAuth';

const { Text, Paragraph } = Typography;

const Allowed = ({ value }) =>
  value ? (
    <CheckCircleFilled style={{ color: '#52c41a' }} aria-label="Allowed" />
  ) : (
    <CloseOutlined style={{ opacity: 0.3 }} aria-label="Not allowed" />
  );

/**
 * The page behind the admin only route.
 *
 * Reaching it at all means two things already happened: navConfig hid the menu
 * entry for other roles, and RequireRole in App.jsx checked again in case the
 * URL was typed by hand.
 */
const Roles = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, loading, error, refresh } = useAsync(useCallback(() => getRoles(), []));

  const columns = [
    {
      title: 'Permission',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space orientation="vertical" size={0}>
          <span>{name}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.group}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Administrator',
      dataIndex: 'admin',
      key: 'admin',
      align: 'center',
      width: 140,
      render: (value) => <Allowed value={value} />,
    },
    {
      title: 'Editor',
      dataIndex: 'editor',
      key: 'editor',
      align: 'center',
      width: 120,
      render: (value) => <Allowed value={value} />,
    },
    {
      title: 'Viewer',
      dataIndex: 'viewer',
      key: 'viewer',
      align: 'center',
      width: 120,
      render: (value) => <Allowed value={value} />,
    },
  ];

  if (error) {
    return (
      <>
        <PageHeader title={t('page.roles.title')} subtitle={t('page.roles.subtitle')} />
        <ErrorState error={error} onRetry={refresh} />
      </>
    );
  }

  return (
    <>
      <PageHeader title={t('page.roles.title')} subtitle={t('page.roles.subtitle')} />

      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message={`You are signed in as ${user?.name} with the ${user?.role} role.`}
        description="Sign in as editor@vitedash.dev to watch this page disappear from the sidebar and the route start returning a 403."
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {(data?.roles || []).map((role) => (
          <Col xs={24} md={8} key={role.key}>
            <Card loading={loading}>
              <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                <Space align="center" size={8}>
                  <Tag color={role.color}>{role.name}</Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <TeamOutlined /> {role.members} members
                  </Text>
                </Space>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  {role.description}
                </Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Permission matrix">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={data?.permissions || []}
          pagination={false}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>
    </>
  );
};

export default Roles;
