<script module lang="ts">
	const dateFormatter = new Intl.DateTimeFormat('cs', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
</script>

<script lang="ts">
import { authClient } from '$lib/auth-client.svelte';
import { Button, Switch } from 'bits-ui';
import { fromStore } from 'svelte/store';
import Game from '$lib/components/layout/Game.svelte';
import type { PageData } from './$types';
import InfoBox from '$lib/components/utils/InfoBox.svelte';
import InputGroup from '$lib/components/form/InputGroup.svelte';
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

// -- External control --

// Optimistic value while the request is in flight; null = follow server data
let pendingControl = $state<boolean | null>(null);
let controlAction = createAsyncAction({ minLoading: 200, minSuccess: 1500, minError: 2500 });

const setExternalControl = (enabled: boolean) => controlAction.trigger(async () => {
	pendingControl = enabled;
	try {
		const res = await fetch('/api/partner/control', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ enabled }),
		});
		await invalidateAll();
		if (!res.ok) throw new Error();
	} finally {
		pendingControl = null;
	}
});

const externalControl = $derived(pendingControl ?? data.externalControl);

// -- API keys --

let newKeyName = $state('');
let createdKey = $state<string | null>(null);
let createKeyAction = createAsyncAction({ minLoading: 200, minSuccess: 1500, minError: 2500 });
const createKeyIcon = $derived(createKeyAction.status === 'idle' ? 'material-symbols:add' : STATUS_ICONS[createKeyAction.status]);

const createKey = () => createKeyAction.trigger(async () => {
	const { data: created, error } = await authClient.apiKey.create({ name: newKeyName.trim() || 'Externí aplikace' });
	if (error || !created) throw new Error();
	createdKey = created.key;
	newKeyName = '';
	await invalidateAll();
});

let copyKeyAction = createAsyncAction({ minLoading: 200, minSuccess: 1500, minError: 2500 });
const copyKeyIcon = $derived(copyKeyAction.status === 'idle' ? 'material-symbols:content-copy' : STATUS_ICONS[copyKeyAction.status]);

const copyKey = () => copyKeyAction.trigger(async () => {
	if (!createdKey) throw new Error();
	await navigator.clipboard.writeText(createdKey);
});

