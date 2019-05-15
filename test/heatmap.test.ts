import { IHeatmapProperties, IMargin } from '../src/types';

import Heatmap from '../src/heatmap';
import data from '../test/fixtures/data.json';

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
    height: 250,
    margin,
    xLabels: hoursHuman,
    yLabels: daysHuman,
    data: dataset,
    dataUnit: 'Sale(s)',
    dataFormat: (value: number) => `${Math.round(value)}`,
  };
  const heatmap = new Heatmap(mapProperties);
  heatmap.make('.container');
}

beforeEach(() => {
  const d = document.createElement('div');
  d.classList.add('container');
  document.body.appendChild(d);
});

afterEach(() => {
  document.body.removeChild(document.querySelector('.container'));
});

describe('Rendering the heatmap', () => {
  beforeEach(() => {
    main(data);
  });

  it('should render one heat map', () => {
    const expected = 1;
    const actual = document.querySelectorAll('.heatmap').length;
    expect(actual).toEqual(expected);
  });

  it('should render a square for each hour of the week', () => {
    const actual = document.querySelectorAll('.heatmap .box').length;
    expect(actual).toEqual(24 * 7);
  });

  it('should create a container and a chart groups', () => {
    const numContainerGroups = document.querySelectorAll(
      '.heatmap g.container-group',
    ).length;
    const numChartGroups = document.querySelectorAll('.heatmap g.chart-group')
      .length;
    expect(numContainerGroups).toEqual(1);
    expect(numChartGroups).toEqual(1);
  });

  it('should render the y-axis labels', () => {
    const actual = document.querySelectorAll('.heatmap .y-label').length;
    const expected = 7;
    expect(actual).toEqual(expected);
  });

  it('should render the x-axis labels', () => {
    const actual = document.querySelectorAll('.heatmap .x-label').length;
    const expected = 24;
    expect(actual).toEqual(expected);
  });

  it('should render a tooltip', () => {
    const actual = document.querySelectorAll('.container .tooltip').length;
    expect(actual).toEqual(1);
  });
});
