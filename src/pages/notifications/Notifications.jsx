import { useCallback, useState } from 'react';
import { Avatar, Badge, Button, Card, List, Segmented, Space, Typography } from 'antd';
import {
  AlertOutlined,
  CheckOutlined,
  CreditCardOutlined,
  FileDoneOutlined,
  ShoppingOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { useAsync } from '@/hooks/useAsync';
import { getNotifications } from '@/services/workspaceService';

const { Text } = Typography;

const TYPE_ICONS = {
  order: { icon: <ShoppingOutlined />, color: '#1677ff' },
  alert: { icon: <AlertOutlined />, color: '#ff4d4f' },
  report: { icon: <FileDoneOutlined />, color: '#13c2c2' },
  member: { icon: <UserAddOutlined />, color: '#52c41a' },
  billing: { icon: <CreditCardOutlined />, color: '#722ed1' },
};

/** Turns "180 minutes ago" into "3h ago" without pulling in a date library. */
const relativeTime = (minutes) => {
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / (60 * 24))}d ago`;
};

const Notifications = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [readIds, setReadIds] = useState([]);

  const load = useCallback(() => getNotifications({ filter }), [filter]);
  const { data, loading, error, refresh } = useAsync(load);

  const isRead = (item) => item.read || readIds.includes(item.id);
  const items = data || [];
  const unreadCount = items.filter((item) => !isRead(item)).length;

  if (error) {
    return (
      <>
        <PageHeader
          title={t('page.notifications.title')}
          subtitle={t('page.notifications.subtitle')}
        />
        <ErrorState error={error} onRetry={refresh} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t('page.notifications.title')}
        subtitle={t('page.notifications.subtitle')}
        extra={
          <Space>
            <Segmented
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: t('common.all') },
                { value: 'unread', label: 'Unread' },
                { value: 'read', label: 'Read' },
              ]}
            />
            <Button
              icon={<CheckOutlined />}
              disabled={unreadCount === 0}
              onClick={() => setReadIds(items.map((item) => item.id))}
            >
              {t('common.markAllRead')}
            </Button>
          </Space>
        }
      />

      <Card>
        <List
          loading={loading}
          dataSource={items}
          locale={{
            emptyText: <EmptyState title="Inbox zero" description="No notifications here." />,
          }}
          renderItem={(item) => {
            const config = TYPE_ICONS[item.type] || TYPE_ICONS.report;
            const read = isRead(item);

            return (
              <List.Item
                actions={[
                  !read && (
                    <Button
                      key="read"
                      type="link"
                      size="small"
                      onClick={() => setReadIds((ids) => [...ids, item.id])}
                    >
                      Mark read
                    </Button>
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!read} offset={[-4, 4]}>
                      <Avatar
                        style={{ backgroundColor: `${config.color}1a`, color: config.color }}
                        icon={config.icon}
                      />
                    </Badge>
                  }
                  title={
                    <Space size={8} wrap>
                      <span style={{ fontWeight: read ? 400 : 600 }}>{item.title}</span>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {relativeTime(item.minutesAgo)}
                      </Text>
                    </Space>
                  }
                  description={item.body}
                />
              </List.Item>
            );
          }}
        />
      </Card>
    </>
  );
};

export default Notifications;
