import { Button, Empty, Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

/**
 * What a list shows when it has nothing to show. Worth having as a component
 * rather than an inline <Empty />, because "nothing here yet" and "nothing
 * matched your filter" want different words and different buttons.
 */
const EmptyState = ({ title, description, action, actionLabel, onAction, image }) => {
  const { t } = useTranslation();

  return (
    <Flex vertical align="center" justify="center" style={{ padding: '40px 16px' }}>
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span>
            <Text strong style={{ display: 'block' }}>
              {title || t('common.noData')}
            </Text>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {description || t('common.noDataHint')}
            </Text>
          </span>
        }
      >
        {action ||
          (onAction && (
            <Button type="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          ))}
      </Empty>
    </Flex>
  );
};

export default EmptyState;
