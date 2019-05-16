import * as d3 from 'd3';

import { IBarChartProperties, ILineChartProperties, IMargin } from './types';

import { Selection } from 'd3';
import Tooltip from './tooltip';

export default class LineChart {
  width: number;
  height: number;
  margin: IMargin;
  xScale;
  yScale;
  line: Selection<any, any, any, any>;
  numTicks: number;
  data: Array<{ x: number; y: number }>;
  barWidth: number;
  dataUnit: string;
  color: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataFormat: (value: number) => string;
  private chartWidth: number;
  private chartHeight: number;
  private readonly fontSize: number = 12;
  private svg: Selection<SVGSVGElement, {}, HTMLElement, any>;
  private tooltip: Tooltip;

  constructor(properties: ILineChartProperties) {
    this.width = properties.width;
    this.height = properties.height;
    this.margin = properties.margin;
    this.data = properties.data;
    this.dataUnit = properties.dataUnit || '';
    this.dataFormat = (a) => `${a}`;
    this.barWidth = 80;
    if (properties.dataFormat) {
      this.dataFormat = properties.dataFormat;
    }
    this.chartWidth = this.width - this.margin.left - this.margin.right;
    this.chartHeight = this.height - this.margin.top - this.margin.bottom;
    this.color = properties.color || '#C0FFE7';
    this.numTicks = properties.numTicks || 5;
    this.xAxisLabel = properties.xAxisLabel || '';
    this.yAxisLabel = properties.yAxisLabel || '';
  }

  public make(selector: string): void {
    this.data
      .sort((a, b) => a.x - b.x);
    this.buildSVG(selector);
    this.tooltip = new Tooltip(selector);
    this.generateLabels();
    this.generateLine();
  }

  public update(data: { x: number; y: number }): void {
    this.data
      .sort((a, b) => a.x - b.x);
    const currentxMax = Math.max(...this.data.map((a) => a.x));
    const curentxMin = Math.min(...this.data.map((a) => a.x));
    const delatX = data.x - currentxMax;
    while (this.data[0].x < curentxMin + delatX) {
      this.data.shift();

    }
    this.data.push(data);

    this.yScale.domain([Math.min(...this.data.map((a) => a.y)), Math.max(...this.data.map((a) => a.y))]);
    this.xScale.domain([delatX, Math.max(...this.data.map((a) => a.x))]);

    this.svg
      .select('.x-label-group')
      .attr('transform', `translate(0, ${this.chartHeight})`)
      .transition()
      // @ts-ignore
      .call(d3.axisBottom(this.xScale));
    this.svg
      .select('.y-label-group')
      .transition()
      // @ts-ignore
      .call(d3.axisLeft(this.yScale).ticks(this.numTicks));

    this.generateLine();
  }

  private generateContainerGroups(): void {
    const container = this.svg
      .append('g')
      .classed('container-group', true)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    container
      .append('g')
      .classed('chart-group', true)
      .attr('transform', `translate(${4 * this.fontSize})`);
    container
      .select('.chart-group')
      .append('g')
      .classed('metadata-group', true);
    container
      .select('.chart-group')
      .append('g')
      .classed('x-label-group', true);
    container
      .select('.chart-group')
      .append('g')
      .classed('y-label-group', true);
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
  }

  private handleMouseOver(d: { label: string; value: number }) {
    const x = d3.event.pageX;
    const y = d3.event.pageY;
    this.tooltip.show(this.transformForTooltip(d), x, y);
  }

  private handleMouseOut() {
    this.tooltip.hide();
  }

  private transformForTooltip(data: { label: string; value: number }) {
    return `
      <p>
        <span>${data.label
      }</span> <span style="font-weight: bold">${this.dataFormat(data.value)} ${
      this.dataUnit
      }</span>
        </p>
    `;
  }

  private generateLine(): void {
    const l = d3.line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.y))
      .curve(d3.curveBasis);
    const line = this.svg.select('.chart-group').append('g').append('path').datum(this.data);

    // Add the line
    const path = line
      .enter()
      .attr('class', 'line')
      // ts-ignore
      .merge(line)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      // .attr('stroke', this.color)
      .attr('d', l);


    const duration = 1000;
    path.transition()
      .duration(duration)
      .attr('d', l);


    line.exit().remove();
    this.line = line;
  }

  private generateLabels() {
    const xData = this.data.map((b) => b.x);
    const yData = this.data.map((b) => b.y);
    this.xScale = d3
      .scaleLinear()
      .range([0, this.chartWidth - 20])
      .domain([Math.min(...xData), Math.max(...xData)]);

    this.svg
      .select('.x-label-group')
      .append('g')
      .attr('transform', `translate(0, ${this.chartHeight})`)
      .transition()
      .call(d3.axisBottom(this.xScale));

    this.yScale = d3
      .scaleLinear()
      .range([this.chartHeight, 0])
      .domain([Math.min(...yData), Math.max(...yData)]);

    this.svg
      .select('.y-label-group')
      .append('g')
      .transition()
      .call(d3.axisLeft(this.yScale).ticks(this.numTicks));

    this.svg
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(this.yAxisLabel)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central')
      .style('font-size', () => `${this.fontSize}px`)
      .attr('transform', `translate(${10}, ${this.chartHeight / 2}) rotate(-90)`);

    this.svg
      .select('.chart-group')
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(this.xAxisLabel)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central')
      .style('font-size', () => `${this.fontSize}px`)
      .attr('transform', `translate(${this.chartWidth / 2}, ${this.height + this.margin.bottom / 2})`);
  }
}
