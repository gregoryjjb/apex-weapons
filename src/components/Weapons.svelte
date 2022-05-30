<script lang="ts">
  import type { WeaponKey, WeaponSelections } from '../weapons';
  import type { AmmoType } from '../types';
  
  import Button from './Button.svelte';
  import WeaponGroup from './WeaponGroup.svelte';
  
  import { groupWeapons } from '../weapons';
  import weapons from '../weapons';

  export let selections: WeaponSelections;

  let searchTerm = '';

  const filterWeapons = (search: string) => {
    const punctuationRegex = /[\.\-]/g;
    const s = search.toLocaleLowerCase().replaceAll(punctuationRegex, '');

    return Object.keys(weapons).filter((k: WeaponKey) => {
      const name = weapons[k].name;
      return name.toLocaleLowerCase().replaceAll(punctuationRegex, '').includes(s);
    }) as WeaponKey[];
  };
  
  $: weaponKeys = filterWeapons(searchTerm); console.log(weaponKeys);
  $: weaponGroups = groupWeapons(weaponKeys); console.log(weaponGroups);

  const hasOptions = (weapon: WeaponKey): boolean => {
    return Object.keys(selections[weapon].options).length > 1;
  };

  const handleOptionSelected = (weapon, option) => e => {
    if (!hasOptions(weapon)) {
      // Can't uncheck if there's only one option
      selections[weapon].options[option] = true;
    }
  };

  const clearSelections = () => {
    let key: WeaponKey;
    for (key in selections) {
      selections[key].enabled = false;
    }
  };
</script>

<div class="weapon-selections">
  <div class="header">
    <h2>Weapons</h2>
    <Button on:click={clearSelections}>Clear selections</Button>
    <input bind:value={searchTerm} placeholder="Search...">
  </div>
  <ul class="groups-list">
    {#each weaponGroups as group}
      <li class="groups-item">
        <WeaponGroup
          name={group.name}
          weaponKeys={group.weapons}
          bind:selections
        />
      </li>
    {/each}
    {#if weaponGroups.length === 0}
      <p class="no-weapons">No weapons match '{searchTerm}'</p>
    {/if}
  </ul>
</div>

<style>
  .weapon-selections {
    margin-bottom: 2rem;
  }

  .header {
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .header > h2 {
    flex: 1;
  }

  .header > input {
    flex: 1;
    margin: 0;
  }

  .groups-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .groups-item {
    box-sizing: border-box;
  }

  .no-weapons {
    color: var(--orange-500);
    font-style: italic;
    margin: 0;
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
  }
</style>
