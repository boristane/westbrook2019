import * as d3 from 'd3';
import heatmap from '../src/heatmap';
import data from '../test/fixtures/data.json';

let container: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
let heatmapChart;

heatmapChart = heatmap();
container = d3.select('.container');
container.datum(data).call(heatmapChart);
