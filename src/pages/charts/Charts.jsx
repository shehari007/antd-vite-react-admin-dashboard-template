import { useCallback, useState } from 'react';
import { Col, Row, Segmented } from 'antd';
import { DollarOutlined, LineChartOutlined, RiseOutlined, TeamOutlined } from '@ant-design/icons';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import ErrorState from '@/components/ErrorState';
import ChartCard, { ChartTooltip } from '@/components/charts/ChartCard';
import { useChartTheme } from '@/components/charts/useChartTheme';
import { useAsync } from '@/hooks/useAsync';
import { getChartData } from '@/services/insightsService';

const money = (value) => `$${Number(value).toLocaleString()}`;

const Charts = () => {
  const { t } = useTranslation();
  const chart = useChartTheme();
  const [range, setRange] = useState('12m');

  // useCallback matters here: without it a new function every render would make
  // useAsync refetch forever.
  const load = useCallback(() => getChartData({ range }), [range]);
  const { data, loading, error, refresh } = useAsync(load);

  if (error) {
    return (
      <>
        <PageHeader title={t('page.charts.title')} subtitle={t('page.charts.subtitle')} />
        <ErrorState error={error} onRetry={refresh} />
      </>
    );
  }

  const totals = data?.totals;

  return (
    <>
      <PageHeader
        title={t('page.charts.title')}
        subtitle={t('page.charts.subtitle')}
        extra={
          <Segmented
            value={range}
            onChange={setRange}
            options={[
              { value: '6m', label: '6M' },
              { value: '12m', label: '12M' },
            ]}
          />
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Revenue"
            value={totals?.revenue ?? 0}
            prefix="$"
            trend={18.2}
            trendLabel="vs last period"
            icon={<DollarOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Profit"
            value={totals?.profit ?? 0}
            prefix="$"
            trend={12.7}
            trendLabel="vs last period"
            icon={<RiseOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Weekly visitors"
            value={totals?.visitors ?? 0}
            trend={-3.4}
            trendLabel="vs last week"
            icon={<TeamOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Conversion rate"
            value={totals?.conversionRate ?? 0}
            suffix="%"
            trend={0.8}
            trendLabel="vs last period"
            icon={<LineChartOutlined />}
          />
        </Col>

        <Col xs={24} xl={16}>
          <ChartCard
            loading={loading}
            title="Revenue and expenses"
            subtitle="Monthly totals for the selected range"
            height={320}
          >
            <AreaChart data={data?.revenue || []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chart.series[0]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={chart.series[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chart.series[2]} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chart.series[2]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chart.gridProps} />
              <XAxis dataKey="month" {...chart.axisProps} />
              <YAxis {...chart.axisProps} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip content={<ChartTooltip formatter={money} />} />
              <Legend wrapperStyle={{ fontSize: 12, color: chart.axis }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={chart.series[0]}
                fill="url(#fillRevenue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke={chart.series[2]}
                fill="url(#fillExpenses)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartCard>
        </Col>

        <Col xs={24} xl={8}>
          <ChartCard
            loading={loading}
            title="Traffic sources"
            subtitle="Sessions in the last 30 days"
            height={320}
          >
            <PieChart>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Pie
                data={data?.sources || []}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={2}
                stroke="none"
              >
                {(data?.sources || []).map((entry, index) => (
                  <Cell key={entry.name} fill={chart.series[index % chart.series.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartCard>
        </Col>

        <Col xs={24} xl={12}>
          <ChartCard
            loading={loading}
            title="Visitors this week"
            subtitle="Unique visitors against total page views"
            height={300}
          >
            <BarChart data={data?.visitors || []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...chart.gridProps} />
              <XAxis dataKey="day" {...chart.axisProps} />
              <YAxis {...chart.axisProps} />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: chart.grid, fillOpacity: 0.35 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="visitors"
                name="Visitors"
                fill={chart.series[0]}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="pageViews"
                name="Page views"
                fill={chart.series[1]}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartCard>
        </Col>

        <Col xs={24} xl={12}>
          <ChartCard
            loading={loading}
            title="Conversion funnel"
            subtitle="From first visit through to renewal"
            height={300}
          >
            <BarChart
              layout="vertical"
              data={data?.funnel || []}
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid {...chart.gridProps} horizontal={false} vertical />
              <XAxis type="number" {...chart.axisProps} />
              <YAxis type="category" dataKey="stage" width={86} {...chart.axisProps} />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: chart.grid, fillOpacity: 0.35 }}
              />
              <Bar dataKey="value" name="Users" radius={[0, 6, 6, 0]}>
                {(data?.funnel || []).map((entry, index) => (
                  <Cell key={entry.stage} fill={chart.series[index % chart.series.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>
        </Col>

        <Col xs={24} xl={12}>
          <ChartCard
            loading={loading}
            title="Team performance"
            subtitle="Current score against target"
            height={320}
          >
            <RadarChart data={data?.performance || []} outerRadius={110}>
              <PolarGrid stroke={chart.grid} />
              <PolarAngleAxis dataKey="area" tick={{ fill: chart.axis, fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Radar
                name="Current"
                dataKey="current"
                stroke={chart.series[0]}
                fill={chart.series[0]}
                fillOpacity={0.35}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke={chart.series[1]}
                fill={chart.series[1]}
                fillOpacity={0.15}
              />
            </RadarChart>
          </ChartCard>
        </Col>

        <Col xs={24} xl={12}>
          <ChartCard
            loading={loading}
            title="Profit trend"
            subtitle="Monthly profit for the selected range"
            height={320}
          >
            <AreaChart data={data?.revenue || []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chart.series[1]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={chart.series[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chart.gridProps} />
              <XAxis dataKey="month" {...chart.axisProps} />
              <YAxis {...chart.axisProps} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip content={<ChartTooltip formatter={money} />} />
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke={chart.series[1]}
                fill="url(#fillProfit)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartCard>
        </Col>
      </Row>
    </>
  );
};

export default Charts;
