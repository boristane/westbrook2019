import * as d3 from 'd3';
import { Selection, ScaleLinear } from 'd3';
import { HeatmapProperties, Margin } from './types';

export default class Heatmap {
  width: number;
  height: number;
  margin: Margin;
  boxSize: number;
  private chartWith: number;
  private chartHeight: number;
  private readonly colorSchema: string[] = [
    '#C0FFE7',
    '#95F6D7',
    '#6AEDC7',
    '#59C3A3',
    '#479980',
  ];
  private svg: Selection<SVGSVGElement, {}, HTMLElement, any>;
  private colorScale: ScaleLinear<string, string>;

  constructor(properties: HeatmapProperties) {
    this.width = properties.width;
    this.height = properties.height;
    this.margin = properties.margin;
    this.boxSize = properties.boxSize;
    this.chartWith = this.width - this.margin.left - this.margin.right;
    this.chartHeight = this.height - this.margin.top - this.margin.bottom;
  }

  private generateContainerGroups(): void {
    const container = this.svg
      .append('g')
      .classed('container-group', true)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    container.append('g').classed('chart-group', true);
    container.append('g').classed('metadata-group', true);
  }

  private generateColorScale(values: number[]): ScaleLinear<string, string> {
    const colorScale = d3
      .scaleLinear<string>()
      .range([
        this.colorSchema[0],
        this.colorSchema[this.colorSchema.length - 1],
      ])
      .domain(d3.extent(values, (value) => value))
      .interpolate(d3.interpolateHcl);

    return colorScale;
  }

  private buildSVG(selector: string): void {
    if (!this.svg) {
      this.svg = d3
        .select(selector)
        .append('svg')
        .classed('heatmap', true);
      this.generateContainerGroups();
    }
    this.svg
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
  }

  private generateBoxes(data: number[][]): void {
    const boxes = this.svg
      .select('.chart-group')
      .selectAll('.box')
      .data(data);

    boxes
      .enter()
      .append('rect')
      .attr('width', this.boxSize)
      .attr('height', this.boxSize)
      .attr('y', (d) => d[0] * this.boxSize)
      .attr('x', (d) => d[1] * this.boxSize)
      .style('fill', (d) => this.colorScale(d[2]))
      .classed('box', true);

    boxes.exit().remove();
  }

  public make(selector: string, data): void {
    const daysOfWeek = data.map((elt) => elt[0]);
    const hoursOfDay = data.map((elt) => elt[1]);
    const values = data.map((elt) => elt[2]);
    this.colorScale = this.generateColorScale(values);
    this.buildSVG(selector);
    this.generateBoxes(data);
  }
}
