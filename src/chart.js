import { Chart, registerables } from "chart.js";
Chart.register(...registerables); // Necessary to get all chart.js features :(

const verticalLinePlugin = {
  id: 'verticalLinePlugin',
  getLinePosition: function (chart, pointIndex) {
    const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
    const data = meta.data;
    return data[pointIndex]._model.x;
  },
  renderVerticalLine: function (chartInstance, pointIndex) {
    const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
    const scale = chartInstance.scales['y-axis-0'];
    const context = chartInstance.chart.ctx;

    // render vertical line
    context.beginPath();
    context.strokeStyle = '#ff0000';
    context.moveTo(lineLeftOffset, scale.top);
    context.lineTo(lineLeftOffset, scale.bottom);
    context.stroke();

    // write label
    context.fillStyle = "#ff0000";
    context.textAlign = 'center';
    context.fillText('MY TEXT', lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
  },

  afterDatasetsDraw: function (chart, easing) {
    console.log('After datasets draw')
    if (chart.config.lineAtIndex) {
      chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));

      this.renderVerticalLine(chart, 2);
    }
  }
};

Chart.register(verticalLinePlugin);

export default Chart;
