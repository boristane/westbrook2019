export interface HeatmapProperties {
  width: number;
  height: number;
  margin: Margin;
  boxSize: number;
  xLabels: string[];
  yLabels: string[];
}

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
