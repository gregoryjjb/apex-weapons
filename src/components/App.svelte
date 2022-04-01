<script lang="ts">
  import Chart from './Chart.svelte';
  import Button from './Button.svelte';
  import { ammoColors, buildSelectionData, getWeaponCurveName } from '../data';
  import * as storage from '../storage';
  import weapons from '../weapons';

  import type { AmmoType } from '../types';
  import type { WeaponKey } from '../weapons';
  import Header from './Header.svelte';

  const selections = storage.mergeSelections();
  let limitToKilled = true;
  let fortified = false;
  let headshots = false;

  const handleWeaponSelected = weapon => e => {
    // storage.saveSelections(selections);
  };

  const handleOptionSelected = (weapon, option) => e => {
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
    return Object.keys(selections).map(s => s as WeaponKey);
  };

  const getOptionName = (weapon: WeaponKey, option: string): string => {
    const w = weapons[weapon];
    if (w.curveName !== undefined) return w.curveName(option);
    return option;
  };

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
  <Header />
  <div class="columns">
    <div class="left">
      <div class="weapon-selections">
        <div class="weapons-header">
          <h2>Weapons</h2>
          <Button on:click={clearSelections}>Clear selections</Button>
        </div>
        <ul class="category-list">
          {#each weaponGroups as group}
            <li class="category-item">
              <div
                class="category-item-display"
                style="border-color: {ammoColors[group.name] || 'grey'}"
              >
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
              </div>
            </li>
          {/each}
        </ul>
      </div>
      <div class="option-selections">
        <h2 class="options-header">Display options</h2>
        <label>
          <input type="checkbox" bind:checked={limitToKilled} />
          Limit to killing shot
        </label>
        <label>
          <input type="checkbox" bind:checked={fortified} />
          Fortified legends
        </label>
        <label>
          <input type="checkbox" bind:checked={headshots} />
          Headshots
        </label>
      </div>
    </div>
    <div class="right">
      <Chart {selections} {limitToKilled} {fortified} {headshots} />
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

  h2 {
    margin: 0;
    color: #444;
    font-weight: 600;
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
    padding: 1rem 2rem;
    overflow-y: auto;
  }

  @media (max-width: 720px) {
    .left {
      border-bottom: 1px solid var(--gray-300);
    }
  }

  .right {
    flex: 1;
    min-width: 0;
    padding: 2rem;
  }

  .weapon-selections {
    margin-bottom: 2rem;
  }

  .weapons-header {
    display: flex;
    margin-bottom: 1rem;
  }

  .weapons-header > h2 {
    flex: 1;
  }

  .options-header {
    margin-bottom: 1rem;
  }

  @media (max-width: 720px) {
    .columns {
      flex-direction: column;
    }

    .left {
      width: auto;
      height: 50%;
      flex: 1;
      padding: 0.5rem 1rem;
    }

    .right {
      height: 50%;
      padding: 1rem;
    }
  }

  .category-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;

    /* Grid stuff */
    margin: -1rem;
  }

  .category-item {
    padding: 1rem;
    box-sizing: border-box;
  }

  .category-item-display {
    border-left: 2px solid;
    border-top: 1px solid;
    padding-left: 1rem;
    padding-top: 0.75rem;
  }

  @media (max-width: 720px) {
    .category-list {
      flex-wrap: wrap;
      flex-direction: row;
      margin: -0.5rem;
    }

    .category-item {
      width: 50%;
      padding: 0.5rem;
    }

    .category-item-display {
      padding-left: 0.5rem;
      padding-top: 0.25rem;
    }
  }

  .category-title {
    text-transform: uppercase;
    margin: 0;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .weapons-list {
    list-style: none;
    padding-left: 1rem;
  }

  .variant-list {
    list-style: none;
    padding-left: 2rem;
  }

  @media (max-width: 720px) {
    .weapons-list {
      padding-left: 0.5rem;
    }

    .variant-list {
      padding-left: 1rem;
    }
  }

  @media (min-width: 720px) {
    main {
      max-width: none;
    }
  }
</style>
