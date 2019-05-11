import * as d3 from 'd3';
import { Selection } from 'd3';

export default class Tooltip {
  container: Selection<any, any, any, any>;
  constructor(selector: string) {
    this.container = d3
      .select(selector)
      .append('div')
      .classed('tooltip', true)
      .style('position', 'absolute');
  }
  public show(data: number[]): void {
    const duration = 500;
    const tip = this.container.selectAll('.tip').data([data]);
    const event = d3.event;
    setTimeout(() => {
      tip
        .enter()
        .append('text')
        // @ts-ignore
        .merge(tip)
        .text((d) => d[2])
        .classed('tip', true)
        .transition();

      this.container
        .transition()
        .duration(duration)
        .style('opacity', 1)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px');

      tip.exit().remove();
    }, duration);
  }

  public hide(): void {
    const duration = 500;
    this.container
      .transition()
      .duration(duration)
      .style('opacity', 0);
  }
}
