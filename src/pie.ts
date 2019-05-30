import * as d3 from 'd3';

import { IMargin, IPieProperties } from './types';

import { Selection } from 'd3';

export default class Pie {
  width: number;
  height: number;
  margin: IMargin;
  slices: Selection<any, any, any, any>;
  data: Array<{ label: string; value: number }>;
  dataUnit: string;
  duration: number;
  dataFormat: (value: number) => string;
  innerRatio: number;
  outerRatio: number;
  private chartWidth: number;
  private chartHeight: number;
  private readonly fontSize: number = 12;
  private svg: Selection<SVGSVGElement, {}, HTMLElement, any>;
  private chart: Selection<any, any, any, any>;

  constructor(properties: IPieProperties) {
    this.width = properties.width;
    this.height = properties.height;
    this.margin = properties.margin;
    this.data = properties.data;
    this.dataUnit = properties.dataUnit || '';
    this.dataFormat = (a) => `${a}`;
    this.innerRatio = properties.innerRatio || 0.75;
    this.outerRatio = properties.outerRatio || 0.95;
    if (properties.dataFormat) {
      this.dataFormat = properties.dataFormat;
    }
    this.chartWidth = this.width - this.margin.left - this.margin.right;
    this.chartHeight = this.height - this.margin.top - this.margin.bottom;
    this.duration = 500;
  }

  public make(selector: string): void {
    this.buildSVG(selector);
    this.generateSlices();
  }

  public update(data: Array<{ label: string; value: number }>): void {
    this.data = data;
    this.generateSlices();
  }

  private generateContainerGroups(): void {
    const container = this.svg
      .append('g')
      .classed('container-group', true)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    container
      .append('g')
      .classed('chart-group', true)
    container
      .select('.chart-group')
      .append('g')
      .classed('metadata-group', true);
  }

  private buildSVG(selector: string): void {
    if (!this.svg) {
      this.svg = d3
        .select(selector)
        .append('svg')
        .classed('vertical-bar-chart', true);
      this.generateContainerGroups();
    }
    this.svg
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
    if (!this.chart) {
      this.chart = this.svg.select('.chart-group').append('g')
        .classed('pie-chart', true)
        .attr('transform', `translate(${this.chartWidth / 2}, ${this.chartHeight / 2})`);
    }
  }

  private generateSlices(): void {
    const radius = Math.min(this.chartWidth, this.chartHeight) / 2;
    const pie = d3.pie<{ value: number, label: string }>()
      .padAngle((d) => 0.005)
      .sortValues((a, b) => b - a)
      .value((d) => d.value);
    const outerRadius = radius * this.outerRatio;
    const innerRadius = radius * this.innerRatio;

    const path = d3.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius)
      .cornerRadius((d) => 5);

    const slices = this.chart.selectAll('.slice')
      .data(pie(this.data));

    const arc = slices
      .enter().append('path')
      .attr('class', 'slice')
      // @ts-ignore
      .merge(slices);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(this.data.map((d) => d.label))
      .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), this.data.length).reverse());

    arc
      .attr('fill', (d, i) => colorScale(this.data[i].label))
      .transition()
      .duration(this.duration)
      // @ts-ignore
      .attr('d', path);

    const texts = this.chart.selectAll('.text')
      .data(pie(this.data));

    const label = texts.enter()
      .append('text')
      .classed('text', true)
      // @ts-ignore
      .merge(texts)
      .text((d) => `${d.data.label} - ${this.dataFormat(d.data.value)} ${this.dataUnit}`);

    label
      .classed('value', true)
      .transition()
      .duration(this.duration)
      .attr('transform', (d) => `translate(${path.centroid(d)})`)
      .style('text-anchor', (d) => 'middle')
      .style('dominant-baseline', 'central')
      .style('font-size', () => `${1.5 * this.fontSize}px`)
      .attr('fill', 'black')
      .style('font-weight', 'bold');

    texts.exit().remove();
    slices.exit().remove();
    this.slices = slices;
  }
}
