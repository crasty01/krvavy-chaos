<script lang="ts">
import { authClient } from '$lib/auth-client.svelte';
import { Button } from 'bits-ui';
import { fromStore } from 'svelte/store';
import Game from '$lib/components/layout/Game.svelte';
import type { PageData } from './$types';
import InfoBox from '$lib/components/utils/InfoBox.svelte';
import Icon from '@iconify/svelte';
import { invalidateAll } from '$app/navigation';
import { createAsyncAction } from '$lib/functions/async.svelte';

let session = fromStore(authClient.useSession());
let { data }: { data: PageData } = $props();

const STATUS_ICONS = {
	loading: 'material-symbols:progress-activity',
	success: 'material-symbols:check-circle',
	error: 'material-symbols:cancel',
} as const;

let deactivateAction = createAsyncAction({ minLoading: 200, minSuccess: 1500, minError: 2500 });
const deactivateIcon = $derived(deactivateAction.status === 'idle' ? 'material-symbols:stop-circle-outline' : STATUS_ICONS[deactivateAction.status]);

const deactivate = (gameId?: string) => deactivateAction.trigger(async () => {
	if (!gameId) throw new Error();
	const res = await fetch(`/api/games/${gameId}/deactivate`, { method: 'POST' });
	await invalidateAll();
	if (!res.ok) throw new Error();
});
</script>

<svelte:head>
	<title>Krvavá hodina odbila | přehled</title>
</svelte:head>

<div class="page">
	<section class="hero">
		<h1 class="title">přehled</h1>
		<p>Vítej, {session.current.data?.user.name}!</p>
	</section>

	<section class="active-game">
		<div class="lead">
			<h2>aktivní hra</h2>
			{#if data.game}
				<Button.Root data-button-variant="solid" onclick={() => deactivate(data.game?.id)}>
					<Icon icon={deactivateIcon} data-spin={String(deactivateAction.status === 'loading')} />
					<span>deaktivovat hru</span>
				</Button.Root>
			{/if}
		</div>

		{#if data.game}
			<Game
				id={data.game.id}
				name={data.game.name}
				updatedAt={data.game.updatedAt}
				editorsLength={data.game.editors.length}
				playersLength={data.game.gamePlayers.length}
				isActive={true}
			/>
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

	& .lead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
}
</style>