import { IBarChartProperties, IHeatmapProperties, ILineChartProperties, IMargin, IPieProperties } from '../src/types';

import Heatmap from './heatmap';
import LineChart from './line';
import Pie from './pie';
import VerticalBarChart from "./verticalBar";
import data from '../test/fixtures/data.json';

function verticalBarDemo() {
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
      numTicks: 15,
      duration: 1000,
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
  }, 2000);
}

function pieDemo() {
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
  let chart: Pie;
  function main(rawData: Array<{ label: string; value: number }>): void {
    const margin: IMargin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    };
    const data = rawData;
    const mapProperties: IPieProperties = {
      width: 900,
      height: 950,
      innerRatio: 0.8,
      outerRatio: 0.9,
      margin,
      data,
      dataUnit: 'Sale(s)',
      dataFormat: (value: number) => `${Math.round(value)}`,
    };
    chart = new Pie(mapProperties);
    chart.make('.container');
  }

  main(data);

  setInterval(() => {
    const d = daysHuman.map((day, index) => ({
      label: day,
      value: Math.random() * 300,
    }));
    chart.update(d);
  }, 2000);
}

function heatmapDemo() {
  let heatmap: Heatmap;
  function main(rawData: number[][]): void {
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
    const dataset = rawData.map((d) => ({
      x: d[1],
      y: d[0],
      value: d[2],
    }));
    const margin: IMargin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    };

    const mapProperties: IHeatmapProperties = {
      width: 750,
      height: 200,
      margin,
      xLabels: hoursHuman,
      yLabels: daysHuman,
      data: dataset,
      dataUnit: 'Sale(s)',
      dataFormat: (value: number) => `${Math.round(value)}`,
    };
    heatmap = new Heatmap(mapProperties);
    heatmap.make('.container');
  }

  main(data);
  setInterval(() => {
    const d = data.map((d) => ({
      x: d[1],
      y: d[0],
      value: Math.random() * 35,
    }));
    heatmap.update(d);
  }, 1000);
}

function lineChartDemo() {
  let chart: LineChart;

  function main(dataset: Array<{ x: number; y: number }>): void {
    dataset.sort((a, b) => a.x - b.x);
    const margin: IMargin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    };
    const data = dataset;
    const mapProperties: ILineChartProperties = {
      width: 550,
      height: 750,
      margin,
      data,
      xAxisLabel: 'Time',
      yAxisLabel: 'Tickets Sold',
      dataUnit: 'Sale(s)',
      numTicks: 5,
      dataFormat: (value: number) => `${Math.round(value)}`,
    };
    chart = new LineChart(mapProperties);
    chart.make('.container');
  }
  const rawData = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
  main(rawData);
  let i = 1;
  setInterval(() => {
    const d = {
      x: Math.max(...rawData.map(d => d.x)) + 1,
      y: Math.random() * 120,
    };
    chart.update(d);
    i += 1;
  }, 1000);
}

// lineChartDemo();

// verticalBarDemo();

pieDemo();

// heatmapDemo();