const deleteKey = async (keyId: string, name: string | null) => {
	if (!confirm(`Smazat klíč „${name ?? 'bez názvu'}“? Aplikace, která ho používá, přestane fungovat.`)) return;
	await authClient.apiKey.delete({ keyId });
	await invalidateAll();
};
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
			{#if data.game && !data.externalControl}
				<Button.Root data-button-variant="solid" onclick={() => deactivate(data.game?.id)}>
					<Icon icon={deactivateIcon} data-spin={String(deactivateAction.status === 'loading')} />
					<span>deaktivovat hru</span>
				</Button.Root>
			{/if}
		</div>

		{#if data.externalControl}
			<p class="hint">Hru právě řídí externí aplikace.</p>
			{#if data.partnerGame}
				<div class="partner-game">
					<h3 class="name">{data.partnerGame.name}</h3>
					<div class="info">
						<span>{data.partnerGame.playersLength} hráčů</span>
						<span>data přijata {dateFormatter.format(data.partnerGame.updatedAt)}</span>
					</div>
				</div>
			{:else}
				<InfoBox>
					externí aplikace zatím neposlala žádná data
				</InfoBox>
			{/if}
		{:else if data.game}
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

	<section class="integration">
		<h2>externí aplikace</h2>
		<p class="hint">
			Když je řízení zapnuté, rozšíření na Twitchi místo aktivní hry zobrazuje data, která posílá externí aplikace
			přes API klíč. Aktivací nebo deaktivací hry v editoru se řízení zase vypne.
		</p>

		<InputGroup label="hru řídí externí aplikace">
			{#snippet children(id)}
				<Switch.Root {id} bind:checked={() => externalControl, setExternalControl} disabled={controlAction.status === 'loading'}>
					<Switch.Thumb />
				</Switch.Root>
			{/snippet}
		</InputGroup>
		{#if controlAction.status === 'error'}
			<span class="error">přepnutí selhalo</span>
		{/if}

		<h3>API klíče</h3>

		{#if createdKey}
			<InfoBox type="warning" title="nový API klíč" dismissible onclose={() => (createdKey = null)}>
				<p>Zkopíruj si ho teď, později už ho neuvidíš.</p>
				<div class="created-key">
					<code>{createdKey}</code>
					<Button.Root data-button-variant="outline" onclick={copyKey}>
						<Icon icon={copyKeyIcon} data-spin={String(copyKeyAction.status === 'loading')} />
						<span>zkopírovat</span>
					</Button.Root>
				</div>
			</InfoBox>
		{/if}

		{#if data.apiKeys.length > 0}
			<ul class="api-keys">
				{#each data.apiKeys as key (key.id)}
					<li>
						<Icon icon="material-symbols:key" width={20} height={20} />
						<div class="api-key-info">
							<span class="api-key-name">{key.name ?? 'bez názvu'}</span>
							<span class="api-key-meta">
								<code>{key.start}…</code>
								· vytvořen {dateFormatter.format(key.createdAt)}
								· {key.lastRequest ? `naposledy použit ${dateFormatter.format(key.lastRequest)}` : 'zatím nepoužit'}
							</span>
						</div>
						<Button.Root
							data-button-variant="ghost"
							data-button-round
							onclick={() => deleteKey(key.id, key.name)}
							aria-label="Smazat klíč"
						>
							<Icon icon="material-symbols:delete-outline" />
						</Button.Root>
					</li>
				{/each}
			</ul>
		{:else}
			<InfoBox>
				zatím nemáš žádné API klíče
			</InfoBox>
		{/if}

		<form class="create-key" onsubmit={(event) => { event.preventDefault(); createKey(); }}>
			<InputGroup label="název nového klíče">
				{#snippet children(id)}
					<input type="text" {id} bind:value={newKeyName} maxlength={32} placeholder="Externí aplikace" />
				{/snippet}
			</InputGroup>
			<Button.Root type="submit" data-button-variant="accent">
				<Icon icon={createKeyIcon} data-spin={String(createKeyAction.status === 'loading')} />
				<span>vytvořit klíč</span>
			</Button.Root>
		</form>
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

.hint {
	font-size: 0.75rem;
	opacity: 0.55;
	margin: 0;
}

.error {
	font-size: 0.75rem;
	color: var(--color-evil, #f87171);
}

section.hero {
	display: grid;
	width: 100%;
	align-content: flex-start;
	justify-items: flex-start;
}

section.active-game,
section.integration {
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

/* Mirrors the active Game card, but not a link — the partner game isn't editable here */
.partner-game {
	display: grid;
	gap: 0.2rem;
	width: 100%;
	padding: .8rem 1.6rem;
	padding-left: 1.2rem;
	border-radius: var(--border-radius);
	border-left: solid .4rem light-dark(var(--color-accent-100), var(--color-accent-800));
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));

	& .name {
		font-weight: 600;
		font-size: var(--size-md);
	}

	& .info {
		display: flex;
		gap: 0.4rem;
		font-size: var(--size-2xs);
		color: light-dark(var(--color-neutral-500), var(--color-neutral-400));

		& > span:not(:first-child)::before {
			content: '·';
			padding-right: 0.4rem;
		}
	}
}

.created-key {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--size-sm);
	margin-top: var(--size-sm);

	& code {
		word-break: break-all;
	}
}

.api-keys {
	display: grid;
	gap: var(--size-sm);
	width: 100%;
	margin: 0;
	padding: 0;
	list-style: none;

	& li {
		display: flex;
		align-items: center;
		gap: var(--size-sm);
	}
}

.api-key-info {
	display: grid;
	flex: 1;
	min-width: 0;
}

.api-key-meta {
	font-size: 0.75rem;
	opacity: 0.55;
}

.create-key {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-end;
	gap: var(--size-sm);
}
</style>
