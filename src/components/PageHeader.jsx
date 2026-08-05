import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, Flex, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { getBreadcrumbTrail } from '@/layout/navConfig';

const { Title, Text } = Typography;

/**
 * The standard top of a page: breadcrumb, title, subtitle, and an actions slot.
 *
 * Every page used to hand roll this, which is why no two of them had the same
 * spacing. The breadcrumb builds itself from the navigation tree, so adding a
 * page to navConfig.jsx is all it takes for the trail to be correct.
 *
 *   <PageHeader
 *     title="Products"
 *     subtitle="Everything you sell"
 *     extra={<Button type="primary">Add product</Button>}
 *   />
 */
const PageHeader = ({ title, subtitle, extra, breadcrumb = true, children }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const trail = breadcrumb ? getBreadcrumbTrail(pathname, t) : [];

  return (
    <div style={{ marginBottom: 24 }}>
      {trail.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: 8 }}
          items={trail.map((crumb) =>
            crumb.to && crumb.to !== pathname
              ? { title: <Link to={crumb.to}>{crumb.label}</Link> }
              : { title: crumb.label }
          )}
        />
      )}

      <Flex align="flex-start" justify="space-between" gap={16} wrap="wrap">
        <div style={{ minWidth: 0 }}>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
              {subtitle}
            </Text>
          )}
        </div>
        {extra && <Space wrap>{extra}</Space>}
      </Flex>

      {children}
    </div>
  );
};

export default PageHeader;
