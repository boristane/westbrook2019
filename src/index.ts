import Heatmap from '../src/heatmap';
import { Margin, HeatmapProperties } from '../src/types';
import rawData from '../test/fixtures/data.json';

let heatmap: Heatmap;

export default function main(rawData: number[][]): void {
  const daysHuman = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const hoursHuman = [
    '00h',
    '01h',
    '02h',
    '03h',
    '04h',
    '05h',
    '06h',
    '07h',
    '08h',
    '09h',
    '10h',
    '11h',
    '12h',
    '13h',
    '14h',
    '15h',
    '16h',
    '17h',
    '18h',
    '19h',
    '20h',
    '21h',
    '22h',
    '23h',
  ];
  const data = rawData.map((d) => ({
    x: d[1],
    y: d[0],
    value: d[2],
  }));
  const margin: Margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  const mapProperties: HeatmapProperties = {
    width: 750,
    height: 250,
    margin,
    xLabels: hoursHuman,
    yLabels: daysHuman,
    data,
    dataUnit: 'Sale(s)',
    dataFormat: (value: number) => `${Math.round(value)}`,
  };
  heatmap = new Heatmap(mapProperties);
  heatmap.make('.container');
}

main(rawData);

// setInterval(() => {
//   const d = rawData.map((d) => ({
//     x: d[1],
//     y: d[0],
//     value: d[2] + Math.random() * (Math.random() < 0.5 ? 50 : -50),
//   }));
//   heatmap.update(d);
// }, 1000);
