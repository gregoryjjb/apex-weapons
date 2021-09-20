<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "./chart";

  import { selectionsToDatasets } from "./data";

  import type { WeaponSelections } from "./data";

  export let selections: WeaponSelections;
  export let limitToKilled: boolean = false;
  export let fortified: boolean = false;

  let canvas, container, sizer;

  $: datasets = selectionsToDatasets(selections, { limitToKilled, fortified });
  // $: console.log("datasets", datasets);

  let theChart: Chart;

  const updateChart = () => {
    if (!theChart) return;

    theChart.data.datasets = datasets;
    theChart.update();
  };

  const resizeChart = () => {
    console.log("resizing");
    sizer.style.width = container.offsetWidth + "px";
    sizer.style.height = container.offsetHeight + "px";
  };

  // @ts-ignore
  $: datasets, updateChart();

  onMount(() => {
    const ctx = canvas.getContext("2d");

    theChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: "Time (seconds)",
            },
            // min: 250,
          },
          y: {
            type: "linear",
            title: {
              display: true,
              text: "Damage",
            },
          },
        },
        animation: {
          duration: 0,
        },
        plugins: {
          // @ts-ignore
          horizontalLines: {
            lines: [
              { value: 150, color: "grey" },
              { value: 175, color: "blue" },
              { value: 200, color: "purple" },
              { value: 225, color: "red" },
            ],
          },
          legend: {
            position: "top",
            labels: {
              boxWidth: 10,
              boxHeight: 10,
            },
          },
          tooltip: {
            displayColors: false,
            backgroundColor: "rgb(255,0,0))",
            callbacks: {
              title: (item) => item[0].dataset.label || "",
              label: (item) =>
                `${item.parsed.y} @ ${item.parsed.x.toLocaleString("en-EN", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}s`,
              // labelColor: (context) => ({
              //   backgroundColor: 'rgb(255, 0, 0)',
              //   borderColor: "red",
              // }),
            },
          },
        },
      },
    });

    // container.style.height = '400px';
    // container.style.width = '600px';

    resizeChart();
    updateChart();

    window.addEventListener("resize", resizeChart);
  });
</script>

<div class="container" bind:this={container}>
  <div class="sizer" bind:this={sizer}>
    <canvas bind:this={canvas} />
    <!-- <p>{selections.join(", ")}</p> -->
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    min-width: 0;
  }

  .sizer {
    position: relative;
    width: 600px;
    height: 400px;
  }
</style>
