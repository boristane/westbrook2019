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

export interface IPieProperties {
  width: number;
  height: number;
  margin: IMargin;
  data: Array<{ label: string; value: number }>;
  dataUnit?: string;
  innerRatio?: number;
  outerRatio?: number;
  dataFormat?: (value: number) => string;
}

export interface ILineChartProperties {
  width: number;
  height: number;
  margin: IMargin;
  data: Array<{ label: string; data: Array<{ x: number; y: number }> }>;
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

export interface ISankeyDiagramProperties {
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

export interface IBarChartDataItem {
  label: string;
  value: number;
}

export interface ISankeyDiagramNode {
  name: string;
}

export interface ISankeyDiagramLink {
  source: number;
  target: number;
  value: number;
}
