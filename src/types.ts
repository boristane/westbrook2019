export interface IHeatmapProperties {
  width: number;
  height: number;
  margin: IMargin;
  xLabels: string[];
  yLabels: string[];
  data: Array<{ x: number; y: number; value: number }>;
  strokeWidth?: number;
  colorSchema?: string[];
  dataUnit?: string;
  dataFormat?: (value: number) => string;
}

export interface IBarChartProperties {
  width: number;
  height: number;
  margin: IMargin;
  data: Array<{ label: string; value: number }>;
  color?: string;
  dataUnit?: string;
  numTicks?: number;
  order?: boolean;
  axisLabel?: string;
  duration?: number;
  dataFormat?: (value: number) => string;
}

export interface ILineChartProperties {
  width: number;
  height: number;
  margin: IMargin;
  data: Array<{ x: number; y: number }>;
  color?: string;
  dataUnit?: string;
  numTicks?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  dataFormat?: (value: number) => string;
}

export interface IMargin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
