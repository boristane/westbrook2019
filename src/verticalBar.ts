import * as d3 from 'd3';
import { Selection, ScaleLinear } from 'd3';
import { HeatmapProperties, Margin, BarChartProperties } from './types';
import Tooltip from './tooltip';

export default class VerticalBarChart {
  width: number;
  height: number;
  margin: Margin;
  animate: boolean;
  xScale;
  yScale;
  bars: Selection<any, any, any, any>;
  numTicks: number;
  data: { label: string; value: number }[];
  barWidth: number;
  dataUnit: string;
  order: boolean;
  dataFormat: (value: number) => string;
  private chartWidth: number;
  private chartHeight: number;
  private readonly fontSize: number = 12;
  color: string;
  private svg: Selection<SVGSVGElement, {}, HTMLElement, any>;
  private tooltip: Tooltip;

  constructor(properties: BarChartProperties) {
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

  private handleMouseOver(
    d: { x: number; y: number; value: number },
    index: number,
    boxes: Selection<any, any, any, any>,
  ) {
    // const x = d.x * this.boxSize + this.svg.node().getBoundingClientRect().left;
    // const y = d.y * this.boxSize + this.svg.node().getBoundingClientRect().top;
    // this.tooltip.show(this.transformForTooltip(d), x, y);

    const box = boxes[index];
    d3.select(box)
      .transition()
      .ease(d3.easeElastic)
      .duration(300)
      .attr('width', parseFloat(box.getAttribute('width')) - 1)
      .attr('x', parseFloat(box.getAttribute('x')) + 0.5)
      .attr('height', parseFloat(box.getAttribute('height')) - 1)
      .attr('y', parseFloat(box.getAttribute('y')) + 0.5);
  }

  private handleMouseOut(
    d: { x: number; y: number; value: number },
    index: number,
    boxes: Selection<any, any, any, any>,
  ) {
    this.tooltip.hide();

    const box = boxes[index];
    d3.select(box)
      .transition()
      .ease(d3.easeElastic)
      .duration(300)
      .attr('width', parseFloat(box.getAttribute('width')) + 1)
      .attr('x', parseFloat(box.getAttribute('x')) - 0.5)
      .attr('height', parseFloat(box.getAttribute('height')) + 1)
      .attr('y', parseFloat(box.getAttribute('y')) - 0.5);
  }

  // private transformForTooltip(data: { x: number; y: number; value: number }) {
  //   return `
  //     <p>
  //       <span>(${this.yLabels[data.y]}, ${
  //     this.xLabels[data.x]
  //   })</span> <span style="font-weight: bold">${this.dataFormat(data.value)} ${
  //     this.dataUnit
  //   }</span>
  //       </p>
  //   `;
  // }

  private generateBars(): void {
    const boxRadius = this.xScale.bandwidth() / 100;
    let bars = this.svg
      .select('.chart-group')
      .selectAll('.bar')
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

    if (this.animate) {
      const duration = 1000;
      a.transition()
        .duration(duration)
        .attr('y', (d) => this.yScale(d.value))
        .attr('x', (d) => this.xScale(d.label))
        .attr('height', (d) => this.chartHeight - this.yScale(d.value));
    }

    bars.exit().remove();
    this.bars = bars;
  }

  private generateLabels() {
    this.xScale = d3
      .scaleBand()
      .range([0, this.chartWidth - 20])
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
      .range([this.chartHeight, 0])
      .domain([0, Math.max(...this.data.map((a) => a.value))]);

    this.svg
      .select('.y-label-group')
      .append('g')
      .transition()
      .call(d3.axisLeft(this.yScale).ticks(this.numTicks, 's'));
  }

  public make(selector: string): void {
    this.buildSVG(selector);
    this.tooltip = new Tooltip(selector);
    this.generateLabels();
    this.generateBars();
  }

  public update(data: { label: string; value: number }[]): void {
    this.data = data;

    this.yScale.domain([0, Math.max(...this.data.map((a) => a.value))]);
    if (this.order) {
      const a = this.data.slice().sort((a, b) => a.value - b.value);
      this.xScale.domain(a.map((b) => b.label)).padding(0.1);
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
      .call(d3.axisLeft(this.yScale).ticks(this.numTicks, 's'));

    this.generateBars();
  }
}
