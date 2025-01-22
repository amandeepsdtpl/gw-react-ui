export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  animate?: boolean;
}

export interface MultiSeriesDataPoint {
  label: string;
  values: number[];
  colors?: string[];
}

export interface MultiSeriesChartProps extends Omit<ChartProps, 'data'> {
  data: MultiSeriesDataPoint[];
  series: string[];
}

export interface ScatterDataPoint {
  x: number;
  y: number;
  label?: string;
  size?: number;
  color?: string;
}

export interface ScatterChartProps extends Omit<ChartProps, 'data'> {
  data: ScatterDataPoint[];
  xLabel?: string;
  yLabel?: string;
}