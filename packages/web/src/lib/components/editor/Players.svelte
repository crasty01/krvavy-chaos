<script lang="ts">
import type { GameFull } from '$lib/server/db';

let { game }: {
	game: GameFull
} = $props();
</script>

<span>palyers | {game.id}</span>