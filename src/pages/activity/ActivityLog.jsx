import { useCallback, useState } from 'react';
import { Card, Col, Row, Select, Space, Table, Tag, Timeline, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { useAsync } from '@/hooks/useAsync';
import { getActivityLog } from '@/services/workspaceService';
import { ACTIVITY_LOG } from '@/data/workspace';

const { Text } = Typography;

const SEVERITY = {
  info: { color: 'blue', label: 'Info' },
  success: { color: 'green', label: 'Success' },
  warning: { color: 'gold', label: 'Warning' },
  error: { color: 'red', label: 'Error' },
};

const relativeTime = (minutes) => {
  if (minutes < 60) return `${minutes} minutes ago`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} hours ago`;
  return `${Math.floor(minutes / (60 * 24))} days ago`;
};

const ACTORS = [...new Set(ACTIVITY_LOG.map((entry) => entry.actor))];

const ActivityLog = () => {
  const { t } = useTranslation();
  const [actor, setActor] = useState(null);
  const [severity, setSeverity] = useState(null);

  const load = useCallback(() => getActivityLog({ actor, severity }), [actor, severity]);
  const { data, loading, error, refresh } = useAsync(load);

  const entries = data || [];

  const columns = [
    {
      title: 'Who',
      dataIndex: 'actor',
      key: 'actor',
      render: (value, record) => (
        <Space orientation="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>{value}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.device}
          </Text>
        </Space>
      ),
    },
    {
      title: 'What',
      key: 'what',
      render: (_value, record) => (
        <Space orientation="vertical" size={0}>
          <span>
            {record.action} <strong>{record.target}</strong>
          </span>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.detail}
          </Text>
        </Space>
      ),
    },
    {
      title: 'IP address',
      dataIndex: 'ip',
      key: 'ip',
      responsive: ['lg'],
      render: (value) => <Text code>{value}</Text>,
    },
    {
      title: 'When',
      dataIndex: 'minutesAgo',
      key: 'when',
      responsive: ['md'],
      render: (value) => relativeTime(value),
    },
    {
      title: t('common.status'),
      dataIndex: 'severity',
      key: 'severity',
      render: (value) => <Tag color={SEVERITY[value].color}>{SEVERITY[value].label}</Tag>,
    },
  ];

  if (error) {
    return (
      <>
        <PageHeader title={t('page.activity.title')} subtitle={t('page.activity.subtitle')} />
        <ErrorState error={error} onRetry={refresh} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t('page.activity.title')}
        subtitle={t('page.activity.subtitle')}
        extra={
          <Space wrap>
            <Select
              allowClear
              placeholder="All people"
              value={actor}
              onChange={setActor}
              options={ACTORS.map((name) => ({ value: name, label: name }))}
              style={{ width: 180 }}
              aria-label="Filter by person"
            />
            <Select
              allowClear
              placeholder="All severities"
              value={severity}
              onChange={setSeverity}
              options={Object.entries(SEVERITY).map(([value, config]) => ({
                value,
                label: config.label,
              }))}
              style={{ width: 160 }}
              aria-label="Filter by severity"
            />
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card title="Audit trail">
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={entries}
              pagination={{ pageSize: 8, hideOnSinglePage: true }}
              scroll={{ x: 'max-content' }}
              size="middle"
              locale={{
                emptyText: (
                  <EmptyState
                    title="Nothing recorded"
                    description="No activity matched those filters."
                  />
                ),
              }}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card title="Recent timeline" loading={loading}>
            {entries.length === 0 ? (
              <EmptyState
                title="Nothing recorded"
                description="No activity matched those filters."
              />
            ) : (
              <Timeline
                items={entries.slice(0, 6).map((entry) => ({
                  color: SEVERITY[entry.severity].color,
                  content: (
                    <Space orientation="vertical" size={0}>
                      <span>
                        <strong>{entry.actor}</strong> {entry.action} {entry.target}
                      </span>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {relativeTime(entry.minutesAgo)}
                      </Text>
                    </Space>
                  ),
                }))}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ActivityLog;
