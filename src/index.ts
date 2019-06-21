import {
  IBarChartDataItem,
  IBarChartProperties,
  IHeatmapProperties,
  ILineChartProperties,
  IMargin,
  IPieProperties,
  ISankeyDiagramLink,
  ISankeyDiagramNode,
  ISankeyDiagramProperties,
} from '../src/types';

import Heatmap from './heatmap';
import LineChart from './line';
import Pie from './pie';
import SankeyDiagram from './sankey';
import VerticalBarChart from './verticalBar';
import importedData from '../test/fixtures/data.json';

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
  const values = [15, 12, 4, 8, 9, 11, 1];
  const data: IBarChartDataItem[] = daysHuman.map((day, index) => ({
    label: day,
    value: values[index],
  }));
  let chart: VerticalBarChart;
  function main(rawData: IBarChartDataItem[]): void {
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
  const values = [15, 12, 4, 8, 9, 11, 1];
  const data = daysHuman.map((day, index) => ({
    label: day,
    value: values[index],
  }));
  let chart: Pie;
  function main(rawData: Array<{ label: string; value: number }>): void {
    const margin: IMargin = {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    };
    const data = rawData;
    const mapProperties: IPieProperties = {
      width: 900,
      height: 950,
      innerRatio: 0.4,
      outerRatio: 0.95,
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

  main(importedData);
  setInterval(() => {
    const d = importedData.map((d) => ({
      x: d[1],
      y: d[0],
      value: Math.random() * 35,
    }));
    heatmap.update(d);
  }, 1000);
}

function lineChartDemo() {
  let chart: LineChart;

  function main(
    dataset: Array<{ label: string; data: Array<{ x: number; y: number }> }>,
  ): void {
    const margin: IMargin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    };
    const mapProperties: ILineChartProperties = {
      width: 650,
      height: 750,
      margin,
      data: dataset,
      xAxisLabel: 'Time',
      yAxisLabel: 'Tickets Sold',
      dataUnit: 'Sale(s)',
      numTicks: 5,
      dataFormat: (value: number) => `${Math.round(value)}`,
    };
    chart = new LineChart(mapProperties);
    chart.make('.container');
  }
  const data1 = [];
  const data2 = [];
  const data3 = [];
  for (let i = 0; i < 15; i += 1) {
    data1.push({
      x: i,
      y: Math.random() * 10,
    });
    data2.push({
      x: i,
      y: Math.random() * 120,
    });
    data3.push({
      x: i,
      y: Math.random() * 50,
    });
  }
  main([
    { label: 'first', data: data1 },
    { label: 'second', data: data2 },
    { label: 'third', data: data3 },
  ]);
}

function sankeyDiagramDemo() {
  const nodes: ISankeyDiagramNode[] = [
    { name: 'Monday' },
    { name: 'Tuesday' },
    { name: 'Wednesday' },
    { name: 'Thursday' },
    { name: 'Friday' },
    { name: 'Saturday' },
    { name: 'Sunday' },
  ];
  const links: ISankeyDiagramLink[] = [
    { source: 0, target: 1, value: 124 },
    { source: 1, target: 5, value: 124 },
    { source: 2, target: 3, value: 124 },
    { source: 4, target: 5, value: 124 },
    { source: 3, target: 5, value: 124 },
    { source: 4, target: 7, value: 124 },
    { source: 5, target: 6, value: 124 },
    { source: 5, target: 7, value: 124 },
    { source: 4, target: 6, value: 124 },
    { source: 3, target: 4, value: 124 },
    { source: 1, target: 2, value: 124 },
    { source: 2, target: 4, value: 124 },
    { source: 3, target: 5, value: 124 },
    { source: 1, target: 3, value: 124 },
    { source: 1, target: 4, value: 124 },
  ];
  const data = { nodes, links };
  let chart: SankeyDiagram;
  function main(
    nodes: ISankeyDiagramNode[],
    links: ISankeyDiagramLink[],
  ): void {
    const margin: IMargin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    };
    const mapProperties: ISankeyDiagramProperties = {
      width: 550,
      height: 750,
      margin,
      data: d,
      order: true,
      dataUnit: 'Sale(s)',
      numTicks: 15,
      duration: 1000,
      dataFormat: (value: number) => `${Math.round(value)}`,
    };
    chart = new SankeyDiagram(mapProperties);
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

lineChartDemo();

verticalBarDemo();

pieDemo();

heatmapDemo();
