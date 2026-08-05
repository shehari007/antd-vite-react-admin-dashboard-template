import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  List,
  Segmented,
  Tag,
  Tooltip,
  Modal,
  Table,
  App,
} from 'antd';
import { CheckCircleFilled, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const plans = [
  {
    name: 'Starter',
    monthly: 9,
    yearly: 90,
    description: 'For individuals trying things out.',
    features: [
      { label: '1 workspace' },
      { label: '5 dashboard pages' },
      { label: 'Community support' },
      { label: 'Basic analytics', tooltip: 'Page views, sessions, and top pages only.' },
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    monthly: 29,
    yearly: 290,
    description: 'For growing teams that need more.',
    features: [
      { label: 'Unlimited workspaces' },
      { label: 'All dashboard pages' },
      { label: 'Priority support', tooltip: 'Email support with a same-day response target.' },
      { label: 'Advanced analytics' },
      { label: 'Custom theming' },
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    monthly: 79,
    yearly: 790,
    description: 'For organizations at scale.',
    features: [
      { label: 'Everything in Pro' },
      {
        label: 'SSO & audit logs',
        tooltip: 'SAML/OIDC single sign-on plus exportable audit trails.',
      },
      { label: 'Dedicated support' },
      { label: 'Custom integrations' },
      { label: 'SLA guarantee' },
    ],
    highlighted: false,
  },
];

const comparisonRows = [
  {
    key: 'workspaces',
    feature: 'Workspaces',
    starter: '1',
    pro: 'Unlimited',
    enterprise: 'Unlimited',
  },
  { key: 'pages', feature: 'Dashboard pages', starter: '5', pro: 'All', enterprise: 'All' },
  {
    key: 'support',
    feature: 'Support',
    starter: 'Community',
    pro: 'Priority',
    enterprise: 'Dedicated',
  },
  {
    key: 'analytics',
    feature: 'Analytics',
    starter: 'Basic',
    pro: 'Advanced',
    enterprise: 'Advanced',
  },
  { key: 'theming', feature: 'Custom theming', starter: false, pro: true, enterprise: true },
  { key: 'sso', feature: 'SSO & audit logs', starter: false, pro: false, enterprise: true },
  { key: 'sla', feature: 'SLA guarantee', starter: false, pro: false, enterprise: true },
];

const renderCell = (value) => {
  if (value === true) return <CheckCircleFilled style={{ color: '#52c41a' }} />;
  if (value === false) return <CloseOutlined style={{ color: '#d9d9d9' }} />;
  return value;
};

const comparisonColumns = [
  { title: 'Feature', dataIndex: 'feature', key: 'feature' },
  { title: 'Starter', dataIndex: 'starter', key: 'starter', align: 'center', render: renderCell },
  { title: 'Pro', dataIndex: 'pro', key: 'pro', align: 'center', render: renderCell },
  {
    title: 'Enterprise',
    dataIndex: 'enterprise',
    key: 'enterprise',
    align: 'center',
    render: renderCell,
  },
];

const Pricing = () => {
  const { message } = App.useApp();
  const [cycle, setCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const confirmPlan = () => {
    message.success(`${selectedPlan.name} plan selected. Wire this up to your billing provider.`);
    setSelectedPlan(null);
  };

  return (
    <div>
      <Space
        orientation="vertical"
        size={4}
        style={{ width: '100%', textAlign: 'center', marginBottom: 24 }}
      >
        <Title level={4} style={{ marginBottom: 0 }}>
          Pricing Plans
        </Title>
        <Text type="secondary">
          Simple, transparent pricing example built with Ant Design cards.
        </Text>
        <Space style={{ marginTop: 12 }}>
          <Segmented
            value={cycle}
            onChange={setCycle}
            options={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Yearly', value: 'yearly' },
            ]}
          />
          {cycle === 'yearly' && <Tag color="green">Save ~20%</Tag>}
        </Space>
      </Space>

      <Row gutter={[16, 16]} align="stretch">
        {plans.map((plan) => (
          <Col xs={24} md={8} key={plan.name}>
            <Card
              style={{
                height: '100%',
                borderTop: plan.highlighted ? '3px solid #1677ff' : undefined,
              }}
            >
              <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {plan.name}
                  </Title>
                  {plan.highlighted && <Tag color="blue">Most Popular</Tag>}
                </Space>
                <Text type="secondary">{plan.description}</Text>
                <div>
                  <Text style={{ fontSize: 32, fontWeight: 700 }}>
                    ${cycle === 'monthly' ? plan.monthly : plan.yearly}
                  </Text>
                  <Text type="secondary">/{cycle === 'monthly' ? 'month' : 'year'}</Text>
                </div>
                <Button
                  type={plan.highlighted ? 'primary' : 'default'}
                  block
                  size="large"
                  onClick={() => setSelectedPlan(plan)}
                >
                  Choose {plan.name}
                </Button>
                <List
                  size="small"
                  dataSource={plan.features}
                  renderItem={(feature) => (
                    <List.Item style={{ border: 'none', padding: '6px 0' }}>
                      <Space>
                        <CheckCircleFilled style={{ color: '#52c41a' }} />
                        <Text>{feature.label}</Text>
                        {feature.tooltip && (
                          <Tooltip title={feature.tooltip}>
                            <InfoCircleOutlined style={{ color: '#bfbfbf' }} />
                          </Tooltip>
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Compare Plans" style={{ marginTop: 24 }}>
        <Table
          columns={comparisonColumns}
          dataSource={comparisonRows}
          pagination={false}
          scroll={{ x: 480 }}
        />
      </Card>

      <Modal
        title={selectedPlan ? `Confirm ${selectedPlan.name} plan` : ''}
        open={!!selectedPlan}
        onOk={confirmPlan}
        onCancel={() => setSelectedPlan(null)}
        okText="Proceed to Checkout"
      >
        {selectedPlan && (
          <Space orientation="vertical" size={8} style={{ width: '100%' }}>
            <Text>
              You are about to select the <Text strong>{selectedPlan.name}</Text> plan, billed{' '}
              {cycle === 'monthly' ? 'monthly' : 'yearly'}.
            </Text>
            <Text style={{ fontSize: 24, fontWeight: 700 }}>
              ${cycle === 'monthly' ? selectedPlan.monthly : selectedPlan.yearly}
              <Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}>
                /{cycle === 'monthly' ? 'month' : 'year'}
              </Text>
            </Text>
            <Text type="secondary">This is a demo confirmation, no payment will be charged.</Text>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default Pricing;
