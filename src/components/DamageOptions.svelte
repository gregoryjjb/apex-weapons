<script lang="ts">
  import { helmetTiers } from "../data";
  import type { DamageOptions } from "../data";

  export let options: DamageOptions;
</script>

<div class="option-selections">
  <h2 class="options-header">Display options</h2>
  <label>
    <input type="checkbox" bind:checked={options.limitToKilled} />
    Limit to killing shot
  </label>
  <label>
    <input type="checkbox" bind:checked={options.fortified} />
    Fortified legends
  </label>
  <label>
    <input type="checkbox" bind:checked={options.headshots} />
    Headshots
  </label>
  <fieldset hidden={!options.headshots}>
    <legend>Helmet tier</legend>
    {#each helmetTiers as r}
    <div class="radio">
      <label>
        <input type="radio" name="helmet-tier" bind:group={options.helmet} value={r}>
        {r}
      </label>
    </div>
    {/each}
  </fieldset>
</div>

<style>
  fieldset {
    padding-left: 2rem;
  }

  legend {
    padding: 0;
  }
</style>
