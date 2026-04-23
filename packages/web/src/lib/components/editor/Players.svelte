<script lang="ts">
	import { untrack } from 'svelte';
	import { Button, Select } from 'bits-ui';
	import {
		getScriptCharacters,
		isOfficialCharacterId,
	} from '@krvavy-chaos/shared/validate/script';
	import Icon from '@iconify/svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import EditorDialog from '$lib/components/form/EditorDialog.svelte';
	import Pill from '$lib/components/form/Pill.svelte';
	import type { GameFull, Player, PlayerSocialLink, Platform } from '$lib/server/db';
	import type { BotcAlignment } from '@krvavy-chaos/shared/validate/script';

	let { game, allPlayers: initialPlayers = [], platforms }: {
		game: GameFull;
		allPlayers: Array<Player>;
		platforms: Array<Platform>;
	} = $props();

	const scriptChars = $derived(getScriptCharacters(game.script));
	const officialIds = $derived(game.script.filter(isOfficialCharacterId));

	let allPlayers = $state(untrack(() => initialPlayers));

	const availablePlayers = $derived(
		allPlayers.filter((p) => !game.gamePlayers.some((gp) => gp.playerId === p.id))
	);

	let addPlayerId = $state<string | undefined>(undefined);

	$effect(() => {
		const id = addPlayerId;
		if (!id) return;
		untrack(() => {
			const found = allPlayers.find((p) => p.id === id);
			if (!found) return;
			game.gamePlayers = [
				...game.gamePlayers,
				{
					id: crypto.randomUUID(),
					gameId: game.id,
					playerId: id,
					seatOrder: game.gamePlayers.length,
					characterId: null,
					alignment: null,
					player: found,
				},
			];
			addPlayerId = undefined;
		});
	});

	const removePlayer = (index: number) => {
		const updated = game.gamePlayers.filter((_, i) => i !== index);
		game.gamePlayers = updated.map((gp, i) => ({ ...gp, seatOrder: i }));
	};

	let dragFrom = $state<number | null>(null);
	let dragOver = $state<number | null>(null);

	const reorder = (from: number, to: number) => {
		const copy = [...game.gamePlayers];
		const [item] = copy.splice(from, 1);
		copy.splice(to, 0, item);
		game.gamePlayers = copy.map((gp, i) => ({ ...gp, seatOrder: i }));
	};

	const ALIGNMENT_LABELS: Record<string, string> = {
		good: 'dobrý',
		neutral: 'neutrální',
		evil: 'zlý',
	};
	const ALIGNMENTS: Array<BotcAlignment> = ['good', 'neutral', 'evil'];

	const charLabel = (id: string | null) =>
		id ? (scriptChars.find((c) => c.id === id)?.name ?? id) : 'bez postavy';

	const alignmentLabel = (a: BotcAlignment | null) =>
		a ? (ALIGNMENT_LABELS[a] ?? a) : '—';

	type PlayerFull = Player & { socialLinks: Array<PlayerSocialLink> };

	let editOpen = $state(false);
	let isNewPlayer = $state(false);
	let editPlayer = $state<PlayerFull | null>(null);
	let editDraftName = $state('');
	let savingPlayer = $state(false);

	let pendingLinks = $state<Array<{ id: string; platformId: string; handle: string }>>([]);
	let newLinkPlatformId = $state<string | undefined>(platforms[0]?.id);
	let newLinkHandle = $state('');
	let addingLink = $state(false);

	const openCreateDialog = () => {
		isNewPlayer = true;
		editPlayer = null;
		editDraftName = '';
		pendingLinks = [];
		newLinkPlatformId = platforms[0]?.id;
		newLinkHandle = '';
		editOpen = true;
	};

	const openEditDialog = async (p: Player) => {
		const res = await fetch(`/api/players/${p.id}`);
		if (!res.ok) return;
		const full: PlayerFull = await res.json();
		isNewPlayer = false;
		editPlayer = full;
		editDraftName = full.name;
		newLinkPlatformId = platforms[0]?.id;
		newLinkHandle = '';
		editOpen = true;
	};

	const confirmEdit = async () => {
		savingPlayer = true;
		try {
			if (isNewPlayer) {
				const trimmed = editDraftName.trim();
				if (!trimmed) return;
				const res = await fetch('/api/players', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name: trimmed }),
				});
				if (!res.ok) return;
				const created: Player = await res.json();
				for (const link of pendingLinks) {
					await fetch(`/api/players/${created.id}/social-links`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ platformId: link.platformId, handle: link.handle }),
					});
				}
				allPlayers = [...allPlayers, created];
				game.gamePlayers = [
					...game.gamePlayers,
					{
						id: crypto.randomUUID(),
						gameId: game.id,
						playerId: created.id,
						seatOrder: game.gamePlayers.length,
						characterId: null,
						alignment: null,
						player: created,
					},
				];
			} else if (editPlayer) {
				const trimmed = editDraftName.trim();
				if (trimmed && trimmed !== editPlayer.name) {
					const res = await fetch(`/api/players/${editPlayer.id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ name: trimmed }),
					});
					if (!res.ok) return;
					const updated: Player = await res.json();
					allPlayers = allPlayers.map((p) => p.id === updated.id ? updated : p);
					game.gamePlayers = game.gamePlayers.map((gp) =>
						gp.playerId === updated.id ? { ...gp, player: updated } : gp
					);
				}
			}
			editOpen = false;
			editPlayer = null;
		} finally {
			savingPlayer = false;
		}
	};

	const cancelEdit = () => {
		editOpen = false;
		editPlayer = null;
	};

	const addLink = async () => {
		if (!newLinkPlatformId || !newLinkHandle.trim()) return;
		if (isNewPlayer) {
			pendingLinks = [...pendingLinks, { id: crypto.randomUUID(), platformId: newLinkPlatformId, handle: newLinkHandle.trim() }];
			newLinkPlatformId = platforms[0]?.id;
			newLinkHandle = '';
			return;
		}
		if (!editPlayer) return;
		addingLink = true;
		try {
			const res = await fetch(`/api/players/${editPlayer.id}/social-links`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ platformId: newLinkPlatformId, handle: newLinkHandle.trim() }),
			});
			if (!res.ok) return;
			const link: PlayerSocialLink = await res.json();
			editPlayer = { ...editPlayer, socialLinks: [...editPlayer.socialLinks, link] };
			newLinkPlatformId = platforms[0]?.id;
			newLinkHandle = '';
		} finally {
			addingLink = false;
		}
	};

	const removeLink = async (linkId: string) => {
		if (isNewPlayer) {
			pendingLinks = pendingLinks.filter((l) => l.id !== linkId);
			return;
		}
		if (!editPlayer) return;
		const res = await fetch(`/api/players/${editPlayer.id}/social-links/${linkId}`, {
			method: 'DELETE',
		});
		if (!res.ok) return;
		editPlayer = { ...editPlayer, socialLinks: editPlayer.socialLinks.filter((l) => l.id !== linkId) };
	};

	const platformName = (platformId: string) =>
		platforms.find((p) => p.id === platformId)?.name ?? platformId;
	const platformIcon = (platformId: string) =>
		platforms.find((p) => p.id === platformId)?.icon ?? null;
	const platformUrlPrefix = (platformId: string) => {
		const tmpl = platforms.find((p) => p.id === platformId)?.urlTemplate;
		return tmpl ? tmpl.replace(/\{handle\}.*$/, '') : null;
	};

	const activeLinks = $derived(isNewPlayer ? pendingLinks : (editPlayer?.socialLinks ?? []));
</script>

<header>
	<div class="lead">
		<h2>hráči</h2>
	</div>
	<div class="tail">
		<Button.Root data-button-variant="outline" onclick={openCreateDialog}>
			<Icon icon="material-symbols:add" />
			<span>nový hráč</span>
		</Button.Root>
	</div>
</header>

<div class="players-editor">
	<p>První hráč sedí nahoře, ostatní pokračují ve směru hodinových ručiček.</p>
		
	{#if availablePlayers.length > 0}
		<div class="add-existing">
			<Select.Root type="single" bind:value={addPlayerId}>
				<Select.Trigger>
					<span>přidat hráče ze seznamu</span>
					<Icon icon="material-symbols:keyboard-arrow-down" />
				</Select.Trigger>
				<Select.Portal>
					<Select.Content sideOffset={4}>
						<Select.Viewport style="max-height: 16rem; overflow-y: auto;">
							{#each availablePlayers as p (p.id)}
								<Select.Item value={p.id} label={p.name}>{p.name}</Select.Item>
							{/each}
						</Select.Viewport>
					</Select.Content>
				</Select.Portal>
			</Select.Root>
		</div>
	{/if}

	{#if game.gamePlayers.length > 0}
		<ul class="player-list">
			{#each game.gamePlayers as gp, i (gp.id)}
				<li
					class="player-row"
					class:is-dragging={dragFrom === i}
					class:is-drag-over={dragOver === i && dragFrom !== i}
					draggable="true"
					ondragstart={() => { dragFrom = i; }}
					ondragover={(e) => { e.preventDefault(); dragOver = i; }}
					ondrop={() => { reorder(dragFrom!, i); dragFrom = null; dragOver = null; }}
					ondragend={() => { dragFrom = null; dragOver = null; }}
				>
					<span class="drag-handle" aria-hidden="true">
						<Icon icon="material-symbols:drag-indicator" />
					</span>
					<span class="seat-index">{i + 1}.</span>
					<span class="player-name ellipsis">{gp.player.name}</span>

					<div class="player-selects">
						<Select.Root
							type="single"
							value={gp.characterId ?? undefined}
							onValueChange={(val) => { gp.characterId = val || null; }}
						>
							<Select.Trigger>
								<span class="ellipsis">{charLabel(gp.characterId)}</span>
								<Icon icon="material-symbols:keyboard-arrow-down" />
							</Select.Trigger>
							<Select.Portal>
								<Select.Content sideOffset={4}>
									<Select.Viewport style="max-height: 16rem; overflow-y: auto;">
										<Select.Item value="" label="bez postavy">bez postavy</Select.Item>
										{#each scriptChars as char (char.id)}
											<Select.Item value={char.id} label={char.name}>{char.name}</Select.Item>
										{/each}
										{#each officialIds as id (id)}
											<Select.Item value={id} label={id}>{id}</Select.Item>
										{/each}
									</Select.Viewport>
								</Select.Content>
							</Select.Portal>
						</Select.Root>

						<Select.Root
							type="single"
							value={gp.alignment ?? undefined}
							onValueChange={(val) => { gp.alignment = (val as BotcAlignment) || null; }}
						>
							<Select.Trigger>
								<span>{alignmentLabel(gp.alignment)}</span>
								<Icon icon="material-symbols:keyboard-arrow-down" />
							</Select.Trigger>
							<Select.Portal>
								<Select.Content sideOffset={4}>
									<Select.Viewport>
										<Select.Item value="" label="—">—</Select.Item>
										{#each ALIGNMENTS as a (a)}
											<Select.Item value={a} label={ALIGNMENT_LABELS[a]}>
												{ALIGNMENT_LABELS[a]}
											</Select.Item>
										{/each}
									</Select.Viewport>
								</Select.Content>
							</Select.Portal>
						</Select.Root>
					</div>

					<div class="row-actions">
						<Button.Root
							data-button-variant="ghost"
							data-button-round
							onclick={() => openEditDialog(gp.player)}
							aria-label="Upravit hráče"
						>
							<Icon icon="material-symbols:edit" />
						</Button.Root>
						<Button.Root
							data-button-variant="ghost"
							data-button-round
							onclick={() => removePlayer(i)}
							aria-label="Odebrat hráče"
						>
							<Icon icon="material-symbols:close" />
						</Button.Root>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<EditorDialog
	bind:open={editOpen}
	title={isNewPlayer ? 'nový hráč' : (editPlayer?.name ?? '')}
	onconfirm={confirmEdit}
	oncancel={cancelEdit}
	confirmDisabled={savingPlayer}
>
	{#if isNewPlayer || editPlayer}
		<InputGroup label="jméno">
			{#snippet child(id)}
				<input type="text" {id} bind:value={editDraftName} />
			{/snippet}
		</InputGroup>

		{#if platforms.length > 0}
			<div class="editor-field-group">
				<span class="editor-field-label">sociální sítě:</span>

				<div class="add-link-form">
					<Select.Root type="single" bind:value={newLinkPlatformId}>
						<Select.Trigger>
							<span>{newLinkPlatformId ? platformName(newLinkPlatformId) : 'platforma'}</span>
							<Icon icon="material-symbols:keyboard-arrow-down" />
						</Select.Trigger>
						<Select.Portal>
							<Select.Content sideOffset={4}>
								<Select.Viewport style="max-height: 12rem; overflow-y: auto;">
									{#each platforms as p (p.id)}
										<Select.Item value={p.id} label={p.name}>{p.name}</Select.Item>
									{/each}
								</Select.Viewport>
							</Select.Content>
						</Select.Portal>
					</Select.Root>
					<InputGroup label="handle" isHiddenLabel>
						{#snippet lead()}
							{#if newLinkPlatformId && platformUrlPrefix(newLinkPlatformId)}
								<span class="url-prefix">{platformUrlPrefix(newLinkPlatformId)}</span>
							{/if}
						{/snippet}
						{#snippet child(id)}
							<input
								type="text"
								{id}
								bind:value={newLinkHandle}
								placeholder="handle"
								onkeydown={(e) => { if (e.key === 'Enter') addLink(); }}
								disabled={addingLink}
							/>
						{/snippet}
						{#snippet tail()}
							<Button.Root
								data-button-variant="outline"
								onclick={addLink}
								disabled={!newLinkPlatformId || !newLinkHandle.trim() || addingLink}
								aria-label="Přidat odkaz"
								style="border-top-left-radius: 0; border-bottom-left-radius: 0;"
							>
								<Icon icon="material-symbols:add" />
							</Button.Root>
						{/snippet}
					</InputGroup>
				</div>

				{#if activeLinks.length > 0}
					<ul class="link-list">
						{#each activeLinks as link (link.id)}
							<li>
								<Pill onremove={() => removeLink(link.id)}>
									{#if platformIcon(link.platformId)}
										<Icon icon={platformIcon(link.platformId)!} width={14} height={14} />
									{:else}
										<Icon icon="material-symbols:link" width={14} height={14} />
									{/if}
									<span class="link-handle">{link.handle}</span>
								</Pill>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	{/if}
</EditorDialog>

<style>
header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.players-editor {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.add-existing {
	& :global([data-select-trigger]) {
		width: 100%;
	}
}


.player-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
}

.player-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.25rem 0.5rem;
	border-radius: 0.375rem;
	cursor: default;

	&:hover {
		background: light-dark(hsl(from var(--color-neutral-950) h s l / 4%), hsl(from var(--color-neutral-50) h s l / 6%));
	}

	&.is-dragging {
		opacity: 0.4;
	}

	&.is-drag-over {
		background: light-dark(hsl(from var(--color-neutral-950) h s l / 8%), hsl(from var(--color-neutral-50) h s l / 12%));
		outline: 2px solid light-dark(hsl(from var(--color-neutral-950) h s l / 20%), hsl(from var(--color-neutral-50) h s l / 25%));
		outline-offset: -2px;
	}
}

.drag-handle {
	display: flex;
	align-items: center;
	color: light-dark(var(--color-neutral-400), var(--color-neutral-500));
	cursor: grab;
	flex-shrink: 0;

	&:active {
		cursor: grabbing;
	}
}

.seat-index {
	font-size: 0.75rem;
	color: light-dark(var(--color-neutral-500), var(--color-neutral-400));
	min-width: 1.5rem;
	text-align: right;
	flex-shrink: 0;
}

.player-name {
	flex: 1;
	min-width: 0;
	font-size: 0.875rem;
}

.player-selects {
	display: flex;
	gap: 0.5rem;
	flex-shrink: 0;
}

.row-actions {
	display: flex;
	gap: 0.125rem;
	flex-shrink: 0;
}


.link-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.375rem;
}

.link-handle {
	font-size: 0.8rem;
	max-width: 12rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.add-link-form {
	display: flex;
	gap: 0.5rem;
	align-items: center;

	& :global(.input-group-wrapper) {
		flex: 1;
		min-width: 0;
	}
}

.url-prefix {
	font-size: var(--size-xs);
	color: light-dark(var(--color-neutral-500), var(--color-neutral-400));
	white-space: nowrap;
}
</style>
