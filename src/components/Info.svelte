<script lang="ts">
  import { onMount } from 'svelte';
  import Button from './Button.svelte';

  let isOpen = false;

  export function open() {
    isOpen = true;
  }

  export function close() {
    isOpen = false;
  }

  const escListener = (e: KeyboardEvent) => {
    if (isOpen && e.key === 'Escape') close();
  };

  onMount(() => {
    window.addEventListener('keydown', escListener);
    return () => window.removeEventListener('keydown', escListener);
  });
</script>

{#if isOpen}
  <div class="backdrop" on:click={close}>
    <div class="modal" on:click|stopPropagation>
      <h2>What's this?</h2>
      <p>
        This chart compares the cumulative damage over time and time-to-kill of
        different weapons against different levels of body shield.
      </p>
      <p>
        Note that this is not exactly the same as damage per second; DPS doesn't
        give the full picture, since the fire rate of the weapon and the level
        of shield drastically affects the number of bullets, and thus the time,
        needed to down the target.
      </p>
      <p>
        <a
          href="https://github.com/gregoryjjb/apex-weapons/issues"
          rel="noopener noreferrer"
          ><strong>Notice something wrong/outdated?</strong>
          Please open an issue!
        </a>
      </p>
      <p>
        Inspired by <a
          href="https://old.reddit.com/r/CompetitiveApex/comments/o3kezp/inspecting_competitive_weapon_meta_with/"
          rel="noopener noreferrer">u/Runedk93's Reddit posts on the same topic</a
        >.
      </p>
      <p>
        Data sources: the <a
          href="https://apexlegends.fandom.com/wiki/Weapon"
          rel="noopener noreferrer">Apex Legends Wiki</a
        >, analysis of game files and video footage.
      </p>
      <p>Created by <a href="https://gregbrisebois.com">Greg Brisebois</a>.</p>
      <div class="button-row">
        <Button on:click={close}>Close</Button>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .modal {
    background-color: white;
    opacity: 1;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
    padding: 1.5rem;

    border-radius: 0.5rem;
  }

  h2 {
    margin: 0;
    margin-bottom: 1rem;
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .button-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  @media (max-width: 640px) {
    .modal {
      border-radius: 0;
      margin-top: 0;
      padding: 1rem;
    }
  }
</style>
