import { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Switch,
  Radio,
  Checkbox,
  Slider,
  InputNumber,
  Cascader,
  Rate,
  ColorPicker,
  AutoComplete,
  Upload,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Tabs,
  Steps,
  Result,
  Descriptions,
  App,
} from 'antd';
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const locationOptions = [
  {
    value: 'usa',
    label: 'United States',
    children: [
      {
        value: 'ca',
        label: 'California',
        children: [
          { value: 'la', label: 'Los Angeles' },
          { value: 'sf', label: 'San Francisco' },
        ],
      },
      {
        value: 'ny',
        label: 'New York',
        children: [{ value: 'nyc', label: 'New York City' }],
      },
    ],
  },
  {
    value: 'pk',
    label: 'Pakistan',
    children: [
      {
        value: 'pb',
        label: 'Punjab',
        children: [{ value: 'lhr', label: 'Lahore' }],
      },
    ],
  },
];

const companySuggestions = ['Acme Corp', 'Globex Inc', 'Initech', 'Umbrella LLC', 'Hooli'].map(
  (name) => ({
    value: name,
  })
);

const BasicDetailsForm = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    message.success('Form submitted successfully');
    console.log('form values', values);
  };

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ notifications: true, plan: 'pro', capacity: 50 }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Project Name"
              name="projectName"
              rules={[{ required: true, message: 'Please enter a project name' }]}
            >
              <Input placeholder="e.g. Customer Portal" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select
                placeholder="Select a category"
                options={[
                  { value: 'engineering', label: 'Engineering' },
                  { value: 'design', label: 'Design' },
                  { value: 'marketing', label: 'Marketing' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Deadline" name="deadline">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Plan" name="plan">
              <Radio.Group
                options={[
                  { label: 'Starter', value: 'starter' },
                  { label: 'Pro', value: 'pro' },
                  { label: 'Enterprise', value: 'enterprise' },
                ]}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Description" name="description">
          <TextArea rows={4} placeholder="Describe the project scope" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Team Capacity" name="capacity">
              <Slider min={0} max={100} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Email Notifications" name="notifications" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="tags" label="Tags">
          <Checkbox.Group options={['Internal', 'Client-facing', 'High Priority', 'Recurring']} />
        </Form.Item>

        <Divider />

        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

const AdvancedFieldsForm = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    message.success('Advanced form submitted successfully');
    console.log('advanced form values', values);
  };

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Budget" name="budget">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={100}
                prefix="$"
                placeholder="0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Working Hours" name="workingHours">
              <TimePicker.RangePicker style={{ width: '100%' }} format="HH:mm" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Project Window" name="projectWindow">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Company" name="company">
              <AutoComplete
                options={companySuggestions}
                placeholder="Start typing a company name"
                filterOption={(inputValue, option) =>
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Location" name="location">
              <Cascader options={locationOptions} placeholder="Select a location" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Brand Color" name="color">
              <ColorPicker defaultValue="#1677ff" showText />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Priority Rating" name="rating">
              <Rate />
            </Form.Item>
          </Col>
          <Col xs={24} md={16}>
            <Form.Item
              label="Attachments"
              name="attachments"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
            >
              <Upload beforeUpload={() => false} multiple>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

const wizardSteps = ['Account', 'Company', 'Review'];

const MultiStepWizard = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(false);

  const stepFields = {
    0: ['fullName', 'email', 'password'],
    1: ['companyName', 'teamSize', 'industry'],
  };

  const next = async () => {
    try {
      await form.validateFields(stepFields[current]);
      setCurrent((step) => step + 1);
    } catch {
      // validation errors are shown inline by the Form
    }
  };

  const back = () => setCurrent((step) => step - 1);

  const handleFinish = (values) => {
    message.success('Onboarding complete');
    console.log('wizard values', values);
    setCompleted(true);
  };

  const startOver = () => {
    form.resetFields();
    setCurrent(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <Card>
        <Result
          status="success"
          icon={<CheckCircleOutlined />}
          title="You're all set!"
          subTitle="This is where you'd redirect to the dashboard or trigger a real API call."
          extra={
            <Button type="primary" onClick={startOver}>
              Start Over
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card>
      <Steps
        current={current}
        items={wizardSteps.map((title) => ({ title }))}
        style={{ marginBottom: 32 }}
      />

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div style={{ display: current === 0 ? 'block' : 'none' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Jane Doe" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="you@example.com" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please create a password' }]}
          >
            <Input.Password placeholder="Create a password" />
          </Form.Item>
        </div>

        <div style={{ display: current === 1 ? 'block' : 'none' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Company Name"
                name="companyName"
                rules={[{ required: true, message: 'Please enter your company name' }]}
              >
                <Input placeholder="Acme Corp" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Team Size"
                name="teamSize"
                rules={[{ required: true, message: 'Please select a team size' }]}
              >
                <Select
                  placeholder="Select team size"
                  options={[
                    { value: '1-10', label: '1-10 employees' },
                    { value: '11-50', label: '11-50 employees' },
                    { value: '51-200', label: '51-200 employees' },
                    { value: '200+', label: '200+ employees' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Industry"
            name="industry"
            rules={[{ required: true, message: 'Please select an industry' }]}
          >
            <Select
              placeholder="Select an industry"
              options={[
                { value: 'saas', label: 'SaaS' },
                { value: 'ecommerce', label: 'E-commerce' },
                { value: 'finance', label: 'Finance' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </Form.Item>
        </div>

        {current === 2 && (
          <Form.Item shouldUpdate>
            {() => (
              <Descriptions column={1} bordered size="small" title="Review your details">
                <Descriptions.Item label="Full Name">
                  {form.getFieldValue('fullName')}
                </Descriptions.Item>
                <Descriptions.Item label="Email">{form.getFieldValue('email')}</Descriptions.Item>
                <Descriptions.Item label="Company">
                  {form.getFieldValue('companyName')}
                </Descriptions.Item>
                <Descriptions.Item label="Team Size">
                  {form.getFieldValue('teamSize')}
                </Descriptions.Item>
                <Descriptions.Item label="Industry">
                  {form.getFieldValue('industry')}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Form.Item>
        )}

        <Divider />

        <Space>
          {current > 0 && <Button onClick={back}>Back</Button>}
          {current < wizardSteps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {current === wizardSteps.length - 1 && (
            <Button type="primary" htmlType="submit">
              Finish
            </Button>
          )}
        </Space>
      </Form>
    </Card>
  );
};

const Forms = () => {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 4 }}>
        Forms
      </Title>
      <Text type="secondary">A range of form patterns built entirely with Ant Design.</Text>

      <Tabs
        style={{ marginTop: 24 }}
        defaultActiveKey="basic"
        items={[
          { key: 'basic', label: 'Basic Details', children: <BasicDetailsForm /> },
          { key: 'advanced', label: 'Advanced Fields', children: <AdvancedFieldsForm /> },
          { key: 'wizard', label: 'Multi-Step Wizard', children: <MultiStepWizard /> },
        ]}
      />
    </div>
  );
};

export default Forms;
