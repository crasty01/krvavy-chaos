<script module lang="ts">
import { loadIcons } from '@iconify/svelte';

loadIcons([
	"material-symbols:settings",
	"material-symbols:manage-accounts",
	"material-symbols:person",
	"material-symbols:groups",
	"material-symbols:import-export",
	"material-symbols:save",
	"material-symbols:cast",
	"material-symbols:progress-activity",
	"material-symbols:check-circle",
	"material-symbols:cancel",
	"material-symbols:close",
	"material-symbols:add",
	"material-symbols:edit",
	"material-symbols:drag-indicator",
	"material-symbols:keyboard-arrow-down",
	"material-symbols:moon-stars",
	"material-symbols:file-export-rounded",
]);
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { untrack } from 'svelte';
	import { Button, Tabs } from 'bits-ui';
	import * as Editor from '$lib/components/editor';
	import { createAsyncAction } from '$lib/functions/async.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let game = $state(untrack(() => data.game));
	let allPlayers = $state(untrack(() => data.allPlayers));
	const platforms = untrack(() => data.platforms);

	let tabs = $state([
		{
			key: "general",
			label: "obecné",
			icon: "material-symbols:settings",
			component: Editor.General,
		},
		{
			key: "editors",
			label: "editoři",
			icon: "material-symbols:manage-accounts",
			component: Editor.Editors,
		},
		{
			key: "characters",
			label: "postavy",
			icon: "material-symbols:person",
			component: Editor.Characters,
		},
		{
			key: "night",
			label: "noc",
			icon: "material-symbols:moon-stars",
			component: Editor.NightOrder,
		},
		{
			key: "players",
			label: "hráči",
			icon: "material-symbols:groups",
			component: Editor.Players,
		},
		{
			key: "import-export",
			label: "import/export",
			icon: "material-symbols:file-export-rounded",
			component: Editor.ImportExport,
		},
	]);

	let selectedTabkey = $state(tabs[0].key);

	const saveAction = createAsyncAction({ minLoading: 200, minSuccess: 1500, minError: 2500 });
	const activateAction = createAsyncAction({ minLoading: 200, minSuccess: 1500, minError: 2500 });

	const STATUS_ICONS = {
		loading: 'material-symbols:progress-activity',
		success: 'material-symbols:check-circle',
		error: 'material-symbols:cancel',
	} as const;

	const saveIcon = $derived(saveAction.status === 'idle' ? 'material-symbols:save' : STATUS_ICONS[saveAction.status]);
	const activateIcon = $derived(activateAction.status === 'idle' ? 'material-symbols:cast' : STATUS_ICONS[activateAction.status]);

	const save = () => saveAction.trigger(async () => {
		const res = await fetch(`/api/games/${game.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: game.name,
				script: game.script,
				editors: game.editors.map((e) => e.userId),
				players: game.gamePlayers.map((gp) => ({
					playerId: gp.playerId,
					seatOrder: gp.seatOrder,
					characterId: gp.characterId ?? null,
					alignment: gp.alignment ?? null,
				})),
			}),
		});
		if (!res.ok) throw new Error();
	});

	const activate = () => activateAction.trigger(async () => {
		const res = await fetch(`/api/games/${game.id}/activate`, { method: 'POST' });
		if (!res.ok) throw new Error();
	});
</script>

<svelte:head>
	<title>{game.name}</title>
</svelte:head>

<section class="page editor">
	<header>
		<div class="lead">
			<h1>editor hry</h1>
		</div>
		<div class="tail">
			<Button.Root data-button-variant="outline" onclick={save}>
				<Icon icon={saveIcon} data-spin={String(saveAction.status === 'loading')} />
				<span>uložit</span>
			</Button.Root>
			<Button.Root data-button-variant="accent" onclick={activate}>
				<Icon icon={activateIcon} data-spin={String(activateAction.status === 'loading')} />
				<span>aktivovat</span>
			</Button.Root>
		</div>
	</header>

	<Tabs.Root value={selectedTabkey} orientation="vertical">
		<Tabs.List>
			{#each tabs as tab (tab.key)}
				<Tabs.Trigger value={tab.key}>
					{#snippet child({ props })}
						<Button.Root data-button-variant={props["data-state"] === "active" ? "accent" : "ghost"} {...props}>
							<Icon icon={tab.icon} />
							<span>{tab.label}</span>
						</Button.Root>
					{/snippet}
				</Tabs.Trigger>
			{/each}


		</Tabs.List>
		
		{#each tabs as tab (tab.key)}
			<Tabs.Content value={tab.key}>
				<tab.component {game} {allPlayers} {platforms} />
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</section>

<style>
.page {
	display: grid;
	align-content: stretch;
	grid-template-rows: auto 1fr;
	gap: 2rem;
	height: 100%;
	overflow-y: auto;
}

header {
	display: flex;
	justify-content: space-between;
	align-items: center;

	& .lead, & .tail {
		display: flex;
		gap: 0.2rem;
	}
}

:global(.editor) {
	& [data-tabs-root] {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2rem;
		overflow: hidden;
		height: 100%;
	}

	& [data-tabs-list] {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	& [data-tabs-trigger] {
		min-width: 16rem;
		cursor: pointer;
		display: flex;
	}

	& [data-tabs-content] {
		overflow-y: auto;
		height: 100%;
		/* display: flex; */
		flex-direction: column;
		gap: 2rem;
	}

	& [data-tabs-content][data-state="active"] {
		display: flex;
		height: 100%;
	}
}
</style>
