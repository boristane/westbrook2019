export interface HeatmapProperties {
  width: number;
  height: number;
  margin: Margin;
  animate?: boolean;
  xLabels: string[];
  yLabels: string[];
  data: number[][];
  strokeWidth?: number;
  colorSchema?: string[];
}

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
