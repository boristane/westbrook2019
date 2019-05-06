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
});
