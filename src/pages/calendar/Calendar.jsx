import {
  Card,
  Calendar as AntCalendar,
  Badge,
  Typography,
  Row,
  Col,
  List,
  Tag,
  Space,
  Button,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const eventsByDate = {
  5: [{ type: 'success', text: 'Design review' }],
  12: [{ type: 'warning', text: 'Client renewal' }],
  18: [
    { type: 'error', text: 'Server maintenance' },
    { type: 'success', text: 'Sprint demo' },
  ],
  24: [{ type: 'processing', text: 'Product launch' }],
};

const upcomingEvents = [
  { title: 'Design review', date: 'Jul 5, 10:00 AM', tag: 'Design', color: 'green' },
  { title: 'Client contract renewal', date: 'Jul 12, 2:00 PM', tag: 'Sales', color: 'gold' },
  { title: 'Scheduled server maintenance', date: 'Jul 18, 11:00 PM', tag: 'Ops', color: 'red' },
  {
    title: 'Sprint demo with stakeholders',
    date: 'Jul 18, 3:00 PM',
    tag: 'Product',
    color: 'green',
  },
  { title: 'Q3 product launch', date: 'Jul 24, 9:00 AM', tag: 'Marketing', color: 'blue' },
];

const cellRender = (value, info) => {
  if (info.type !== 'date') return info.originNode;
  const events = eventsByDate[value.date()];
  if (!events || value.month() !== new Date().getMonth()) return info.originNode;
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {events.map((item) => (
        <li key={item.text}>
          <Badge status={item.type} text={item.text} style={{ fontSize: 12 }} />
        </li>
      ))}
    </ul>
  );
};

const Calendar = () => {
  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }} wrap>
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            Calendar
          </Title>
          <Text type="secondary">
            {"Team schedule built with Ant Design's Calendar component."}
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          New Event
        </Button>
      </Space>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} lg={16}>
          <Card style={{ height: '100%' }}>
            <AntCalendar cellRender={cellRender} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Upcoming Events" style={{ height: '100%' }}>
            <List
              dataSource={upcomingEvents}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <Space orientation="vertical" size={4}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.date}
                        </Text>
                        <Tag color={item.color}>{item.tag}</Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Calendar;
