<script lang="ts">
	import { untrack } from 'svelte';
	import { Button, Select } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import type { GameFull } from '$lib/server/db';
	import {
		getScriptMeta,
		isScriptCharacter,
		isOfficialCharacterId,
	} from '@krvavy-chaos/shared/validate/script';

	let { game }: { game: GameFull } = $props();

	const SENTINELS = ['dusk', 'dawn'];
	const SENTINEL_LABELS: Record<string, string> = { dusk: 'soumrak', dawn: 'úsvit' };
	const isSentinel = (id: string) => SENTINELS.includes(id);

	const scriptMeta = $derived(getScriptMeta(game.script)!);

	const firstNight = $derived(scriptMeta.firstNight ?? []);
	const otherNight = $derived(scriptMeta.otherNight ?? []);

	const nameMap = $derived((() => {
		const map = new Map<string, string>();
		for (const entry of game.script) {
			if (isScriptCharacter(entry)) map.set(entry.id, entry.name);
		}
		return map;
	})());

	const allIds = $derived([
		...SENTINELS,
		...game.script.filter(isScriptCharacter).map((c) => c.id),
		...game.script.filter(isOfficialCharacterId),
	]);

	const availableFirst = $derived(allIds.filter((id) => !firstNight.includes(id)));
	const availableOther = $derived(allIds.filter((id) => !otherNight.includes(id)));

	const displayName = (id: string) => SENTINEL_LABELS[id] ?? nameMap.get(id) ?? id;

	const setFirst = (arr: Array<string>) => { scriptMeta.firstNight = arr; };
	const setOther = (arr: Array<string>) => { scriptMeta.otherNight = arr; };

	const removeFrom = (arr: Array<string>, index: number) => arr.filter((_, i) => i !== index);

	const reorder = (arr: Array<string>, from: number, to: number): Array<string> => {
		if (from === to) return arr;
		const copy = [...arr];
		const [item] = copy.splice(from, 1);
		copy.splice(to, 0, item);
		return copy;
	};

	// Add select — reset to undefined after adding so the Select shows placeholder again
	let addFirst = $state<string | undefined>(undefined);
	let addOther = $state<string | undefined>(undefined);

	$effect(() => {
		const val = addFirst;
		if (val) {
			untrack(() => { scriptMeta.firstNight = [...(scriptMeta.firstNight ?? []), val]; });
			addFirst = undefined;
		}
	});

	$effect(() => {
		const val = addOther;
		if (val) {
			untrack(() => { scriptMeta.otherNight = [...(scriptMeta.otherNight ?? []), val]; });
			addOther = undefined;
		}
	});

	// Drag-and-drop
	let dragFirstFrom = $state<number | null>(null);
	let dragFirstOver = $state<number | null>(null);
	let dragOtherFrom = $state<number | null>(null);
	let dragOtherOver = $state<number | null>(null);
</script>

<h2>pořadí postav v noci</h2>

