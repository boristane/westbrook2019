import * as d3 from 'd3';

import { IBarChartProperties, IMargin } from './types';

import { Selection } from 'd3';
import Tooltip from './tooltip';

export default class VerticalBarChart {
  width: number;
  height: number;
  margin: IMargin;
  animate: boolean;
  xScale;
  yScale;
  bars: Selection<any, any, any, any>;
  numTicks: number;
  data: Array<{ label: string; value: number }>;
  barWidth: number;
  dataUnit: string;
  order: boolean;
  color: string;
  axisLabel: string;
  dataFormat: (value: number) => string;
  private chartWidth: number;
  private chartHeight: number;
  private readonly fontSize: number = 12;
  private svg: Selection<SVGSVGElement, {}, HTMLElement, any>;
  private tooltip: Tooltip;

  constructor(properties: IBarChartProperties) {
    this.width = properties.width;
    this.height = properties.height;
    this.margin = properties.margin;
    this.animate = properties.animate || true;
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
    this.order = properties.order === undefined ? true : properties.order;
    this.axisLabel = properties.axisLabel || '';
  }

  public make(selector: string): void {
    this.buildSVG(selector);
    this.tooltip = new Tooltip(selector);
    this.generateLabels();
    this.generateBars();
  }

  public update(data: Array<{ label: string; value: number }>): void {
    this.data = data;
    this.yScale.domain([0, Math.max(...this.data.map((a) => a.value))]);
    if (this.order) {
      const sortedData = this.data
        .slice()
        .sort((a, b) => a.value - b.value);
      this.xScale.domain(sortedData.map((b) => b.label)).padding(0.1);
      this.svg
        .select('.x-label-group')
        .transition()
        // @ts-ignore
        .call(d3.axisBottom(this.xScale));
    }

    this.svg
      .select('.y-label-group')
      .transition()
      // @ts-ignore
      .call(d3.axisLeft(this.yScale).ticks(this.numTicks));

    this.generateBars();
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

  private generateBars(): void {
    const boxRadius = this.xScale.bandwidth() / 100;
    const bars = this.svg
      .select('.chart-group')
      .selectAll('.bar')
      .data(this.data);

    const valueTexts = this.svg
      .select('.chart-group')
      .selectAll('.value')
      .data(this.data);

    const a = bars
      .enter()
      .append('rect')
      .attr('width', this.xScale.bandwidth())
      .attr('x', (d) => this.xScale(d.label))
      .attr('y', (d) => this.yScale(d.value))
      .attr('height', (d) => this.chartHeight - this.yScale(d.value))
      .attr('rx', boxRadius)
      // @ts-ignore
      .merge(bars)
      .style('fill', this.color)
      .classed('bar', true)
      .on('mouseover', this.handleMouseOver.bind(this))
      .on('mouseout', this.handleMouseOut.bind(this));

    const b = valueTexts.enter()
      .append('text')
      .attr('x', (d) => this.xScale(d.label) + this.xScale.bandwidth() / 2)
      .attr('y', this.chartHeight - 20)
      .text((d) => this.dataFormat(d.value))
      // @ts-ignore
      .merge(valueTexts)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central')
      .style('font-size', () => `${1.5 * this.fontSize}px`)
      .attr('fill', 'grey')
      .style('font-weight', 'bold')
      .classed('value', true);

    if (this.animate) {
      const duration = 1000;
      a.transition()
        .duration(duration)
        .attr('y', (d) => this.yScale(d.value))
        .attr('x', (d) => this.xScale(d.label))
        .attr('height', (d) => this.chartHeight - this.yScale(d.value));

      b.transition()
        .duration(duration)
        .attr('x', (d) => this.xScale(d.label) + this.xScale.bandwidth() / 2)
        .text((d, i) => this.dataFormat(d.value));
    }

    bars.exit().remove();
    valueTexts.exit().remove();
    this.bars = bars;
  }

  private generateLabels() {
    this.xScale = d3
      .scaleBand()
      .rangeRound([0, this.chartWidth - 20])
      .domain(this.data.map((b) => b.label))
      .padding(0.1);

    this.svg
      .select('.x-label-group')
      .append('g')
      .attr('transform', `translate(0, ${this.chartHeight})`)
      .transition()
      .call(d3.axisBottom(this.xScale));

    this.yScale = d3
      .scaleLinear()
      .rangeRound([this.chartHeight, 0])
      .domain([0, Math.max(...this.data.map((a) => a.value))]);

    this.svg
      .select('.y-label-group')
      .append('g')
      .transition()
      .call(d3.axisLeft(this.yScale).ticks(this.numTicks));

    this.svg
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text(this.axisLabel)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'central')
      .style('font-size', () => `${this.fontSize}px`)
      .attr('transform', `translate(${10}, ${this.chartHeight / 2}) rotate(-90)`);
  }
}
