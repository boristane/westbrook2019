import * as d3 from 'd3';
import Heatmap from '../src/heatmap';
import { Margin, HeatmapProperties } from '../src/types';
import data from '../test/fixtures/data.json';

let container: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

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