<div class="nights">
	<section class="night-panel">
		<h3>první noc</h3>
		{#if availableFirst.length > 0}
			<div class="add-row">
				<Select.Root type="single" bind:value={addFirst}>
					<Select.Trigger>
						<span>přidat postavu</span>
						<Icon icon="material-symbols:keyboard-arrow-down" />
					</Select.Trigger>
					<Select.Portal>
						<Select.Content sideOffset={4}>
							<Select.Viewport style="max-height: 16rem; overflow-y: auto;">
								{#each availableFirst as id (id)}
									<Select.Item value={id} label={displayName(id)}>
										{displayName(id)}
									</Select.Item>
								{/each}
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>
		{/if}
		<ul class="order-list">
			{#each firstNight as id, i (id + i)}
				<li
					class="order-row"
					class:is-sentinel={isSentinel(id)}
					class:is-dragging={dragFirstFrom === i}
					class:is-drag-over={dragFirstOver === i && dragFirstFrom !== i}
					draggable="true"
					ondragstart={() => { dragFirstFrom = i; }}
					ondragover={(e) => { e.preventDefault(); dragFirstOver = i; }}
					ondrop={() => { setFirst(reorder(firstNight, dragFirstFrom!, i)); dragFirstFrom = null; dragFirstOver = null; }}
					ondragend={() => { dragFirstFrom = null; dragFirstOver = null; }}
				>
					<span class="drag-handle" aria-hidden="true">
						<Icon icon="material-symbols:drag-indicator" />
					</span>
					<span class="order-index">{i + 1}.</span>
					<span class="order-name ellipsis">{displayName(id)}</span>
					<div class="order-actions">
						<Button.Root
							data-button-variant="ghost"
							data-button-round
							onclick={() => setFirst(removeFrom(firstNight, i))}
							aria-label="Odebrat"
						>
							<Icon icon="material-symbols:close" />
						</Button.Root>
					</div>
				</li>
			{/each}
		</ul>
	</section>

	<section class="night-panel">
		<h3>ostatní noci</h3>
		{#if availableOther.length > 0}
			<div class="add-row">
				<Select.Root type="single" bind:value={addOther}>
					<Select.Trigger>
						<span>přidat postavu</span>
						<Icon icon="material-symbols:keyboard-arrow-down" />
					</Select.Trigger>
					<Select.Portal>
						<Select.Content sideOffset={4}>
							<Select.Viewport style="max-height: 16rem; overflow-y: auto;">
								{#each availableOther as id (id)}
									<Select.Item value={id} label={displayName(id)}>
										{displayName(id)}
									</Select.Item>
								{/each}
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>
		{/if}
		<ul class="order-list">
			{#each otherNight as id, i (id + i)}
				<li
					class="order-row"
					class:is-sentinel={isSentinel(id)}
					class:is-dragging={dragOtherFrom === i}
					class:is-drag-over={dragOtherOver === i && dragOtherFrom !== i}
					draggable="true"
					ondragstart={() => { dragOtherFrom = i; }}
					ondragover={(e) => { e.preventDefault(); dragOtherOver = i; }}
					ondrop={() => { setOther(reorder(otherNight, dragOtherFrom!, i)); dragOtherFrom = null; dragOtherOver = null; }}
					ondragend={() => { dragOtherFrom = null; dragOtherOver = null; }}
				>
					<span class="drag-handle" aria-hidden="true">
						<Icon icon="material-symbols:drag-indicator" />
					</span>
					<span class="order-index">{i + 1}.</span>
					<span class="order-name ellipsis">{displayName(id)}</span>
					<div class="order-actions">
						<Button.Root
							data-button-variant="ghost"
							data-button-round
							onclick={() => setOther(removeFrom(otherNight, i))}
							aria-label="Odebrat"
						>
							<Icon icon="material-symbols:close" />
						</Button.Root>
					</div>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
.nights {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
	align-items: start;
	overflow-y: auto;
}

.night-panel {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	& h3 {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: light-dark(#555, #aaa);
		margin: 0;
	}
}

.add-row {
	& :global([data-select-trigger]) {
		width: 100%;
	}
}

.order-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
}

.order-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.25rem 0.5rem;
	border-radius: 0.375rem;
	cursor: default;

	&:hover {
		background: light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.06));
	}

	&.is-sentinel {
		color: light-dark(#7b4dc4, #c4a0ff);
		font-style: italic;

		& .order-index {
			color: light-dark(#7b4dc4, #c4a0ff);
			opacity: 0.7;
		}
	}

	&.is-dragging {
		opacity: 0.4;
	}

	&.is-drag-over {
		background: light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.12));
		outline: 2px solid light-dark(rgba(0, 0, 0, 0.2), rgba(255, 255, 255, 0.25));
		outline-offset: -2px;
	}
}

.drag-handle {
	display: flex;
	align-items: center;
	color: light-dark(#aaa, #666);
	cursor: grab;
	flex-shrink: 0;

	&:active {
		cursor: grabbing;
	}
}

.order-index {
	font-size: 0.75rem;
	color: light-dark(#888, #777);
	min-width: 1.5rem;
	text-align: right;
	flex-shrink: 0;
}

.order-name {
	flex: 1;
	min-width: 0;
	font-size: 0.875rem;
}

.order-actions {
	display: flex;
	gap: 0.125rem;
	flex-shrink: 0;
}
</style>