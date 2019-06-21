import * as d3 from 'd3';

import {
  IBarChartProperties,
  IMargin,
  ISankeyDiagramProperties,
} from './types';

import { Selection } from 'd3';
import s from 'd3-sankey';

export default class SankeyDiagram {
  width: number;
  height: number;
  margin: IMargin;
  xScale;
  yScale;
  bars: Selection<any, any, any, any>;
  numTicks: number;
  data: Array<{ label: string; value: number }>;
  dataUnit: string;
  order: boolean;
  axisLabel: string;
  duration: number;
  delay: number;
  dataFormat: (value: number) => string;
  private chartWidth: number;
  private chartHeight: number;
  private readonly fontSize: number = 12;
  private svg: Selection<SVGSVGElement, {}, HTMLElement, any>;
  private initialised: boolean = false;

  constructor(properties: ISankeyDiagramProperties) {
    this.width = properties.width;
    this.height = properties.height;
    this.margin = properties.margin;
    this.data = properties.data;
    this.dataUnit = properties.dataUnit || '';
    this.dataFormat = (a) => `${a}`;
    if (properties.dataFormat) {
      this.dataFormat = properties.dataFormat;
    }
    this.chartWidth = this.width - this.margin.left - this.margin.right;
    this.chartHeight = this.height - this.margin.top - this.margin.bottom;
    this.numTicks = properties.numTicks || 5;
    this.order = properties.order === undefined ? true : properties.order;
    this.axisLabel = properties.axisLabel || '';
    this.duration = properties.duration / 4 || 1000;
    this.delay = this.duration / 2;
  }

  public make(selector: string): void {
    this.buildSVG(selector);
    this.generateLabels();
    this.generateBars();
    this.initialised = true;
  }

  public update(data: Array<{ label: string; value: number }>): void {
    this.data = data;
    d3.selectAll('*').transition();
    this.yScale.domain([0, Math.max(...this.data.map((a) => a.value))]);
    if (this.order) {
      const sortedData = this.data.slice().sort((a, b) => a.value - b.value);
      this.xScale.domain(sortedData.map((b) => b.label)).padding(0.1);
      this.svg
        .select('.x-label-group')
        .transition()
        .delay(this.delay + this.duration)
        .duration(2 * this.duration)
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

    const labelTexts = this.svg
      .select('.chart-group')
      .selectAll('.label')
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
      .classed('bar', true);

    const xPosition = (d) => this.xScale(d.label) + this.xScale.bandwidth() / 2;
    const b = valueTexts
      .enter()
      .append('text')
      .attr('x', (d) => xPosition(d))
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

    const c = labelTexts
      .enter()
      .append('text')
      .attr('x', (d) => xPosition(d))
      .attr('y', this.chartHeight - 50)
      .text((d) => d.label)
      // @ts-ignore
      .merge(labelTexts)
      .style('dominant-baseline', 'central')
      .style('font-size', () => `${1.5 * this.fontSize}px`)
      .attr('fill', 'grey')
      .classed('label', true);

    if (!this.initialised) {
      c.attr(
        'transform',
        (d) => `rotate(-90, ${xPosition(d)}, ${this.chartHeight - 50})`,
      );
    }

    a.transition()
      .duration(this.duration)
      .attr('y', (d) => this.yScale(d.value))
      .attr('height', (d) => this.chartHeight - this.yScale(d.value))
      .transition()
      .delay(this.delay)
      .duration(2 * this.duration)
      .attr('x', (d) => this.xScale(d.label));

    b.transition()
      .delay(this.delay + this.duration)
      .duration(2 * this.duration)
      .attr('x', (d) => xPosition(d))
      .text((d) => this.dataFormat(d.value));

    c.transition()
      .delay(this.delay + this.duration)
      .duration(2 * this.duration)
      .attr('x', (d) => xPosition(d))
      .attr(
        'transform',
        (d) => `rotate(-90, ${xPosition(d)}, ${this.chartHeight - 50})`,
      )
      .text((d) => d.label);

    bars.exit().remove();
    valueTexts.exit().remove();
    labelTexts.exit().remove();
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
      .attr(
        'transform',
        `translate(${10}, ${this.chartHeight / 2}) rotate(-90)`,
      );
  }

  private sankey() {
    const sankey = s
      .sankey()
      .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 5], [this.width - 1, this.height - 5]]);
    return ({ nodes, links }) =>
      sankey({
        nodes: nodes.map((d) => Object.assign({}, d)),
        links: links.map((d) => Object.assign({}, d)),
      });
  }

  private format() {
    const f = d3.format(',.0f');
    return (d) => `${f(d)} TWh`;
  }

  private color() {
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    return (name) => color(name.replace(/ .*/, ''));
  }
}
