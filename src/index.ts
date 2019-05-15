import { IBarChartProperties, IMargin } from './types';

import VerticalBarChart from "./verticalBar";

// import { IBarChartProperties, IHeatmapProperties, ILineChartProperties, IMargin } from '../src/types';

// import LineChart from './line';
// import VerticalBarChart from './verticalBar';

// let chart: LineChart;

// const numPoints = 12;
// const rawData = [];
// for (let i = 0; i < numPoints; i += 1) {
//   rawData.push({
//     x: Math.random() * 20,
//     y: Math.random() * 120,
//   });
// }

// export default function main(dataset: Array<{ x: number; y: number }>): void {
//   dataset.sort((a, b) => a.x - b.x);
//   const margin: IMargin = {
//     top: 10,
//     bottom: 10,
//     left: 10,
//     right: 10,
//   };
//   const data = dataset;
//   const mapProperties: ILineChartProperties = {
//     width: 550,
//     height: 750,
//     margin,
//     data,
//     order: true,
//     xAxisLabel: 'Time',
//     yAxisLabel: 'Tickets Sold',
//     dataUnit: 'Sale(s)',
//     numTicks: 5,
//     dataFormat: (value: number) => `${Math.round(value)}`,
//   };
//   chart = new LineChart(mapProperties);
//   chart.make('.container');
// }

// main(rawData);

const daysHuman = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const values = [
  15,
  12,
  4,
  8,
  9,
  11,
  1,
];
const data = daysHuman.map((day, index) => ({
  label: day,
  value: values[index],
}));
let chart: VerticalBarChart;
function main(rawData: Array<{ label: string; value: number }>): void {
  const margin: IMargin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };
  const data = rawData;
  const mapProperties: IBarChartProperties = {
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

main(data);

setInterval(() => {
  const d = daysHuman.map((day, index) => ({
    label: day,
    value: Math.random() * 300,
  }));
  chart.update(d);
}, 1000);
