import * as d3 from 'd3';
import heatmap from '../src/heatmap';
import data from './fixtures/data.json';

let container: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
let heatmapChart;

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
    heatmapChart = heatmap();
    container = d3.select('.container');
    container.datum(data).call(heatmapChart);
  });

  it('should render one heat map', () => {
    const expected = 1;
    const actual = container.select('.heatmap').nodes().length;
    expect(actual).toEqual(expected);
  });

  it('should render a square for each hour of the week', () => {
    const actual = container.select('.box').nodes().length;
    expect(actual).toEqual(24 * 7);
  });

  it('should create a container and a chart groups', () => {
    const numContainerGroups = container.select('g.container-group').nodes()
      .length;
    const numChartGroups = container.select('g.chart-group').nodes().length;
    expect(numContainerGroups).toEqual(1);
    expect(numChartGroups).toEqual(1);
  });
});
