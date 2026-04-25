<script lang="ts">
import * as Overlay from '../overlay';
import { game } from '../../functions/game.svelte';

let gameData = $derived(game.data);

const gamePlayers = $derived(gameData?.gamePlayers);
</script>

{#if gamePlayers}
	<Overlay.Root>
		{#each gamePlayers as gamePlayer, i}
			<Overlay.Token
				seatIndex={i}
				numberOfSeats={gamePlayers.length}
				gamePlayer={gamePlayer}
			/>
		{/each}
	</Overlay.Root>
{/if}