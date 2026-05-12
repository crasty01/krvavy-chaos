<script lang="ts">
import * as Panel from '../panel';
import Icon from '@iconify/svelte';
import { Button, Tabs } from 'bits-ui';
import { game } from '../../functions/game.svelte';
import SpoilerGate from '../SpoilerGate.svelte';
import { viewerPreference, overlayVisibility } from '../../stores/preference.svelte';
import { twitchStore } from '../../services/twitch.svelte';
import { createAsyncAction } from '../../functions/async.svelte';

const tabs = [
	{
		key: "characters",
		label: "postavy",
		icon: "material-symbols:person",
		component: Panel.Characters,
	},
	{
		key: "night",
		label: "noc",
		icon: "material-symbols:moon-stars",
		component: Panel.NightOrder,
	},
	{
		key: "players",
		label: "hráči",
		icon: "material-symbols:groups",
		component: Panel.Players,
	},
	{
		key: "settings",
		label: "nastavení",
		icon: "material-symbols:tune",
		component: Panel.Settings,
	},
	{
		key: "about",
		label: "o aplikaci",
		icon: "material-symbols:info",
		component: Panel.About,
	},
];

let selectedTabkey = $state(tabs[0].key);
let gameData = $derived(game.data);
let anchor = $derived(twitchStore.urlParams.anchor);

let revealAction = createAsyncAction({ minLoading: 5000, minSuccess: 0, minError: 0 });
const revealCharacters = () => {
	if (revealAction.status !== 'loading') {
		revealAction.trigger(async () => {});
	} else {
		viewerPreference.choose('reveal');
	}
};
</script>

<div class="panel-anchor">
	{#if gameData}
		<header class="panel-header">
			<div class="lead">
				<span class="panel-header-game">{gameData.name}</span>
				<span class="panel-header-host">{gameData.creator.name}</span>
			</div>
			<div class="tail">
				{#if viewerPreference.value === 'predict'}
					<Button.Root data-button-variant="ghost" onclick={revealCharacters}>
					{#if revealAction.status !== 'loading'}
							<span>odhalit postavy</span>
						{:else}
							<Icon icon="material-symbols:progress-activity" data-spin="true" />
							<span>opravdu?</span>
						{/if}
					</Button.Root>
				{/if}
				{#if anchor === 'video_overlay' && viewerPreference.value === 'reveal'}
					<Button.Root data-button-variant="ghost" onclick={overlayVisibility.toggle} aria-label={overlayVisibility.hidden ? 'Zobrazit overlay' : 'Skrýt overlay'}>
						<Icon icon={overlayVisibility.hidden ? 'material-symbols:visibility-off' : 'material-symbols:visibility'} width={16} height={16} />
					</Button.Root>
				{/if}
			</div>
		</header>
		{#if viewerPreference.value === 'undecided' && anchor !== 'video_overlay'}
			<SpoilerGate variant="panel" />
		{:else}
			<Tabs.Root value={selectedTabkey} orientation="vertical">
				<Tabs.List>
					{#each tabs as tab (tab.key)}
						<Tabs.Trigger value={tab.key}>
							{#snippet child({ props })}
								<div class="tab-trigger">
									<Button.Root data-button-variant={props["data-state"] === "active" ? "accent" : "ghost"} {...props}>
										<span>{tab.label}</span>
										<Icon icon={tab.icon} />
									</Button.Root>
								</div>
							{/snippet}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>

				{#each tabs as tab (tab.key)}
					<Tabs.Content value={tab.key}>
						<tab.component data={gameData} />
					</Tabs.Content>
				{/each}
			</Tabs.Root>
		{/if}
	{:else}
		<div class="empty-state">
			<Icon icon="material-symbols:water-drop" width={32} height={32} />
			<span>Žádná aktivní hra</span>
		</div>
	{/if}
</div>

<style>
.panel-anchor {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: light-dark(var(--color-neutral-50), var(--color-neutral-900));
	border-top-right-radius: var(--border-radius);
	border-bottom-right-radius: var(--border-radius);
	overflow: hidden;
}

.panel-header {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	padding: 0.625rem 0.75rem 0.5rem;
	border-bottom: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-800));
	flex-shrink: 0;

	& .lead {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	& .tail {
		display: flex;
		flex-direction: row;
		gap: 0.125rem;

		& :global([data-button-root]) {
			font-size: var(--size-2xs);
		}
	}
}

.panel-header-game {
	font-size: 0.875rem;
	font-weight: 600;
	line-height: 1.2;
}

.panel-header-host {
	font-size: 0.75rem;
	opacity: 0.6;
	line-height: 1.2;
}

.panel-anchor {
	& :global([data-tabs-root]) {
		display: flex;
		flex-direction: row;
		width: 100%;
		flex: 1;
		min-height: 0;
	}

	& :global([data-tabs-list]) {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		padding-block: 0.6rem;
		overflow-x: visible;
		z-index: 10;
	}

	& .tab-trigger {
		width: 3rem;
		height: 3rem;
		position: relative;
	}

	& :global([data-tabs-trigger]) {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-inline: 1rem;
		height: 100%;
		width: 10rem;
		position: absolute;
		right: 0;
		transition: translate 250ms ease-in-out;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		background-color: light-dark(var(--color-neutral-200), var(--color-neutral-800));

		& > :global(svg) {
			flex-shrink: 0;
		}

		&:hover {
			translate: calc(100% - 3rem);
			color: var(--color-text, #fff);
			background-color: light-dark(var(--color-neutral-300), var(--color-neutral-700));
		}

		&:global([data-state='active']) {
			color: var(--color-text, #fff);
			background-color: light-dark(var(--color-accent-400), var(--color-accent-600));
		}
	}

	& :global([data-tabs-content]) {
		flex: 1;
		overflow-y: auto;
		padding: 0.75rem;
	}
}

.empty-state {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	color: light-dark(var(--color-neutral-500), var(--color-neutral-400));
	font-size: 0.875rem;
}
</style>
