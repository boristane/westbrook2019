import * as d3 from 'd3';

import { ILineChartProperties, IMargin } from './types';

import { Selection } from 'd3';
import Tooltip from './tooltip';
import d3Legend from 'd3-svg-legend';

export default class LineChart {
  width: number;
  height: number;
  margin: IMargin;
  xScale;
  yScale;
  line: Selection<any, any, any, any>;
  numTicks: number;
  data: Array<{ label: string, data: Array<{ x: number; y: number }> }>;
  barWidth: number;
  dataUnit: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataFormat: (value: number) => string;
  private chartWidth: number;
  private chartHeight: number;
  private readonly fontSize: number = 12;
  private svg: Selection<SVGSVGElement, {}, HTMLElement, any>;
  private tooltip: Tooltip;
  private colorScale;

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
    this.numTicks = properties.numTicks || 5;
    this.xAxisLabel = properties.xAxisLabel || '';
    this.yAxisLabel = properties.yAxisLabel || '';
    this.colorScale = d3.scaleOrdinal<string>()
      .domain(this.data.map((d) => d.label))
      .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), this.data.length).reverse());
  }

  public make(selector: string): void {
    this.data.forEach((elt) => {
      elt.data
        .sort((a, b) => a.x - b.x);
    });
    this.buildSVG(selector);
    this.tooltip = new Tooltip(selector);
    this.generateLabels();
    this.generateLine();
    const labels = this.data.map((elt) => elt.label);
    this.generateLegend(labels);
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
        .classed('line-chart', true);
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
    for (const dataset of this.data) {
      const line = d3.line<{ x: number, y: number }>()
        .x((d) => this.xScale(d.x))
        .y((d) => this.yScale(d.y))
        .curve(d3.curveMonotoneX);
      const path = this.svg
        .select('.chart-group')
        .append('path')
        .datum(dataset.data);

      path
        .enter()
        .attr('class', 'line')
        .merge(path)
        .attr('fill', 'none')
        .attr('stroke', (d) => this.colorScale(dataset.label))
        .attr('stroke-width', 2)
        .attr('d', line);

      const points = this.svg
        .select('.chart-group')
        .append('g')
        .selectAll('.point')
        .data(dataset.data);

      points
        .enter()
        .append('circle')
        .attr('cx', (d) => this.xScale(d.x))
        .attr('cy', (d) => this.yScale(d.y))
        .attr('r', (d) => 5)
        .style('fill', (d) => this.colorScale(dataset.label))
        .classed('circle', true)
        .on('mouseover', this.handleMouseOver.bind(this))
        .on('mouseout', this.handleMouseOut.bind(this));

      path.exit().remove();
      this.line = path;
    }
  }

  private generateLabels() {
    const xData = this.data.map((b) => b.data.map((a) => a.x));
    const yData = this.data.map((b) => b.data.map((a) => a.y));
    function flatten(arr: any[]) {
      return [].concat.apply([], arr);
    }
    this.xScale = d3
      .scaleLinear()
      .range([0, this.chartWidth - 30])
      .domain([Math.min(...flatten(xData)), Math.max(...flatten(xData))]);

    this.svg
      .select('.x-label-group')
      .append('g')
      .attr('transform', `translate(0, ${this.chartHeight})`)
      .call(d3.axisBottom(this.xScale));

    this.yScale = d3
      .scaleLinear()
      .range([this.chartHeight, 0])
      .domain([Math.min(...flatten(yData)), Math.max(...flatten(yData)) * 1.1]);

    this.svg
      .select('.y-label-group')
      .append('g')
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

  private generateLegend(labels: string[]) {
    const colors = labels.map((label) => this.colorScale(label));
    const ordinal = d3.scaleOrdinal()
      .domain(labels)
      .range(colors);
    this.svg.append('g')
      .attr('class', 'chart-legend')
      .attr('transform', `translate(${4 * this.fontSize + this.margin.left + 20},${this.margin.top + 20})`);
    const legendOrdinal = d3Legend.legendColor()
      .shape('path', d3.symbol().type(d3.symbolSquare).size(400)())
      .shapePadding(3)
      .shapeWidth(30)
      .scale(ordinal);
    this.svg.select('.chart-legend')
      .call(legendOrdinal);
  }
}
