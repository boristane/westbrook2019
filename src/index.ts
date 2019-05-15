import { BarChartProperties, HeatmapProperties, Margin } from '../src/types';

import VerticalBarChart from './verticalBar';

let chart: VerticalBarChart;

const daysHuman = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const rawData = daysHuman.map((day) => ({
  label: day,
  value: Math.random() * 15,
}));

export default function main(rawData: Array<{ label: string; value: number }>): void {
  const margin: Margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };
  const data = rawData;
  const mapProperties: BarChartProperties = {
    width: 550,
    height: 750,
    margin,
    data,
    order: true,
    dataUnit: 'Sale(s)',
    numTicks: 5,
    dataFormat: (value: number) => `${Math.round(value)}`,
  };
  chart = new VerticalBarChart(mapProperties);
  chart.make('.container');
}

main(rawData);

setInterval(() => {
  const d = daysHuman.map((day) => ({
    label: day,
    value: Math.random() * 300,
  }));
  chart.update(d);
}, 1000);
