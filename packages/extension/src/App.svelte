<script lang="ts">
  import type { GameState } from '@krvavy-chaos/shared';

  let gameState = $state<GameState | null>(null);
</script>

<div class="overlay">
  {#if gameState}
    <!-- TODO: render overlay components -->
  {/if}
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }
</style>
