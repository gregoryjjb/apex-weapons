<script>
  import Chart from "./Chart.svelte";
  import { weapons, buildSelectionData } from "./data";

  export let name;

  const selections = buildSelectionData();
  console.log(selections);

  let selected = weapons[0];
  const handleWeaponSelected = weapon => e => {
    selections[weapon].enabled = e.target.checked;
  }

  const handleOptionSelected = (weapon, option) => e => {
    selections[weapon].options[option] = e.target.checked;
  }

  $: onlySelected = Object
    .keys(selections)
    .filter(key => selections[key].enabled)
    .map(key => {
      const name = weapons[key].name;
      const options = selections[key].options;

      if (options) {
        return Object
          .keys(options)
          .filter(k => options[k])
          .map(k => `${name} (${k})`);
      } else {
        return [weapons[key].name];
      }
    })
    .flat();


  function handleWeaponAdd() {
    console.log("Adding", selected, "to list");
  }
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>

  <div class="columns">
    <div class="left">
      <!-- <select bind:value={selected} on:change={handleWeaponSelected}>
        {#each Object.keys(selections) as selection}
          <option value={weapon}>{weapon}</option>
        {/each}
      </select>
      <button on:click={handleWeaponAdd}>Add</button> -->

      <ul>
        {#each Object.keys(selections) as weapon}
          <li>
            <label>
              <input
                type="checkbox"
                bind:value={selections[weapon].enabled}
                on:change={handleWeaponSelected(weapon)}
              />
              {weapons[weapon].name}
              {#if selections[weapon].enabled}
                <ul>
                  {#each Object.keys(selections[weapon].options) as option}
                    <li>
                      <label>
                        <input
                          type="checkbox"
                          bind:value={selections[weapon].options[option]}
                          on:change={handleOptionSelected(weapon, option)}
                        />
                        {option}
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
    <div class="right">
      <Chart selections={onlySelected} />
    </div>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .columns {
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    max-width: 1024px;
  }

  .left {
    text-align: left;
  }

  .right {
    flex: 1;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
