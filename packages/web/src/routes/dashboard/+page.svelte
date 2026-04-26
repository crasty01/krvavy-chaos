<script lang="ts">
import { authClient } from '$lib/auth-client.svelte';
import { Button } from 'bits-ui';
import { fromStore } from 'svelte/store';
import Game from '$lib/components/layout/Game.svelte';
import type { PageData } from './$types';
import InfoBox from '$lib/components/utils/InfoBox.svelte';
import Icon from '@iconify/svelte';
import { invalidateAll } from '$app/navigation';

let session = fromStore(authClient.useSession());
let { data }: { data: PageData } = $props();

let deactivating = $state(false);

const deactivateGame = async (gameId: string) => {
	deactivating = true;
	try {
		await fetch(`/api/games/${gameId}/deactivate`, { method: 'POST' });
		await invalidateAll();
	} finally {
		deactivating = false;
	}
};
</script>

<div class="page">
	<section class="hero">
		<h1 class="title">přehled</h1>
		<p>Vítej, {session.current.data?.user.name}!</p>
	</section>

	<section class="active-game">
		<h2>aktivní hra</h2>

		{#if data.game}
			<Game
				id={data.game.id}
				name={data.game.name}
				updatedAt={data.game.updatedAt}
				editorsLength={data.game.editors.length}
				playersLength={data.game.gamePlayers.length}
				isActive={true}
			/>
			<Button.Root data-button-variant="danger" disabled={deactivating} onclick={() => deactivateGame(data.game!.id)}>
				<Icon icon="material-symbols:stop-circle-outline" width={20} height={20} />
				<span>{deactivating ? 'deaktivuji…' : 'deaktivovat hru'}</span>
			</Button.Root>
		{:else}
			<InfoBox>
				nenalezena žádná aktivní hra
			</InfoBox>
		{/if}

		<Button.Root data-button-variant="accent" href="/dashboard/games">
			<span>přejít na seznam her</span>
			<Icon icon="material-symbols:arrow-outward" width=20 height=20 />
		</Button.Root>
	</section>
</div>

<style>
.page {
	display: grid;
	align-content: flex-start;
	gap: 2rem;
	height: 100%;
	overflow-y: auto;
}

.title {
	font-size: var(--size-4xl);
}

section.hero {
	display: grid;
	width: 100%;
	align-content: flex-start;
	justify-items: flex-start;
}

section.active-game {
	display: grid;
	width: 100%;
	align-content: flex-start;
	justify-items: flex-start;
	gap: var(--size-sm);
}
</style>