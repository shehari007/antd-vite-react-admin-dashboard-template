import {
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Tabs,
  Descriptions,
  Tag,
  Space,
  Button,
  Form,
  Input,
  List,
  Progress,
  Upload,
  Divider,
  Grid,
  theme,
  App,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
  IdcardOutlined,
  MessageOutlined,
  ProjectOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  BulbOutlined,
  BgColorsOutlined,
  CodeOutlined,
  TeamOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  UploadOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const skills = [
  { name: 'Product Strategy', level: 90, color: '#faad14', icon: <BulbOutlined /> },
  { name: 'UI/UX Design', level: 78, color: '#722ed1', icon: <BgColorsOutlined /> },
  { name: 'React & TypeScript', level: 85, color: '#1677ff', icon: <CodeOutlined /> },
  { name: 'Team Leadership', level: 70, color: '#52c41a', icon: <TeamOutlined /> },
];

const activity = [
  {
    text: 'Completed the Q2 roadmap review',
    icon: <CheckCircleFilled />,
    color: '#52c41a',
    time: '2 days ago',
  },
  {
    text: 'Shipped the new onboarding flow',
    icon: <RocketOutlined />,
    color: '#1677ff',
    time: '5 days ago',
  },
  {
    text: 'Led the design system workshop',
    icon: <TeamOutlined />,
    color: '#722ed1',
    time: '1 week ago',
  },
  {
    text: 'Published the accessibility audit',
    icon: <SafetyCertificateOutlined />,
    color: '#faad14',
    time: '2 weeks ago',
  },
];

const aboutItems = [
  { label: 'Role', value: 'Product Designer', icon: <IdcardOutlined />, color: '#1677ff' },
  { label: 'Department', value: 'Design', icon: <ApartmentOutlined />, color: '#722ed1' },
  { label: 'Location', value: 'Lahore, Pakistan', icon: <EnvironmentOutlined />, color: '#fa8c16' },
  { label: 'Email', value: 'shehariyar@gmail.com', icon: <MailOutlined />, color: '#13c2c2' },
  { label: 'Phone', value: '+92 300 0000000', icon: <PhoneOutlined />, color: '#52c41a' },
];

const ProfileOverview = () => (
  <Row gutter={[16, 16]} align="stretch">
    <Col xs={24} lg={12}>
      <Card title="About" style={{ height: '100%' }}>
        <Descriptions column={1} size="small" bordered>
          {aboutItems.map((item) => (
            <Descriptions.Item
              key={item.label}
              label={
                <Space size={6}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                  {item.label}
                </Space>
              }
            >
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
    </Col>
    <Col xs={24} lg={12}>
      <Card title="Skills" style={{ height: '100%' }}>
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          {skills.map((skill) => (
            <div key={skill.name}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space size={8}>
                  <span style={{ color: skill.color }}>{skill.icon}</span>
                  <Text>{skill.name}</Text>
                </Space>
                <Text type="secondary">{skill.level}%</Text>
              </Space>
              <Progress percent={skill.level} showInfo={false} strokeColor={skill.color} />
            </div>
          ))}
        </Space>
      </Card>
    </Col>
    <Col span={24}>
      <Card title="Recent Activity">
        <List
          dataSource={activity}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: `${item.color}1a`, color: item.color }}
                    icon={item.icon}
                  />
                }
                title={item.text}
                description={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.time}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </Col>
  </Row>
);

const ProfileEdit = () => {
  const { message } = App.useApp();

  const handleFinish = () => {
    message.success('Profile updated successfully');
  };

  return (
    <Card>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          name: 'Muhammad Sheharyar Butt',
          email: 'shehariyar@gmail.com',
          role: 'Product Designer',
          department: 'Design',
          location: 'Lahore, Pakistan',
          phone: '+92 300 0000000',
        }}
      >
        <Space orientation="vertical" size={4} style={{ marginBottom: 24 }}>
          <Text strong>Profile Photo</Text>
          <Space align="center" size={16}>
            <Avatar size={64} icon={<UserOutlined />} />
            <Upload beforeUpload={() => false} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Change Photo</Button>
            </Upload>
          </Space>
        </Space>

        <Divider style={{ margin: '0 0 24px' }} />

        <Text strong style={{ display: 'block', marginBottom: 16 }}>
          Personal Information
        </Text>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Full Name" name="name">
              <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Role" name="role">
              <Input prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Department" name="department">
              <Input prefix={<ApartmentOutlined style={{ color: '#bfbfbf' }} />} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Location" name="location">
              <Input prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />} />
            </Form.Item>
          </Col>
        </Row>

        <Text strong style={{ display: 'block', margin: '8px 0 16px' }}>
          Contact Details
        </Text>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Phone" name="phone">
              <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Bio" name="bio">
          <Input.TextArea rows={4} placeholder="Tell us about yourself" />
        </Form.Item>

        <Divider />

        <Space>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
          <Button htmlType="button">Cancel</Button>
        </Space>
      </Form>
    </Card>
  );
};

