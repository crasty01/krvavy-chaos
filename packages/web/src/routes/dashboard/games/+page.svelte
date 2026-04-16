<script lang="ts">
	import Icon from '@iconify/svelte';
	import Game from '$lib/components/layout/Game.svelte';
	import InfoBox from '$lib/components/utils/InfoBox.svelte';
	import { Button } from 'bits-ui';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import Breadcrumbs from '$lib/components/utils/Breadcrumbs.svelte';

	let { data }: { data: PageData } = $props();

	const createGame = async () => {
		const response = await fetch('/api/game/new');
		const game = await response.json();
		await goto(`/dashboard/games/${encodeURIComponent(game.id)}`)
	}
</script>

<svelte:head>
	<title>Hry — Krvavý chaos</title>
</svelte:head>

<div class="page">
	<header>
		<div class="lead">
			<h1>seznam her</h1>
		</div>
		<div class="tail">
			<Button.Root data-button-variant="accent" onclick={createGame}>
				<Icon icon="material-symbols:add" width={18} height={18} />
				<span>vytvořit hru</span>
			</Button.Root>
		</div>
	</header>

	{#if data.ownGames.length === 0 && data.sharedGames.length === 0}
		<InfoBox>
			zatím nemáte žádné hry.
		</InfoBox>
	{:else}
		<section class="games">
			<h2>moje hry</h2>
			{#if data.ownGames.length > 0}
				<ul class="game-list">
					{#each data.ownGames as game (game.id)}
						<li>
							<Game
								id={game.id}
								name={game.name}
								updatedAt={game.updatedAt}
								editorsLength={game.editors.length}
								playersLength={game.gamePlayers.length}
							/>
						</li>
					{/each}
				</ul>
			{:else}
				<InfoBox>
					nenalezeny žádné vytvořené hry
				</InfoBox>
			{/if}
		</section>

		<section class="games">
			<h2>sdílené se mnou</h2>
			{#if data.sharedGames.length > 0}
				<ul class="game-list">
					{#each data.sharedGames as game (game.id)}
						<li>
							<Game
								id={game.id}
								name={game.name}
								updatedAt={game.updatedAt}
								editorsLength={game.editors.length}
								playersLength={game.gamePlayers.length}
							/>
						</li>
					{/each}
				</ul>
			{:else}
				<InfoBox>
					nenalezeny žádné sdílené hry
				</InfoBox>
			{/if}
		</section>
	{/if}
</div>

<style>
.page {
	display: grid;
	align-content: flex-start;
	gap: 2rem;
	height: 100%;
	overflow: auto;
}

header {
	display: flex;
	justify-content: space-between;
	align-items: center;

	& .lead, & .tail {
		display: flex;
	}
}

.games {
	display: grid;
	gap: 1rem;
}
</style>