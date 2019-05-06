import * as d3 from 'd3';
import { Selection } from 'd3';

export default function heatmap(): (Selection) => void {
  const width = 600;
  const height = 400;
  const margins = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  let svg;
  let chartWith;
  let chartHeight;

  return (selection: Selection<any, any, any, any>) => {
    selection.each(function(data: object) {
      chartWith = width - margins.left - margins.right;
      chartHeight = height - margins.top - margins.bottom;

      if (!svg) {
        svg = d3
          .select(this)
          .append('svg')
          .classed('heatmap', true);
      }
      svg.attr('width', width).attr('height', height);
    });
  };
}
