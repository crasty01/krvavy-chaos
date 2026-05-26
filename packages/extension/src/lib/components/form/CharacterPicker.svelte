<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Popover, Avatar } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import {
		getCharactersByTeam,
		TEAM_ORDER,
		TEAM_LABELS,
		TEAM_COLORS,
		type BotcScriptCharacter,
	} from '@krvavy-chaos/shared/validate/script';

	let {
		characters,
		selectedId = null,
		onselect,
		children: trigger,
	}: {
		characters: Array<BotcScriptCharacter>;
		selectedId?: string | null;
		onselect: (id: string | null) => void;
		children: Snippet<[Record<string, unknown>]>;
	} = $props();

	let open = $state(false);
	let search = $state('');
	let searchInput = $state<HTMLInputElement>();

	let filtered = $derived(
		search.trim()
			? characters.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
			: characters,
	);
	let byTeam = $derived(getCharactersByTeam(filtered));

	const getImageUrl = (image: BotcScriptCharacter['image']): string =>
		Array.isArray(image) ? (image[0] ?? '') : (image ?? '');

	const select = (id: string | null) => {
		onselect(id);
		open = false;
	};

	$effect(() => {
		if (!open) search = '';
	});
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="picker-content"
			sideOffset={8}
			onOpenAutoFocus={(e) => { e.preventDefault(); searchInput?.focus(); }}
		>
			<div class="picker-search">
				<Icon icon="material-symbols:search" width={14} height={14} class="picker-search-icon" />
				<input
					bind:this={searchInput}
					type="text"
					placeholder="Hledat postavu…"
					bind:value={search}
					class="picker-search-input"
				/>
			</div>
			<div class="picker-list" role="listbox" aria-label="Výběr postavy">
				<button
					class="picker-option picker-clear"
					role="option"
					aria-selected={selectedId === null}
					onclick={() => select(null)}
				>
					<span class="picker-option-icon">
						<Icon icon="material-symbols:close" width={14} height={14} />
					</span>
					<span>Žádná postava</span>
					{#if selectedId === null}
						<Icon icon="material-symbols:check" width={14} height={14} class="picker-check" />
					{/if}
				</button>
				{#each TEAM_ORDER as team}
					{#if byTeam.has(team)}
						<div class="picker-team-label" style:--team-color={TEAM_COLORS[team]}>
							{TEAM_LABELS[team]}
						</div>
						{#each byTeam.get(team)! as character (character.id)}
							<button
								class="picker-option"
								class:picker-option--selected={character.id === selectedId}
								role="option"
								aria-selected={character.id === selectedId}
								onclick={() => select(character.id)}
							>
								<Avatar.Root class="picker-avatar">
									<Avatar.Image src={getImageUrl(character.image)} alt={character.name} />
									<Avatar.Fallback>
										<Icon icon="material-symbols:person" width={14} height={14} />
									</Avatar.Fallback>
								</Avatar.Root>
								<span class="picker-option-name">{character.name}</span>
								{#if character.id === selectedId}
									<Icon icon="material-symbols:check" width={14} height={14} class="picker-check" />
								{/if}
							</button>
						{/each}
					{/if}
				{/each}
				{#if filtered.length === 0}
					<p class="picker-empty">Žádná postava nenalezena.</p>
				{/if}
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>

<style>
:global(.picker-content) {
	background-color: light-dark(var(--color-neutral-50), var(--color-neutral-900));
	border: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	border-radius: var(--border-radius);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	width: 14rem;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	z-index: 9999;
}

.picker-search {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.5rem 0.6rem;
	border-bottom: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	flex-shrink: 0;
}

:global(.picker-search-icon) {
	opacity: 0.5;
	flex-shrink: 0;
}

.picker-search-input {
	flex: 1;
	background: none;
	border: none;
	outline: none;
	font-size: 0.8rem;
	color: inherit;
	min-width: 0;

	&::placeholder {
		opacity: 0.4;
	}
}

.picker-list {
	overflow-y: auto;
	max-height: 14rem;
	padding: 0.25rem;
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.picker-team-label {
	font-size: 0.65rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--team-color);
	padding: 0.4rem 0.5rem 0.2rem;
	opacity: 0.8;
}

.picker-option {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.3rem 0.5rem;
	border-radius: calc(var(--border-radius) - 2px);
	border: none;
	background: none;
	color: inherit;
	font-size: 0.8rem;
	text-align: left;
	cursor: pointer;
	width: 100%;

	&:hover, &:focus-visible {
		background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
		outline: none;
	}

	&.picker-option--selected {
		background-color: light-dark(var(--color-neutral-200), var(--color-neutral-700));
	}
}

.picker-clear {
	color: inherit;
	opacity: 0.6;
	margin-bottom: 0.25rem;
	border-bottom: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	border-radius: 0;
	padding-bottom: 0.4rem;
	margin-bottom: 0.25rem;
}

.picker-option-icon {
	width: 1.25rem;
	height: 1.25rem;
	display: grid;
	place-items: center;
	flex-shrink: 0;
}

.picker-option-name {
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

:global(.picker-avatar) {
	width: 1.25rem;
	height: 1.25rem;
	border-radius: 50%;
	flex-shrink: 0;
	font-size: 0.7rem;
}

:global(.picker-check) {
	flex-shrink: 0;
	opacity: 0.7;
}

.picker-empty {
	font-size: 0.75rem;
	opacity: 0.5;
	text-align: center;
	padding: 0.75rem;
	margin: 0;
}
</style>
