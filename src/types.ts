export interface HeatmapProperties {
  width: number;
  height: number;
  margin: Margin;
  boxSize: number;
  animate: boolean;
  xLabels: string[];
  yLabels: string[];
  data: number[][];
}

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