const Profile = () => {
  const screens = useBreakpoint();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const stats = [
    { label: 'Projects', value: 24, icon: <ProjectOutlined />, color: '#1677ff' },
    { label: 'Tasks Completed', value: 128, icon: <CheckSquareOutlined />, color: '#52c41a' },
    { label: 'Member Since', value: 'Jan 2023', icon: <CalendarOutlined />, color: '#faad14' },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 24, overflow: 'hidden' }} styles={{ body: { padding: 0 } }}>
        <div
          style={{
            height: 100,
            background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
          }}
        />
        <div style={{ padding: '0 24px 24px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: screens.sm ? 'flex-end' : 'center',
              gap: 16,
            }}
          >
            <Space
              direction={screens.sm ? 'horizontal' : 'vertical'}
              align={screens.sm ? 'end' : 'center'}
              size={16}
              style={{
                width: screens.sm ? 'auto' : '100%',
                textAlign: screens.sm ? 'left' : 'center',
              }}
            >
              <Avatar
                size={96}
                icon={<UserOutlined />}
                style={{ border: `4px solid ${colorBgContainer}`, marginTop: -48 }}
              />
              <div>
                <Title level={4} style={{ marginBottom: 4 }}>
                  Muhammad Sheharyar Butt
                </Title>
                <Space
                  wrap
                  style={{ justifyContent: screens.sm ? 'flex-start' : 'center', width: '100%' }}
                >
                  <Tag color="blue">Product Designer</Tag>
                  <Tag color="green">Active</Tag>
                  <Tag color="gold">Pro Member</Tag>
                </Space>
              </div>
            </Space>
            <Space wrap style={{ marginTop: screens.sm ? -48 : 0, justifyContent: 'center' }}>
              <Button icon={<MessageOutlined />}>Message</Button>
              <Button type="primary" icon={<EditOutlined />}>
                Edit Profile
              </Button>
            </Space>
          </div>

          <Divider style={{ margin: '20px 0' }} />

          <Row gutter={16}>
            {stats.map((stat, index) => (
              <Col
                span={8}
                key={stat.label}
                style={{
                  textAlign: 'center',
                  borderInlineStart: index > 0 ? '1px solid rgba(128,128,128,0.15)' : undefined,
                }}
              >
                <Space orientation="vertical" size={2}>
                  <span style={{ color: stat.color, fontSize: 18 }}>{stat.icon}</span>
                  <Text strong style={{ fontSize: screens.sm ? 18 : 14 }}>
                    {stat.value}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {stat.label}
                  </Text>
                </Space>
              </Col>
            ))}
          </Row>
        </div>
      </Card>

      <Tabs
        defaultActiveKey="overview"
        items={[
          { key: 'overview', label: 'Overview', children: <ProfileOverview /> },
          { key: 'edit', label: 'Edit Profile', children: <ProfileEdit /> },
        ]}
      />
    </div>
  );
};

export default Profile;
