<script module lang="ts">
import { loadIcons } from '@iconify/svelte';

loadIcons([
	"material-symbols:settings",
	"material-symbols:manage-accounts",
	"material-symbols:person",
	"material-symbols:groups",
]);
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button, Tabs } from 'bits-ui';
	import * as Editor from '$lib/components/editor';
	import type { PageData } from './$types';
	import Breadcrumbs from '$lib/components/utils/Breadcrumbs.svelte';

	let { data }: { data: PageData } = $props();

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
	]);

	let selectedTabkey = $state(tabs[0].key);
	
	$inspect(data);
</script>

<svelte:head>
	<title>{data.game.name}</title>
</svelte:head>

<section class="page editor">
	<header>
		<div class="lead">
			<h1>editor hry</h1>
		</div>
		<div class="tail">
			<span>save?</span>
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
				<tab.component game={data.game} />
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
		overflow: auto;
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
