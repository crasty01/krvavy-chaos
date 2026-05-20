<script lang="ts">
import Icon from '@iconify/svelte';
import { getScriptMeta, isScriptCharacter, type BotcScriptCharacter } from '@krvavy-chaos/shared/validate/script';
import { Avatar, Button } from 'bits-ui';
import type { ExtensionGame } from '@krvavy-chaos/shared/types/web';

let { data }: {
	data: ExtensionGame;
} = $props();

const SENTINEL_LABELS: Record<string, string> = {
	dusk: 'soumrak',
	dawn: 'úsvit',
	minioninfo: 'informace pro přisluhovače',
	demoninfo: 'informace pro démona',
};

const getImageUrl = (image: BotcScriptCharacter['image']): string =>
	Array.isArray(image) ? (image[0] ?? '') : (image ?? '');

const cleanReminder = (reminder: string): string =>
	reminder.replace(/:reminder:/ig, '').trim();

let meta = $derived(getScriptMeta(data.script));
let characterMap = $derived(
	new Map(data.script.filter(isScriptCharacter).map(c => [c.id, c]))
);

let firstNight = $derived(meta?.firstNight ?? []);
let otherNight = $derived(meta?.otherNight ?? []);

let activeTab = $state<'first' | 'other'>('first');
</script>

<div class="night-order">
	<div class="tab-bar" role="tablist">
		<Button.Root
			role="tab"
			class="tab-btn"
			data-button-variant={activeTab === "first" ? 'accent' : 'outline'}
			aria-selected={activeTab === 'first'}
			onclick={() => (activeTab = 'first')}
		>
			první noc
		</Button.Root>
		<Button.Root
			role="tab"
			class="tab-btn"
			data-button-variant={activeTab === "other" ? 'accent' : 'outline'}
			aria-selected={activeTab === 'other'}
			onclick={() => (activeTab = 'other')}
		>
			ostatní noci
		</Button.Root>
	</div>

	{#if activeTab === 'first'}
		<ol class="order-list">
			{#each firstNight as id, i (id + i)}
				{@const character = characterMap.get(id)}
				{@const isSentinel = id in SENTINEL_LABELS}
				<li class="order-row" class:is-sentinel={isSentinel}>
					<span class="order-index">{i + 1}</span>
					{#if isSentinel}
						<span class="sentinel-name">{SENTINEL_LABELS[id]}</span>
					{:else if character}
						<Avatar.Root>
							<Avatar.Image src={getImageUrl(character.image)} alt={character.name} />
							<Avatar.Fallback>
								<Icon icon="material-symbols:person" width={20} height={20} />
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="order-info">
							<span class="order-name">{character.name}</span>
							{#if character.firstNightReminder}
							<span class="order-reminder">{cleanReminder(character.firstNightReminder)}</span>
							{/if}
						</div>
					{:else}
						<span class="order-name unknown">{id}</span>
					{/if}
				</li>
			{/each}
		</ol>
	{:else}
		<ol class="order-list">
			{#each otherNight as id, i (id + i)}
				{@const character = characterMap.get(id)}
				{@const isSentinel = id in SENTINEL_LABELS}
				<li class="order-row" class:is-sentinel={isSentinel}>
					<span class="order-index">{i + 1}</span>
					{#if isSentinel}
						<span class="sentinel-name">{SENTINEL_LABELS[id]}</span>
					{:else if character}
						<Avatar.Root>
							<Avatar.Image src={getImageUrl(character.image)} alt={character.name} />
							<Avatar.Fallback>
								<Icon icon="material-symbols:person" width={20} height={20} />
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="order-info">
							<span class="order-name">{character.name}</span>
							{#if character.otherNightReminder}
							<span class="order-reminder">{cleanReminder(character.otherNightReminder)}</span>
							{/if}
						</div>
					{:else}
						<span class="order-name unknown">{id}</span>
					{/if}
				</li>
			{/each}
		</ol>
	{/if}
</div>

<style>
.night-order {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	overflow-y: auto;
}

.tab-bar {
	display: flex;
	gap: 1rem;
	padding-inline: 0.4rem;
}

.night-order :global(.tab-btn) {
	width: 100%;
	justify-content: center;
}

.order-list {
	list-style: none;
	padding: 0 0.4rem;
	margin: 0;
	display: flex;
	flex-direction: column;
}

.order-row {
	display: grid;
	align-items: flex-start;
	grid-template-columns: 1.5rem auto 1fr;
	gap: 0.6rem;
	padding: 0.25rem 0.4rem;
	border-radius: var(--border-radius);
	min-width: 0;

	&:hover {
		background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	}

	&.is-sentinel {
		grid-template-columns: 1.5rem 1fr;
		opacity: 0.5;
	}
}

.order-row :global([data-avatar-root]) {
	width: 2rem;
	height: 2rem;
	border-radius: var(--border-radius);
	flex-shrink: 0;
	border: none;
}

.order-index {
	line-height: 0.875rem;
	font-size: 0.7rem;
	font-weight: 600;
	opacity: 0.4;
	text-align: right;
	font-variant-numeric: tabular-nums;
}

.sentinel-name {
	line-height: 0.875rem;
	font-size: 0.8rem;
	font-style: italic;
	opacity: 0.7;
}

.order-info {
	display: flex;
	flex-direction: column;
	gap: 0.1rem;
	min-width: 0;
}

.order-name {
	line-height: 0.875rem;
	font-size: 0.875rem;
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	&.unknown {
		opacity: 0.4;
		font-style: italic;
	}
}

.order-reminder {
	font-size: 0.72rem;
	line-height: 1.35;
	opacity: 0.6;
}
</style>