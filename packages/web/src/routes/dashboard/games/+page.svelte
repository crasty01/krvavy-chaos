<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from 'bits-ui';
	import type { PageData } from './$types';
	import Game from '$lib/components/layout/Game.svelte';
	import InfoBox from '$lib/components/utils/InfoBox.svelte';

	let { data }: { data: PageData } = $props();

	const formatDate = (date: Date | number) => {
		const d = date instanceof Date ? date : new Date(date);
		return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' });
	};
</script>

<svelte:head>
	<title>Hry — Krvavý chaos</title>
</svelte:head>

<div class="games-page">
	<div class="page-header">
		<h1>Hry</h1>
		<Button.Root data-button-variant="accent" href="/dashboard/games/new">
			<Icon icon="material-symbols:add" width={18} height={18} />
			<span>Vytvořit hru</span>
		</Button.Root>
	</div>

	{#if data.ownGames.length === 0 && data.sharedGames.length === 0}
		<div class="empty-state">
			<Icon icon="material-symbols:sports-esports-outline" width={48} height={48} />
			<p>Zatím nemáte žádné hry.</p>
			<Button.Root data-button-variant="accent" href="/dashboard/games/new">
				<span>Vytvořit první hru</span>
			</Button.Root>
		</div>
	{:else}
	<section>
		<h4>Moje hry</h4>
		{#if data.ownGames.length > 0}
			<div class="game-list">
				{#each data.ownGames as game (game.id)}
					<Game
						id={game.id}
						name={game.name}
						updatedAt={game.updatedAt}
						editorsLength={game.editors.length}
						playersLength={game.gamePlayers.length}
					/>
				{/each}
			</div>
			{:else}
				<InfoBox>
					nenalezeny žádné vytvořené hry
				</InfoBox>
			{/if}
		</section>

		<section>
			<h4>Sdílené se mnou</h4>
			{#if data.sharedGames.length > 0}
				<div class="game-list">
					{#each data.sharedGames as game (game.id)}
						<Game
							id={game.id}
							name={game.name}
							updatedAt={game.updatedAt}
							editorsLength={game.editors.length}
							playersLength={game.gamePlayers.length}
						/>
					{/each}
				</div>
			{:else}
				<InfoBox>
					nenalezeny žádné nasdílené hry
				</InfoBox>
			{/if}
		</section>
	{/if}
</div>

<style>
	.games-page {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2rem 1rem;
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		& h1 {
			font-weight: 900;
			text-transform: uppercase;
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 4rem 1rem;
		color: light-dark(var(--color-neutral-400), var(--color-neutral-500));

		& p {
			text-align: center;
		}
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		& h4 {
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			color: light-dark(var(--color-neutral-500), var(--color-neutral-400));
		}
	}

	.game-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
