import { Chart, ChartComponent, ChartType, Plugin, registerables } from "chart.js";
Chart.register(...registerables); // Necessary to get all chart.js features :(

const verticalLinePlugin = {
  id: "verticalLinePlugin",
  getLinePosition: function (chart, pointIndex) {
    const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
    const data = meta.data;
    return data[pointIndex]._model.x;
  },
  renderVerticalLine: function (chartInstance, pointIndex) {
    const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
    const scale = chartInstance.scales["y-axis-0"];
    const context = chartInstance.chart.ctx;

    // render vertical line
    context.beginPath();
    context.strokeStyle = "#ff0000";
    context.moveTo(lineLeftOffset, scale.top);
    context.lineTo(lineLeftOffset, scale.bottom);
    context.stroke();

    // write label
    context.fillStyle = "#ff0000";
    context.textAlign = "center";
    context.fillText(
      "MY TEXT",
      lineLeftOffset,
      (scale.bottom - scale.top) / 2 + scale.top
    );
  },

  afterDatasetsDraw: function (chart, easing) {
    console.log("After datasets draw");
    if (chart.config.lineAtIndex) {
      chart.config.lineAtIndex.forEach((pointIndex) =>
        this.renderVerticalLine(chart, pointIndex)
      );

      this.renderVerticalLine(chart, 2);
    }
  },
};

type HorizontalLineOptions = {
  value: number;
  color?: string;
}

type HorizontalLinesOptions = {
  lines: HorizontalLineOptions[]
}

const horizontalLines: Plugin = {
  id: "horizontalLines",
  beforeDraw(chart, args, options: HorizontalLinesOptions) {
    const {
      ctx,
      chartArea: { left, top, right, bottom },
      scales: { x, y },
    } = chart;

    (options.lines || []).forEach((line) => {
      ctx.save();
      const yPos = y.getPixelForValue(line.value, 0);

      // Style
      ctx.strokeStyle = line.color || "black";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      // Draw line
      ctx.beginPath();
      ctx.moveTo(left, yPos);
      ctx.lineTo(right, yPos);
      ctx.stroke();

      ctx.restore();
    });
  },
};

Chart.register(horizontalLines);

export default Chart;
