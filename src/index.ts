import Heatmap from '../src/heatmap';
import { Margin, HeatmapProperties } from '../src/types';
import data from '../test/fixtures/data.json';

let heatmap: Heatmap;

export default function main(data: number[][]): void {
  const daysHuman = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
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
  const hourLabelHeight = 20;
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
    boxSize: 30,
    xLabels: hoursHuman,
    yLabels: daysHuman,
    animate: true,
    data,
  };
  heatmap = new Heatmap(mapProperties);
  heatmap.make('.container');
}

main(data);

setInterval(() => {
  const d = data.map((elt) => [
    elt[0],
    elt[1],
    elt[2] + Math.random() * (Math.random() < 0.5 ? 20 : -20),
  ]);
  heatmap.update(d);
}, 1000);
