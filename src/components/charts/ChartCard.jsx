import { Card, Space, Typography, theme } from 'antd';
import { ResponsiveContainer } from 'recharts';

const { Text } = Typography;

/**
 * Card shell for a chart.
 *
 * ResponsiveContainer needs a parent with a real height, which is the single
 * most common reason a Recharts chart renders as nothing at all, so the height
 * is set here rather than left to each page to remember.
 *
 * The inner wrapper is forced to `dir="ltr"`. Recharts lays its axes out in
 * document order and does not mirror them, so inheriting a right to left
 * direction would put the labels on the wrong side of the plot while the bars
 * stayed where they were.
 */
const ChartCard = ({ title, subtitle, extra, height = 300, loading, children }) => (
  <Card
    loading={loading}
    title={
      title && (
        <Space orientation="vertical" size={0}>
          <span>{title}</span>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              {subtitle}
            </Text>
          )}
        </Space>
      )
    }
    extra={extra}
    styles={{ body: { paddingInline: 12 } }}
  >
    <div dir="ltr" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </Card>
);

/**
 * Recharts ships a white tooltip with a hard coded border, which looks broken
 * the moment the app is in dark mode. Passing this as `content` puts it back on
 * the Ant Design tokens.
 *
 *   <Tooltip content={<ChartTooltip formatter={(v) => `$${v}`} />} />
 */
export const ChartTooltip = ({ active, payload, label, formatter }) => {
  const {
    token: {
      colorBgElevated,
      colorBorderSecondary,
      colorText,
      colorTextSecondary,
      borderRadius,
      boxShadowTertiary,
    },
  } = theme.useToken();

  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: colorBgElevated,
        border: `1px solid ${colorBorderSecondary}`,
        borderRadius,
        boxShadow: boxShadowTertiary,
        padding: '8px 12px',
        minWidth: 140,
      }}
    >
      {label != null && (
        <div style={{ color: colorTextSecondary, fontSize: 12, marginBottom: 6 }}>{label}</div>
      )}
      {payload.map((entry) => (
        <div
          key={entry.dataKey ?? entry.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            color: colorText,
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: entry.color || entry.fill,
                display: 'inline-block',
              }}
            />
            {entry.name}
          </span>
          <strong>{formatter ? formatter(entry.value, entry) : entry.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default ChartCard;
