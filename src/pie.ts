import * as d3 from 'd3';

import { IBarChartProperties, IMargin } from './types';
import { Selection, selection } from 'd3';

export default class Pie {
  width: number;
  height: number;
  margin: IMargin;
  slices: Selection<any, any, any, any>;
  data: Array<{ label: string; value: number }>;
  dataUnit: string;
  duration: number;
  dataFormat: (value: number) => string;
  private chartWidth: number;
  private chartHeight: number;
  private readonly fontSize: number = 12;
  private svg: Selection<SVGSVGElement, {}, HTMLElement, any>;
  private chart: Selection<any, any, any, any>;

  constructor(properties: IBarChartProperties) {
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
    this.duration = properties.duration / 4 || 1000;
  }

  public make(selector: string): void {
    this.buildSVG(selector);
    // this.generateLabels();
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
    const pie = d3.pie<number>()
      .padAngle((d) => 0.01)
      .sortValues((a, b) => b - a)
      .value((d) => d);
    const values = this.data.map((elt) => elt.value);

    const path = d3.arc()
      .outerRadius(radius * 0.9)
      .innerRadius(radius * 0.7);

    const slices = this.chart.selectAll('.slice')
      .data(pie(values));

    const arc = slices
      .enter().append('path')
      .attr('class', 'slice')
      // @ts-ignore
      .merge(slices);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(this.data.map((d) => d.label))
      .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), this.data.length).reverse());

    const a = arc
      .attr('fill', (d, i) => colorScale(this.data[i].label))
      .transition()
      .duration(this.duration)
      // @ts-ignore
      .attr('d', path);

    slices.exit().remove();
    this.slices = slices;
  }

  private generateLabels() {

  }
}
