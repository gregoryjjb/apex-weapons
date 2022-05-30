<script lang="ts">
  import type { Weapon } from '../types';
  import type { WeaponKey, WeaponSelections } from '../weapons';

  import {
    ammoColors,
    buildSelectionData,
    getWeaponCurveName,
    helmetTiers,
    newDamageOptions,
  } from '../data';
  import weapons from '../weapons';

  export let name: string;
  export let weaponKeys: WeaponKey[];
  export let selections: WeaponSelections;

  $: id = `weapon-group-${name}`;

  let expanded = true;

  const hasOptions = (weapon: WeaponKey): boolean => {
    return Object.keys(selections[weapon].options).length > 1;
  };
</script>

<div class="weapon-group" style="border-color: {ammoColors[name] || 'grey'}">
  <button class="group-button" aria-controls={id} on:click={() => (expanded = !expanded)}>
    <h3 class="category-title">{name}</h3>
  </button>
  <ul class="weapons-list" id={id} aria-expanded={false} hidden={!expanded}>
    {#each weaponKeys as weapon}
      <li>
        <label>
          <input type="checkbox" bind:checked={selections[weapon].enabled} />
          {weapons[weapon].name}
          {#if selections[weapon].enabled && hasOptions(weapon)}
            <ul class="variant-list">
              {#each Object.keys(selections[weapon].options) as option}
                <li>
                  <label>
                    <input
                      type="checkbox"
                      bind:checked={selections[weapon].options[option]}
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

<style>
  .weapon-group {
    border-left: 2px solid;
    border-top: 1px solid;
  }

  .group-button {
    background-color: transparent;
    background-image: none;
    border: none;
    width: 100%;
    padding: 0.75rem 0 0.5rem 1rem;
    margin: 0;
    text-align: left;
  }

  @media (max-width: 720px) {
    .weapon-group {
      padding-left: 0.5rem;
      padding-top: 0.25rem;
    }
  }

  .category-title {
    text-transform: uppercase;
    margin: 0;
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
</style>
