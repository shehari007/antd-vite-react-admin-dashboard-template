import { Card, Row, Col, Typography, Tag, Avatar, Space, Badge, Button } from 'antd';
import { PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const columns = [
  {
    key: 'backlog',
    title: 'Backlog',
    color: '#8c8c8c',
    cards: [
      { title: 'Research competitor pricing', tag: 'Research', due: 'Jul 10' },
      { title: 'Set up analytics dashboard', tag: 'Ops', due: 'Jul 14' },
    ],
  },
  {
    key: 'in-progress',
    title: 'In Progress',
    color: '#1677ff',
    cards: [
      { title: 'Redesign onboarding flow', tag: 'Design', due: 'Jul 8' },
      { title: 'API rate limiting', tag: 'Engineering', due: 'Jul 9' },
      { title: 'Q3 content calendar', tag: 'Marketing', due: 'Jul 11' },
    ],
  },
  {
    key: 'review',
    title: 'In Review',
    color: '#faad14',
    cards: [{ title: 'Checkout page A/B test', tag: 'Growth', due: 'Jul 7' }],
  },
  {
    key: 'done',
    title: 'Done',
    color: '#52c41a',
    cards: [
      { title: 'Migrate to new billing provider', tag: 'Engineering', due: 'Jul 2' },
      { title: 'Refresh landing page copy', tag: 'Marketing', due: 'Jul 3' },
    ],
  },
];

const tagColors = {
  Research: 'default',
  Ops: 'purple',
  Design: 'magenta',
  Engineering: 'blue',
  Marketing: 'gold',
  Growth: 'green',
};

const Kanban = () => {
  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }} wrap>
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            Kanban Board
          </Title>
          <Text type="secondary">Track work across stages with a static board example.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Add Task
        </Button>
      </Space>

      <Row gutter={[16, 16]} align="stretch">
        {columns.map((column) => (
          <Col xs={24} sm={12} lg={6} key={column.key}>
            <Card
              style={{ height: '100%' }}
              title={
                <Space>
                  <Badge color={column.color} />
                  {column.title}
                  <Text type="secondary" style={{ fontWeight: 400 }}>
                    {column.cards.length}
                  </Text>
                </Space>
              }
            >
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                {column.cards.map((card) => (
                  <Card key={card.title} size="small" hoverable>
                    <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                      <Text strong>{card.title}</Text>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Tag color={tagColors[card.tag]}>{card.tag}</Tag>
                        <Space size={4}>
                          <ClockCircleOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {card.due}
                          </Text>
                        </Space>
                      </Space>
                      <Avatar.Group size="small" max={{ count: 2 }}>
                        <Avatar style={{ backgroundColor: '#1677ff' }}>A</Avatar>
                        <Avatar style={{ backgroundColor: '#52c41a' }}>B</Avatar>
                      </Avatar.Group>
                    </Space>
                  </Card>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Kanban;
