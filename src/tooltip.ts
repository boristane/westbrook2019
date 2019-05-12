import * as d3 from 'd3';
import { Selection } from 'd3';

export default class Tooltip {
  container: Selection<any, any, any, any>;
  constructor(selector: string) {
    this.container = d3
      .select(selector)
      .append('div')
      .classed('tooltip', true)
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('left', '-10000000px')
      .style('top', '-10000000px');
  }
  public show(html: string, x: number, y: number): void {
    const duration = 500;
    const tip = this.container.selectAll('.tip').data([html]);
    const event = d3.event;
    setTimeout(() => {
      tip
        .enter()
        .append('div')
        // @ts-ignore
        .merge(tip)
        .html((d) => d)
        .classed('tip', true);

      this.container
        .transition()
        .duration(duration)
        .style('opacity', 1)
        .style('left', x + 'px')
        .style('top', y - 30 + 'px');

      tip.exit().remove();
    }, duration);
  }

  public hide(): void {
    const duration = 500;
    console.log('hidin');
    this.container
      .transition()
      .duration(duration)
      .style('opacity', 0);
  }
}
