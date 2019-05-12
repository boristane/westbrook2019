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

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
