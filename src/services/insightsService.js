import {
  CONVERSION_FUNNEL,
  REVENUE_SERIES,
  TEAM_PERFORMANCE,
  TRAFFIC_SOURCES,
  WEEKLY_VISITORS,
} from '@/data/insights';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** One call for the whole Charts page, the way a real dashboard endpoint works. */
export const getChartData = async ({ range = '12m' } = {}) => {
  await delay(450);
  const revenue = range === '6m' ? REVENUE_SERIES.slice(-6) : REVENUE_SERIES;
  return {
    revenue,
    visitors: WEEKLY_VISITORS,
    sources: TRAFFIC_SOURCES,
    funnel: CONVERSION_FUNNEL,
    performance: TEAM_PERFORMANCE,
    totals: {
      revenue: revenue.reduce((sum, row) => sum + row.revenue, 0),
      profit: revenue.reduce((sum, row) => sum + row.profit, 0),
      visitors: WEEKLY_VISITORS.reduce((sum, row) => sum + row.visitors, 0),
      conversionRate: ((CONVERSION_FUNNEL.at(-1).value / CONVERSION_FUNNEL[0].value) * 100).toFixed(
        1
      ),
    },
  };
};
