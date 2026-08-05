import {
  Card,
  Tabs,
  Typography,
  Form,
  Input,
  Switch,
  Button,
  Space,
  Divider,
  Radio,
  Segmented,
  Select,
} from 'antd';
import { CheckOutlined, MoonOutlined, SunOutlined, UndoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader';
import { useThemeMode } from '@/context/useThemeMode';
import { PRIMARY_PRESETS, RADIUS_PRESETS } from '@/context/theme-mode-context';
import { LANGUAGES } from '@/i18n';

const { Text } = Typography;

const GeneralSettings = () => {
  const { language, setLanguage } = useThemeMode();

  return (
    <Card>
      <Form layout="vertical" initialValues={{ timezone: 'utc' }}>
        <Form.Item label="Workspace name" name="workspace">
          <Input placeholder="My Company" />
        </Form.Item>
        <Form.Item label="Language" help="Switches the app language and the text direction.">
          <Select
            value={language}
            onChange={setLanguage}
            options={LANGUAGES.map((item) => ({ value: item.code, label: item.label }))}
          />
        </Form.Item>
        <Form.Item label="Timezone" name="timezone">
          <Select
            options={[
              { value: 'utc', label: 'UTC' },
              { value: 'pkt', label: 'Pakistan Standard Time' },
              { value: 'est', label: 'Eastern Time' },
            ]}
          />
        </Form.Item>
        <Button type="primary">Save changes</Button>
      </Form>
    </Card>
  );
};

const AppearanceSettings = () => {
  const {
    mode,
    setMode,
    isDark,
    primaryColor,
    setPrimaryColor,
    borderRadius,
    setBorderRadius,
    compact,
    setCompact,
    resetTheme,
  } = useThemeMode();

  return (
    <Card>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text strong>Theme mode</Text>
          <div style={{ marginTop: 8 }}>
            <Radio.Group
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              optionType="button"
              buttonStyle="solid"
              options={[
                {
                  label: (
                    <>
                      <SunOutlined /> Light
                    </>
                  ),
                  value: 'light',
                },
                {
                  label: (
                    <>
                      <MoonOutlined /> Dark
                    </>
                  ),
                  value: 'dark',
                },
              ]}
            />
          </div>
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            {
              "Applied instantly across the app via Ant Design's ConfigProvider. You are currently in "
            }
            <strong>{isDark ? 'dark' : 'light'}</strong> mode.
          </Text>
        </div>

        <Divider style={{ margin: 0 }} />

        <div>
          <Text strong>Primary colour</Text>
          <Space size={10} wrap style={{ marginTop: 10 }}>
            {PRIMARY_PRESETS.map((preset) => {
              const selected = preset.color.toLowerCase() === primaryColor.toLowerCase();
              return (
                <Button
                  key={preset.key}
                  onClick={() => setPrimaryColor(preset.color)}
                  aria-label={preset.name}
                  aria-pressed={selected}
                  icon={selected ? <CheckOutlined /> : undefined}
                  style={{
                    width: 34,
                    height: 34,
                    background: preset.color,
                    borderColor: preset.color,
                    color: '#fff',
                  }}
                />
              );
            })}
          </Space>
        </div>

        <div>
          <Text strong>Corner radius</Text>
          <div style={{ marginTop: 10 }}>
            <Segmented
              value={borderRadius}
              onChange={setBorderRadius}
              options={RADIUS_PRESETS.map((radius) => ({ value: radius, label: String(radius) }))}
            />
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Text strong>Compact density</Text>
            <div>
              <Text type="secondary">Tighter spacing across every component</Text>
            </div>
          </div>
          <Switch checked={compact} onChange={setCompact} aria-label="Compact density" />
        </Space>

        <Button icon={<UndoOutlined />} onClick={resetTheme}>
          Reset to defaults
        </Button>
      </Space>
    </Card>
  );
};

const SecuritySettings = () => (
  <Card>
    <Form layout="vertical">
      <Form.Item label="Current Password" name="currentPassword">
        <Input.Password />
      </Form.Item>
      <Form.Item label="New Password" name="newPassword">
        <Input.Password />
      </Form.Item>
      <Form.Item label="Confirm New Password" name="confirmPassword">
        <Input.Password />
      </Form.Item>
      <Divider />
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <div>
          <Text strong>Two-Factor Authentication</Text>
          <div>
            <Text type="secondary">Add an extra layer of security to your account</Text>
          </div>
        </div>
        <Switch />
      </Space>
      <Divider />
      <Button type="primary">Update Security Settings</Button>
    </Form>
  </Card>
);

const NotificationSettings = () => (
  <Card>
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      {[
        { title: 'Product Updates', description: 'News about product and feature updates' },
        {
          title: 'Security Alerts',
          description: 'Important notifications about your account security',
        },
        { title: 'Weekly Digest', description: 'A summary of activity from the past week' },
      ].map((item) => (
        <Space key={item.title} style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Text strong>{item.title}</Text>
            <div>
              <Text type="secondary">{item.description}</Text>
            </div>
          </div>
          <Switch defaultChecked />
        </Space>
      ))}
    </Space>
  </Card>
);

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader
        title={t('nav.items.settings')}
        subtitle="Manage your workspace, appearance, and account preferences."
      />

      <Tabs
        defaultActiveKey="general"
        items={[
          { key: 'general', label: 'General', children: <GeneralSettings /> },
          { key: 'appearance', label: 'Appearance', children: <AppearanceSettings /> },
          { key: 'security', label: 'Security', children: <SecuritySettings /> },
          { key: 'notifications', label: 'Notifications', children: <NotificationSettings /> },
        ]}
      />
    </div>
  );
};

export default Settings;
