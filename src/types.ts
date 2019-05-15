export interface HeatmapProperties {
  width: number;
  height: number;
  margin: Margin;
  animate?: boolean;
  xLabels: string[];
  yLabels: string[];
  data: { x: number; y: number; value: number }[];
  strokeWidth?: number;
  colorSchema?: string[];
  dataUnit?: string;
  dataFormat?: (value: number) => string;
}

export interface BarChartProperties {
  width: number;
  height: number;
  margin: Margin;
  animate?: boolean;
  data: { label: string; value: number }[];
  color?: string;
  dataUnit?: string;
  numTicks?: number;
  order?: boolean;
  dataFormat?: (value: number) => string;
}

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
