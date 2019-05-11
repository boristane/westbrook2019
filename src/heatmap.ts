import * as d3 from 'd3';
import { Selection, ScaleLinear } from 'd3';
import { HeatmapProperties, Margin } from './types';

export default class Heatmap {
  width: number;
  height: number;
  margin: Margin;
  boxSize: number;
  xLabels: string[];
  yLabels: string[];
  animate: boolean;
  data: number[][];
  private chartWith: number;
  private chartHeight: number;
  private readonly fontSize: number = 12;
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
    this.xLabels = properties.xLabels;
    this.yLabels = properties.yLabels;
    this.animate = properties.animate;
    this.data = properties.data;
    this.chartWith = this.width - this.margin.left - this.margin.right;
    this.chartHeight = this.height - this.margin.top - this.margin.bottom;
  }

  private generateContainerGroups(): void {
    const container = this.svg
      .append('g')
      .classed('container-group', true)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    container
      .append('g')
      .classed('chart-group', true)
      .attr('transform', `translate(${2 * this.fontSize})`);
    container.append('g').classed('metadata-group', true);
    container.append('g').classed('x-label-group', true);
    container.append('g').classed('y-label-group', true);
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

  private generateBoxes(): void {
    let boxes = this.svg
      .select('.chart-group')
      .selectAll('.box')
      .data(this.data);

    const a = boxes
      .enter()
      .append('rect')
      .attr('width', this.boxSize)
      .attr('height', this.boxSize)
      .attr('y', (d) => d[0] * this.boxSize)
      .attr('x', (d) => d[1] * this.boxSize)
      // @ts-ignore
      .merge(boxes)
      .style('stroke', '#FFFFFF')
      .style('stroke-width', 2)
      .style('fill', 'gray')
      .classed('box', true);

    if (this.animate) {
      const duration = 2000;
      a.style('opacity', 0.2)
        .transition()
        .duration(duration)
        .style('fill', (d) => this.colorScale(d[2]))
        .style('opacity', 1);
    } else {
      a.style('fill', (d) => this.colorScale(d[2]));
    }
    boxes.exit().remove();
  }

  private generateLabels() {
    const xLabelsGroup = this.svg.select('.x-label-group');
    const xLabelElts = this.svg
      .select('.x-label-group')
      .selectAll('.x-label')
      .data(this.xLabels);
    xLabelElts
      .enter()
      .append('text')
      .text((d) => d)
      .attr('y', 0)
      .attr('x', (d, i) => i * this.boxSize)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central')
      .style('font-size', () => `${this.fontSize}px`)
      .attr('class', 'x-label');
    xLabelsGroup.attr(
      'transform',
      `translate(${this.boxSize / 2 + 2 * this.fontSize}, ${this.chartHeight -
        this.fontSize / 2})`,
    );

    const yLabelsGroup = this.svg.select('.y-label-group');
    const yLabelElts = this.svg
      .select('.y-label-group')
      .selectAll('.y-label')
      .data(this.yLabels);
    yLabelElts
      .enter()
      .append('text')
      .text((d) => d)
      .attr('y', (d, i) => this.boxSize * i)
      .attr('x', 0)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central')
      .style('font-size', () => `${this.fontSize}px`)
      .attr('class', 'y-label');
    yLabelsGroup.attr(
      'transform',
      `translate(${this.fontSize / 2}, ${this.boxSize / 2})`,
    );
  }

  public make(selector: string): void {
    const values = this.data.map((elt) => elt[2]);
    this.colorScale = this.generateColorScale(values);
    this.buildSVG(selector);
    this.generateBoxes();
    this.generateLabels();
  }

  public update(data: number[][]): void {
    this.data = data;
    this.generateBoxes();
  }
}
