<script lang="ts">
  import Chart from "./Chart.svelte";
  import { ammoColors, buildSelectionData, getWeaponCurveName } from "./data";
  import * as storage from "./storage";
  import weapons from "./weapons";

  import type { AmmoType } from "./types";
  import type { WeaponKey } from "./weapons";

  export let name: string;

  const selections = storage.mergeSelections();
  let limitToKilled = true;
  let fortified = false;

  const handleWeaponSelected = (weapon) => (e) => {
    // storage.saveSelections(selections);
  };

  const handleOptionSelected = (weapon, option) => (e) => {
    if (!hasOptions(weapon)) {
      // Can't uncheck if there's only one option
      selections[weapon].options[option] = true;
    }

    // storage.saveSelections(selections);
  };

  const clearSelections = () => {
    let key: WeaponKey;
    for (key in selections) {
      selections[key].enabled = false;
    }
  };

  const hasOptions = (weapon: WeaponKey): boolean => {
    return Object.keys(selections[weapon].options).length > 1;
  };

  const selectionKeys = (): WeaponKey[] => {
    return Object.keys(selections).map((s) => s as WeaponKey);
  };

  const getOptionName = (weapon: WeaponKey, option: string): string => {
    const w = weapons[weapon];
    if (w.curveName !== undefined) return w.curveName(option);
    return option;
  }

  const wghash: Partial<Record<AmmoType, WeaponKey[]>> = {};
  let wk: WeaponKey;
  for (wk in weapons) {
    const weapon = weapons[wk];
    if (wghash[weapon.ammo]) {
      wghash[weapon.ammo]?.push(wk);
    } else {
      wghash[weapon.ammo] = [wk];
    }
  }
  const weaponGroups: Array<{ name: string; weapons: WeaponKey[] }> = [];
  let ak: AmmoType;
  for (ak in wghash) {
    weaponGroups.push({ name: ak, weapons: wghash[ak]! });
  }

  // Reactive
  $: storage.saveSelections(selections);
</script>

<main>
  <div class="header">
    <h1>Apex Legends weapon damage charts</h1>
  </div>
  <div class="columns">
    <div class="left">
      <div>
        <h2>Weapons</h2>
        <button on:click={clearSelections}>Clear selections</button>
        <ul class="category-list">
          {#each weaponGroups as group}
            <li class="category-item" style="border-color: {ammoColors[group.name] || 'grey'}">
              <h3 class="category-title">{group.name}</h3>
              <ul class="weapons-list">
                {#each group.weapons as weapon}
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        bind:checked={selections[weapon].enabled}
                        on:change={handleWeaponSelected(weapon)}
                      />
                      {weapons[weapon].name}
                      {#if selections[weapon].enabled && hasOptions(weapon)}
                        <ul class="variant-list">
                          {#each Object.keys(selections[weapon].options) as option}
                            <li>
                              <label>
                                <input
                                  type="checkbox"
                                  bind:checked={selections[weapon].options[
                                    option
                                  ]}
                                  on:change={handleOptionSelected(
                                    weapon,
                                    option
                                  )}
                                />
                                {getWeaponCurveName(weapon, option)}
                              </label>
                            </li>
                          {/each}
                        </ul>
                      {/if}
                    </label>
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        </ul>
      </div>
      <div>
        <h2>Display options</h2>
        <label>
          <input type="checkbox" bind:checked={limitToKilled} />
          Limit to killing shot
        </label>
        <label>
          <input type="checkbox" bind:checked={fortified} />
          Fortified legends
        </label>
      </div>
    </div>
    <div class="right">
      <Chart {selections} {limitToKilled} {fortified} />
    </div>
  </div>
</main>

<style>

  main {
    /* text-align: center; */
    padding: 0;
    /* max-width: 240px; */
    /* margin: 0 auto; */
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    height: 8rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
    margin: 0;
  }

  .columns {
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    width: 100%;
    min-height: 0;
  }

  .left {
    text-align: left;
    flex-shrink: 0;
    width: 20rem;
    padding: 2rem;
    overflow-y: auto;
  }

  .right {
    flex: 1;
    min-width: 0;
  }

  .category-list {
    list-style: none;
    padding: 0;
  }

  .category-item {
    border-left: 2px solid;
    border-top: 1px solid;
    padding-left: 1rem;
    padding-top: 0.75rem;
    margin-bottom: 2rem;
  }

  .category-title {
    text-transform: uppercase;
    margin: 0;
    margin-bottom: 0.5rem;
  }

  .weapons-list {
    list-style: none;
    padding-left: 1rem;
  }

  .variant-list {
    list-style: none;
    padding-left: 2rem;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
