import { Card, Space, Statistic, Typography, theme } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * The metric tile used across the dashboard pages.
 *
 * `trend` is a signed number: positive renders green with an up arrow,
 * negative renders red with a down arrow, and omitting it hides the row.
 *
 *   <StatCard title="Revenue" value={92400} prefix="$" trend={12.4} icon={<DollarOutlined />} />
 */
const StatCard = ({
  title,
  value,
  prefix,
  suffix,
  precision,
  trend,
  trendLabel,
  icon,
  loading,
}) => {
  const {
    token: { colorSuccess, colorError, colorPrimary, colorFillQuaternary, borderRadiusLG },
  } = theme.useToken();

  const isUp = typeof trend === 'number' && trend >= 0;

  return (
    <Card loading={loading} styles={{ body: { padding: 20 } }}>
      <Space align="start" size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {title}
          </Text>
          <Statistic
            value={value}
            prefix={prefix}
            suffix={suffix}
            precision={precision}
            valueStyle={{ fontSize: 26, fontWeight: 600, lineHeight: 1.3 }}
          />
          {typeof trend === 'number' && (
            <Space size={4} style={{ marginTop: 4 }}>
              <Text style={{ color: isUp ? colorSuccess : colorError, fontSize: 13 }}>
                {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(trend)}%
              </Text>
              {trendLabel && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {trendLabel}
                </Text>
              )}
            </Space>
          )}
        </div>

        {icon && (
          <div
            aria-hidden="true"
            style={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: borderRadiusLG,
              background: colorFillQuaternary,
              color: colorPrimary,
              fontSize: 20,
            }}
          >
            {icon}
          </div>
        )}
      </Space>
    </Card>
  );
};

export default StatCard;
