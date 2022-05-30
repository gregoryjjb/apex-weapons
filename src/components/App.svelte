<script lang="ts">
  import Chart from './Chart.svelte';
  import Button from './Button.svelte';
  import DamageOptions from './DamageOptions.svelte';

  import {
    ammoColors,
    buildSelectionData,
    getWeaponCurveName,
    helmetTiers,
    newDamageOptions,
  } from '../data';
  import * as storage from '../storage';
  import weapons from '../weapons';

  import type { AmmoType } from '../types';
  import type { WeaponKey } from '../weapons';
  import Header from './Header.svelte';
  import Weapons from './Weapons.svelte';

  let selections = storage.mergeSelections();
  let options = newDamageOptions();

  const handleWeaponSelected = weapon => e => {
    // storage.saveSelections(selections);
  };

  const handleOptionSelected = (weapon, option) => e => {
    if (!hasOptions(weapon)) {
      // Can't uncheck if there's only one option
      selections[weapon].options[option] = true;
    }
  };

  const hasOptions = (weapon: WeaponKey): boolean => {
    return Object.keys(selections[weapon].options).length > 1;
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
      <Weapons bind:selections />
      <DamageOptions bind:options />
    </div>
    <div class="right">
      <Chart {selections} damageOptions={options} />
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

  @media (min-width: 720px) {
    main {
      max-width: none;
    }
  }
</style>
