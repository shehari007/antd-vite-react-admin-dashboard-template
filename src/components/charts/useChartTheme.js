import { theme } from 'antd';

/**
 * Recharts does not know anything about Ant Design's theme, so every colour it
 * draws has to be handed to it. This hook is the bridge: read it once per chart
 * and the axes, grid, and series all follow the active light or dark theme and
 * the primary colour chosen in the customizer.
 *
 *   const chart = useChartTheme();
 *   <Line stroke={chart.series[0]} />
 */
export const useChartTheme = () => {
  const { token } = theme.useToken();

  return {
    axis: token.colorTextTertiary,
    grid: token.colorSplit,
    text: token.colorText,
    surface: token.colorBgElevated,
    border: token.colorBorderSecondary,
    // Ordered so neighbouring series never sit on similar hues, and every one
    // of them holds up against both the light and the dark card background.
    series: [
      token.colorPrimary,
      token.colorSuccess,
      token.colorWarning,
      token.colorError,
      '#722ed1',
      '#13c2c2',
    ],
    gridProps: {
      stroke: token.colorSplit,
      strokeDasharray: '4 4',
      vertical: false,
    },
    axisProps: {
      stroke: token.colorSplit,
      tick: { fill: token.colorTextTertiary, fontSize: 12 },
      tickLine: false,
      axisLine: false,
    },
  };
};
