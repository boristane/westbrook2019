import * as d3 from 'd3';
import { Selection, ScaleLinear } from 'd3';

export default function heatmap(): (Selection) => void {
  const width = 600;
  const height = 400;
  const margins = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };
  const chartWith = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;
  const colorSchema = ['#C0FFE7', '#95F6D7', '#6AEDC7', '#59C3A3', '#479980'];
  const boxSize = 30;

  let svg: Selection<any, any, null, undefined>;
  let colorScale: ScaleLinear<string, string>;

  const generateContainerGroups = (
    svg: Selection<any, any, null, undefined>,
  ): Selection<any, any, null, undefined> => {
    const container = svg
      .append('g')
      .classed('container-group', true)
      .attr('transform', `translate(${margins.left}, ${margins.top})`);
    container.append('g').classed('chart-group', true);
    container.append('g').classed('metadata-group', true);

    return container;
  };

  const generateColorScale = (
    values: number[],
  ): ScaleLinear<string, string> => {
    const colorScale = d3
      .scaleLinear<string>()
      .range([colorSchema[0], colorSchema[colorSchema.length - 1]])
      .domain(d3.extent(values, (value) => value))
      .interpolate(d3.interpolateHcl);

    return colorScale;
  };

  const buildSVG = (
    htmlElement: HTMLDivElement,
  ): Selection<any, any, null, undefined> => {
    if (!svg) {
      svg = d3
        .select(htmlElement)
        .append('svg')
        .classed('heatmap', true);
      generateContainerGroups(svg);
    }
    svg
      .attr('width', width + margins.left + margins.right)
      .attr('height', height + margins.top + margins.bottom);
    return svg;
  };

  const generateBoxes = (
    data: number[][],
    colorScale: ScaleLinear<string, string>,
  ) => {
    const boxes = svg
      .select('.chart-group')
      .selectAll('.box')
      .data(data);
    boxes
      .enter()
      .append('rect')
      .attr('width', boxSize)
      .attr('height', boxSize)
      .attr('y', (d) => d[0] * boxSize)
      .attr('x', (d) => d[1] * boxSize)
      .style('fill', (d) => colorScale(d[2]))
      .classed('box', true);

    boxes.exit().remove();
  };

  return (selection: Selection<any, any, any, any>) => {
    selection.each(function(data: number[][]) {
      const daysOfWeek = data.map((elt) => elt[0]);
      const hoursOfDay = data.map((elt) => elt[1]);
      const values = data.map((elt) => elt[2]);
      colorScale = generateColorScale(values);
      svg = buildSVG(this);
      generateBoxes(data, colorScale);
    });
  };
}
