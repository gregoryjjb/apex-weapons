<script>
  import { onMount } from 'svelte';
  import Chart from './chart';

  export let selections = [];

  let canvas;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      lineAtIndex: [1, 1, 100],
      data: {
        // labels: ["Flatline"],
        datasets: [
          {
            label: 'Flatline',
            borderColor: 'green',
            pointBackgroundColor: 'green',
            borderWidth: 1,
            data: [
              [ 0, 19 ],    [ 0.1, 38 ],  [ 0.2, 57 ],
              [ 0.3, 76 ],  [ 0.4, 95 ],  [ 0.5, 114 ],
              [ 0.6, 133 ], [ 0.7, 152 ], [ 0.8, 171 ],
              [ 0.9, 190 ], [ 1, 209 ],   [ 1.1, 228 ],
              [ 1.2, 247 ], [ 1.3, 266 ], [ 1.4, 285 ],
              [ 1.5, 304 ], [ 1.6, 323 ], [ 1.7, 342 ],
              [ 1.8, 361 ], [ 1.9, 380 ], [ 2, 399 ],
              [ 2.1, 418 ], [ 2.2, 437 ], [ 2.3, 456 ],
              [ 2.4, 475 ], [ 2.5, 494 ], [ 2.6, 513 ],
              [ 2.7, 532 ], [ 2.8, 551 ], [ 2.9, 570 ]
            ].map(a => ({ x: a[0], y: a[1] }))
          },
          {
            label: 'EVA-8',
            borderColor: 'red',
            pointBackgroundColor: 'red',
            borderWidth: 1,

            data:  [
              [ 0, 63 ],
              [ 0.3527, 126 ],
              [ 0.7055, 189 ],
              [ 1.0582, 252 ],
              [ 1.4109, 315 ],
              [ 1.7637, 378 ],
              [ 2.1164, 441 ],
              [ 2.4691, 504 ]
            ].map(a => ({ x: a[0], y: a[1] }))
          },
          {
            label: 'HAVOC',
            borderColor: 'var(--ammo-shotgun)',
            pointBackgroundColor: 'var(--ammo-shotgun)',
            borderWidth: 1,
            data:  [
              [ 0.5, 18 ],
              [ 0.5893, 36 ],
              [ 0.6786, 54 ],
              [ 0.7679, 72 ],
              [ 0.8571, 90 ],
              [ 0.9464, 108 ],
              [ 1.0356999999999998, 126 ],
              [ 1.125, 144 ],
              [ 1.2143000000000002, 162 ],
              [ 1.3035999999999999, 180 ],
              [ 1.3929, 198 ],
              [ 1.4821, 216 ],
              [ 1.5714, 234 ],
              [ 1.6607, 252 ],
              [ 1.75, 270 ],
              [ 1.8393, 288 ],
              [ 1.9286, 306 ],
              [ 2.0179, 324 ],
              [ 2.1071, 342 ],
              [ 2.1963999999999997, 360 ],
              [ 2.2857000000000003, 378 ],
              [ 2.375, 396 ],
              [ 2.4642999999999997, 414 ],
              [ 2.5536, 432 ]
            ].map(a => ({ x: a[0], y: a[1] }))
          }
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Time (seconds)'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Damage'
            }
          }
        }
      }
    });
  });
</script>

<div>
  <canvas bind:this={canvas} width="400" height="400" />
  <p>{selections.join(', ')}</p>
</div>
