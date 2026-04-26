<script lang="ts">
import * as Panel from '../panel';
import Icon from '@iconify/svelte';
import { Button, Tabs } from 'bits-ui';
import { game } from '../../functions/game.svelte';

let tabs = $state([
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
]);

let selectedTabkey = $state(tabs[0].key);
let gameData = $derived(game.data);
</script>

{#if gameData}
	<div class="panel-anchor">
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
	</div>
{/if}

<style>
.panel-anchor {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	background-color: light-dark(var(--color-neutral-50), var(--color-neutral-900));

	& :global([data-tabs-root]) {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
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
		width: 9rem;
		position: absolute;
		right: 0;
		transition: translate 250ms ease-in-out;
		border-top-left-radius: 0;
		border-top-left-radius: 0;
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
</style>
