import * as d3 from 'd3';

import { HeatmapProperties, Margin } from './types';
import { ScaleLinear, Selection } from 'd3';

import Tooltip from './tooltip';

export default class Heatmap {
  width: number;
  height: number;
  margin: Margin;
  boxSize: number;
  xLabels: string[];
  yLabels: string[];
  animate: boolean;
  strokeWidth: number;
  data: Array<{ x: number; y: number; value: number }>;
  dataUnit: string;
  dataFormat: (value: number) => string;
  private chartWith: number;
  private chartHeight: number;
  private readonly fontSize: number = 12;
  private colorSchema: string[];
  private svg: Selection<SVGSVGElement, {}, HTMLElement, any>;
  private colorScale: ScaleLinear<string, string>;
  private tooltip: Tooltip;
  private boxes;

  constructor(properties: HeatmapProperties) {
    this.width = properties.width;
    this.height = properties.height;
    this.margin = properties.margin;
    this.xLabels = properties.xLabels;
    this.yLabels = properties.yLabels;
    this.animate = properties.animate || true;
    this.data = properties.data;
    this.dataUnit = properties.dataUnit || '';
    this.dataFormat = (a) => `${a}`;
    if (properties.dataFormat) {
      this.dataFormat = properties.dataFormat;
    }
    this.chartWith = this.width - this.margin.left - this.margin.right;
    this.chartHeight = this.height - this.margin.top - this.margin.bottom;
    this.strokeWidth = properties.strokeWidth || 2;
    this.colorSchema = properties.colorSchema || ['#C0FFE7', '#479980'];
    const numLines = Math.max(...this.data.map((elt) => elt.x));
    const numColumns = Math.max(...this.data.map((elt) => elt.y));
    const boxSizeToFitWidth = Math.floor(
      this.chartWith / numLines - 2 * this.strokeWidth,
    );
    const boxSizeToFitHeight = Math.floor(
      this.chartHeight / numColumns - 2 * this.strokeWidth,
    );
    this.boxSize = Math.min(boxSizeToFitWidth, boxSizeToFitHeight);
  }

  public make(selector: string): void {
    const values = this.data.map((elt) => elt.value);
    this.colorScale = this.generateColorScale(values);
    this.buildSVG(selector);
    this.tooltip = new Tooltip(selector);
    this.generateBoxes();
    this.generateLabels();
  }

  public update(data: Array<{ x: number; y: number; value: number }>): void {
    this.data = data;
    const values = this.data.map((elt) => elt.value);
    this.colorScale = this.generateColorScale(values);
    this.generateBoxes();
  }

  public getBoxes() {
    return this.boxes;
  }

  private generateContainerGroups(): void {
    const maxYLabelLength = Math.max(
      ...this.yLabels.map((label) => label.length),
    );
    const container = this.svg
      .append('g')
      .classed('container-group', true)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    container
      .append('g')
      .classed('chart-group', true)
      .attr(
        'transform',
        `translate(${(maxYLabelLength * this.fontSize * 4) / 5})`,
      );
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

  private handleMouseOver(
    d: { x: number; y: number; value: number },
    index: number,
    boxes: Selection<any, any, any, any>,
  ) {
    const x = d.x * this.boxSize + this.svg.node().getBoundingClientRect().left;
    const y = d.y * this.boxSize + this.svg.node().getBoundingClientRect().top;
    this.tooltip.show(this.transformForTooltip(d), x, y);

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

  private generateBoxes(): void {
    const boxRadius = this.boxSize / 8;
    const boxes = this.svg
      .select('.chart-group')
      .selectAll('.box')
      .data(this.data);

    const a = boxes
      .enter()
      .append('rect')
      .attr('width', this.boxSize)
      .attr('height', this.boxSize)
      .attr('y', (d) => d.y * this.boxSize)
      .attr('x', (d) => d.x * this.boxSize)
      .attr('rx', boxRadius)
      // @ts-ignore
      .merge(boxes)
      .style('stroke', '#FFFFFF')
      .style('stroke-width', this.strokeWidth)
      .style('fill', 'gray')
      .classed('box', true)
      .on('mouseover', this.handleMouseOver.bind(this))
      .on('mouseout', this.handleMouseOut.bind(this));

    if (this.animate) {
      const duration = 2000;
      a.style('opacity', 0.2)
        .transition()
        .duration(duration)
        .style('fill', (d) => this.colorScale(d.value))
        .style('opacity', 1);
    } else {
      a.style('fill', (d) => this.colorScale(d.value));
    }
    boxes.exit().remove();
    this.boxes = boxes;
  }

  private transformForTooltip(data: { x: number; y: number; value: number }) {
    return `
      <p>
        <span>(${this.yLabels[data.y]}, ${
      this.xLabels[data.x]
      })</span> <span style="font-weight: bold">${this.dataFormat(data.value)} ${
      this.dataUnit
      }</span>
        </p>
    `;
  }

  private generateLabels() {
    const xLabelsGroup = this.svg.select('.x-label-group');
    const maxYLabelLength = Math.max(
      ...this.yLabels.map((label) => label.length),
    );
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
    const numLines = Math.max(...this.data.map((elt) => elt.y));
    const yOffset = this.boxSize * (numLines + 1.5);
    xLabelsGroup.attr(
      'transform',
      `translate(${this.boxSize / 2 +
      (maxYLabelLength * this.fontSize * 4) / 5}, ${yOffset})`,
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
      .style('text-anchor', 'left')
      .style('dominant-baseline', 'central')
      .style('font-size', () => `${this.fontSize}px`)
      .attr('class', 'y-label');
    yLabelsGroup.attr('transform', `translate(0, ${this.boxSize / 2})`);
  }
}
