<script lang="ts">
  let clazz = '';
  export { clazz as class };
  export let rounded = false;
</script>

<button on:click class:rounded class={clazz}>
  <slot />
</button>

<style>
  button {
    background-color: transparent;
    border: 1px solid var(--blue-700);
    color: var(--blue-700);
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 100ms;
    margin: 0;
  }

  button:hover {
    background-color: #dbeafe;
  }

  .rounded {
    border-radius: 100%;
  }
</style>
