import * as d3 from 'd3';

import { Selection } from 'd3';

export default class Tooltip {
  container: Selection<any, any, any, any>;
  private hideTimeout;
  constructor(selector: string) {
    this.container = d3
      .select(selector)
      .append('div')
      .classed('tooltip', true)
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('left', '-10px')
      .style('top', '-10px');
  }
  public show(html: string, x: number, y: number): void {
    clearTimeout(this.hideTimeout);
    const duration = 500;
    const tip = this.container.selectAll('.tip').data([html]);
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

    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 4 * duration);
  }

  public hide(): void {
    const duration = 500;
    this.container
      .transition()
      .duration(duration)
      .style('opacity', 0);
  }
}
