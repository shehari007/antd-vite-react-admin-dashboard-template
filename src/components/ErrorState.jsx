import { Button, Result } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

/**
 * The inline counterpart to the full page error screens: shown inside a card
 * when one request failed but the rest of the page is fine.
 */
const ErrorState = ({ error, onRetry, title }) => {
  const { t } = useTranslation();

  return (
    <Result
      status="warning"
      title={title || t('common.loadFailed')}
      subTitle={error?.message}
      extra={
        onRetry && (
          <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
            {t('common.retry')}
          </Button>
        )
      }
    />
  );
};

export default ErrorState;
