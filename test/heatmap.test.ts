import main from '../src/index';

beforeEach(() => {
  const d = document.createElement('div');
  d.classList.add('container');
  document.body.appendChild(d);
});

afterEach(function() {
  document.body.removeChild(document.querySelector('.container'));
});

describe('Rendering the heatmap', () => {
  beforeEach(() => {
    main();
  });

  it('should render one heat map', () => {
    const expected = 1;
    const actual = document.querySelectorAll('.heatmap').length;
    expect(actual).toEqual(expected);
  });

  it('should render a square for each hour of the week', () => {
    const actual = document.querySelectorAll('.heatmap .box').length;
    expect(actual).toEqual(24 * 7);
  });

  it('should create a container and a chart groups', () => {
    const numContainerGroups = document.querySelectorAll(
      '.heatmap g.container-group',
    ).length;
    const numChartGroups = document.querySelectorAll('.heatmap g.chart-group')
      .length;
    expect(numContainerGroups).toEqual(1);
    expect(numChartGroups).toEqual(1);
  });

  it('should render the y-axis labels', () => {
    const actual = document.querySelectorAll('.heatmap .y-label').length;
    const expected = 7;
    expect(actual).toEqual(expected);
  });

  it('should render the x-axis labels', () => {
    const actual = document.querySelectorAll('.heatmap .x-label').length;
    const expected = 24;
    expect(actual).toEqual(expected);
  });
});
