import * as d3 from 'd3';
import Heatmap from '../src/heatmap';
import data from './fixtures/data.json';
import { HeatmapProperties, Margin } from '../src/types';

beforeEach(() => {
  const d = document.createElement('div');
  d.classList.add('container');
  document.body.appendChild(d);
});

afterEach(function() {
  document.body.removeChild(document.querySelector('.container'));
});

describe('Rendering the heatmap', () => {
  beforeEach(() => {
    const margin: Margin = {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    };
    const mapProperties: HeatmapProperties = {
      width: 600,
      height: 400,
      margin,
      boxSize: 30,
    };
    const heatmapChart = new Heatmap(mapProperties);
    heatmapChart.make('.container', data);
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
});
