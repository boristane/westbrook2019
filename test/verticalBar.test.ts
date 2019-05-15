import main from '../src/index';

beforeEach(() => {
  const d = document.createElement('div');
  d.classList.add('container');
  document.body.appendChild(d);
});

afterEach(() => {
  document.body.removeChild(document.querySelector('.container'));
});

describe('Rendering the heatmap', () => {
  beforeEach(() => {
    const daysHuman = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const values = [
      15,
      12,
      4,
      8,
      9,
      11,
      1,
    ];
    const data = daysHuman.map((day, index) => ({
      label: day,
      value: values[index],
    }));
    main(data);
  });

  it('should render one bar chart', () => {
    const expected = 1;
    const actual = document.querySelectorAll('.vertical-bar-chart').length;
    expect(actual).toEqual(expected);
  });

  it('should create a container and a chart groups', () => {
    const numContainerGroups = document.querySelectorAll(
      '.vertical-bar-chart g.container-group',
    ).length;
    const numChartGroups = document.querySelectorAll('.vertical-bar-chart g.chart-group')
      .length;
    expect(numContainerGroups).toEqual(1);
    expect(numChartGroups).toEqual(1);
  });

  it('should render the y-axis labels', () => {
    const actual = document.querySelectorAll('.vertical-bar-chart .y-label-group .tick').length;
    const expected = 8;
    expect(actual).toEqual(expected);
  });

  it('should render the x-axis labels', () => {
    const actual = document.querySelectorAll('.vertical-bar-chart .x-label-group .tick').length;
    const expected = 7;
    expect(actual).toEqual(expected);
  });

  it('should render a tooltip', () => {
    const actual = document.querySelectorAll('.container .tooltip').length;
    expect(actual).toEqual(1);
  });
});
