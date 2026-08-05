import { Button, Flex, Progress, Result, Space, Typography, theme } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_LINKS } from '@/config/appInfo';

const { Text } = Typography;

/**
 * A standalone page for planned downtime. Point your load balancer or your
 * feature flag at /maintenance and every visitor lands here instead of a
 * half working app.
 */
const Maintenance = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight: '100dvh', background: colorBgLayout, padding: 24 }}
    >
      <Result
        icon={<ToolOutlined />}
        title={t('page.maintenance.title')}
        subTitle={t('page.maintenance.subtitle')}
        extra={
          <Space orientation="vertical" size={16} style={{ width: '100%', maxWidth: 360 }}>
            <div>
              <Progress percent={72} status="active" showInfo={false} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Estimated completion in about 20 minutes
              </Text>
            </div>
            <Space>
              <Button type="primary" onClick={() => navigate('/dashboard/home')}>
                {t('page.maintenance.back')}
              </Button>
              <Button href={APP_LINKS.email}>Contact support</Button>
            </Space>
          </Space>
        }
      />
    </Flex>
  );
};

export default Maintenance;
