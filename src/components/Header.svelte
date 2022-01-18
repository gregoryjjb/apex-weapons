<script lang="ts">
  import Button from './Button.svelte';
  import Info from './Info.svelte';

  let modal;
</script>

<header>
  <img src="/images/apex-legends.svg" alt="Apex Legends" />
  <h1>Weapon damage visualization</h1>
  <button on:click={() => modal.open()}>?</button>
</header>

<Info bind:this={modal} />

<style>
  header {
    padding: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  h1 {
    /* color: #ff3e00; */
    /* text-transform: uppercase; */
    font-size: 2rem;
    font-weight: 200;
    margin: 0;
    margin-right: 1rem;
    white-space: nowrap;
    overflow: hidden;
  }

  img {
    height: 3rem;
    vertical-align: middle;
    margin-right: 1rem;
  }

  button {
    margin: 0;
    padding: 0;
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;

    font-weight: bold;
    font-size: 1.5rem;

    background-color: transparent;
    color: var(--gray-400);
    border: 1px solid var(--gray-400);
    border-radius: 100%;
    cursor: pointer;
  }

  @media (max-width: 720px) {
    header {
      padding: 0.5rem;
    }

    h1 {
      font-size: 1.25rem;
      margin-right: 0.5rem;
    }

    img {
      height: 2rem;
      margin-right: 0.5rem;
    }

    button {
      width: 2rem;
      height: 2rem;
      font-size: 1.25rem;
    }
  }
</style>
