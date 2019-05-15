import { Margin, HeatmapProperties, BarChartProperties } from '../src/types';
import rawData from '../test/fixtures/data.json';
import VerticalBarChart from './verticalBar';

let heatmap: VerticalBarChart;

const daysHuman = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const data = daysHuman.map((day) => ({
  label: day,
  value: Math.random() * 15,
}));

export default function main(rawData: number[][]): void {
  const margin: Margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  const mapProperties: BarChartProperties = {
    width: 550,
    height: 750,
    margin,
    data,
    order: true,
    dataUnit: 'Sale(s)',
    dataFormat: (value: number) => `${Math.round(value)}`,
  };
  heatmap = new VerticalBarChart(mapProperties);
  heatmap.make('.container');
}

main(rawData);

setInterval(() => {
  const d = daysHuman.map((day) => ({
    label: day,
    value: Math.random() * 300,
  }));
  heatmap.update(d);
}, 1000);
