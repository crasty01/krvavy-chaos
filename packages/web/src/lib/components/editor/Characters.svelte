<script lang="ts">
	import { Button, Dialog, Select, Switch } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import ImagePreview from '$lib/components/form/ImagePreview.svelte';
	import type { GameFull } from '$lib/server/db';
	import {
		type BotcScript,
		type BotcScriptCharacter,
		TEAM_ORDER,
		TEAM_LABELS,
		TEAM_COLORS,
		isScriptCharacter,
		isOfficialCharacterId,
		getCharactersByTeam,
		type BotcCharacterTeam,
	} from '@krvavy-chaos/shared/validate/script';

	let { game }: { game: GameFull } = $props();

	const script = $derived<BotcScript>(game.script);
	const customChars = $derived(script.filter(isScriptCharacter));
	const officialIds = $derived(script.filter(isOfficialCharacterId));
	const byTeam = $derived(getCharactersByTeam(customChars));

	const goodAlignmentImagesLabels = ["obrázek pro základní tým (dobro)", "obrázek pro otočený tým (zlo)"];
	const evilAlignmentImagesLabels = ["obrázek pro základní tým (zlo)", "obrázek pro otočený tým (dobro)"];
	const travellerImagesLabels = ["obrázek pro neutrální tým", "obrázek pro dobrý tým", "obrázek pro zlý tým"];
	const basicImagesLabels = ["obrázek pro neutrální tým"];

	const imageLabelsByTeam: Record<BotcCharacterTeam, Array<string>> = {
		townsfolk: goodAlignmentImagesLabels,
		outsider: goodAlignmentImagesLabels,
		minion: evilAlignmentImagesLabels,
		demon: evilAlignmentImagesLabels,
		traveller: travellerImagesLabels,
		fabled: basicImagesLabels,
		loric: basicImagesLabels,
	}

	const removeEntry = (entry: BotcScriptCharacter | string) => {
		game.script = game.script.filter((item) => item !== (entry as unknown));
	};

	
	let editOpen = $state(false);
	let editTarget = $state<BotcScriptCharacter | null>(null);
	let draft = $state<BotcScriptCharacter | null>(null);
	let newReminder = $state('');
	let newReminderGlobal = $state('');

	const openEdit = (char: BotcScriptCharacter) => {
		editTarget = char;
		draft = {
			...char,
			reminders: [...(char.reminders ?? [])],
			remindersGlobal: [...(char.remindersGlobal ?? [])],
		};
		newReminder = '';
		newReminderGlobal = '';
		editOpen = true;
	};

	const confirmEdit = () => {
		if (!draft || !editTarget) return;
		const index = (game.script).indexOf(editTarget);
		if (index !== -1) (game.script)[index] = { ...draft };
		editOpen = false;
		editTarget = null;
		draft = null;
	};

	const cancelEdit = () => {
		editOpen = false;
		editTarget = null;
		draft = null;
	};

	const addReminder = () => {
		if (!draft || !newReminder.trim()) return;
		draft.reminders = [...(draft.reminders ?? []), newReminder.trim()];
		newReminder = '';
	};

	const removeReminder = (index: number) => {
		if (!draft) return;
		draft.reminders = draft.reminders?.filter((_reminder, reminderIdx) => reminderIdx !== index);
	};

	const addReminderGlobal = () => {
		if (!draft || !newReminderGlobal.trim()) return;
		draft.remindersGlobal = [...(draft.remindersGlobal ?? []), newReminderGlobal.trim()];
		newReminderGlobal = '';
	};

	const removeReminderGlobal = (index: number) => {
		if (!draft) return;
		draft.remindersGlobal = draft.remindersGlobal?.filter((_reminder, reminderIdx) => reminderIdx !== index);
	};

	const getImageUrl = (image: BotcScriptCharacter['image']): string =>
		Array.isArray(image) ? (image[0] ?? '') : (image ?? '');

	const getImageAtIndex = (image: BotcScriptCharacter['image'], index: number): string => {
		if (Array.isArray(image)) return image[index] ?? '';
		return index === 0 ? (image ?? '') : '';
	};

	const updateImageUrl = (character: BotcScriptCharacter, index: number, value: string) => {
		const slotCount = character.team === 'traveller' ? 3 : 2;
		const slots = Array.isArray(character.image)
			? [...character.image]
			: character.image ? [character.image] : [];
		while (slots.length < slotCount) slots.push('');
		slots[index] = value;
		while (slots.length > 0 && !slots[slots.length - 1]) slots.pop();
		character.image = slots.length === 0 ? undefined : slots.length === 1 ? slots[0] : slots;
	};

	
	const addCustom = () => {
		const newChar: BotcScriptCharacter = {
			id: `custom-${Date.now()}`,
			name: 'Nová postava',
			team: 'townsfolk',
			ability: '',
			reminders: [],
			remindersGlobal: [],
			setup: false,
		};
		game.script = [...game.script, newChar];
		openEdit(newChar);
	};
</script>

<header>
	<div class="lead">
		<h2>postavy</h2>
	</div>
	<div class="tail">
		<div class="actions">
			<Button.Root data-button-variant="outline" onclick={addCustom}>
				<Icon icon="material-symbols:add" />
				<span>přidat vlastní postavu</span>
			</Button.Root>
		</div>
	</div>
</header>

<div class="characters">
	{#each TEAM_ORDER as team}
		{#if byTeam.has(team)}
			<section class="team-section">
				<h3 class="team-heading" style:--team-color={TEAM_COLORS[team]}>
					{TEAM_LABELS[team]}
				</h3>
				<ul class="character-list">
					{#each byTeam.get(team)! as char (char.id)}
						<li class="character-row">
							{#if char.image}
								<img src={getImageUrl(char.image)} alt={char.name} class="char-img" />
							{:else}
								<div class="char-img-placeholder">
									<Icon icon="material-symbols:person" width={20} height={20} />
								</div>
							{/if}
							<span class="char-name ellipsis">{char.name}</span>
							<div class="char-actions">
								<Button.Root
									data-button-variant="ghost"
									data-button-round
									onclick={() => openEdit(char)}
									aria-label="Upravit postavu"
								>
									<Icon icon="material-symbols:edit" />
								</Button.Root>
								<Button.Root
									data-button-variant="ghost"
									data-button-round
									onclick={() => removeEntry(char)}
									aria-label="Odebrat postavu"
								>
									<Icon icon="material-symbols:close" />
								</Button.Root>
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	{/each}

	{#if officialIds.length > 0}
		<section class="team-section">
			<h3 class="team-heading" style="--team-color: light-dark(#666, #999)">
				Oficiální postavy
			</h3>
			<div class="official-pills">
				{#each officialIds as id (id)}
					<div class="official-pill">
						<span>{id}</span>
						<Button.Root
							data-button-variant="ghost"
							data-button-round
							onclick={() => removeEntry(id)}
							aria-label="Odebrat"
						>
							<Icon icon="material-symbols:close" />
						</Button.Root>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>


<Dialog.Root bind:open={editOpen}>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			{#if draft}
			{@const char = draft as BotcScriptCharacter}
				<header class="modal-header">
					<Dialog.Title>upravit postavu</Dialog.Title>
					<Dialog.Close>
						{#snippet child({ props })}
							<Button.Root {...props} data-button-variant="ghost" data-button-round>
								<Icon icon="material-symbols:close" />
							</Button.Root>
						{/snippet}
					</Dialog.Close>
				</header>

				<div class="edit-form">
					<InputGroup label="id" isVertical>
						{#snippet child(id)}
							<input type="text" {id} bind:value={char.id} />
						{/snippet}
					</InputGroup>

					<InputGroup label="název" isVertical>
						{#snippet child(id)}
							<input type="text" {id} bind:value={char.name} />
						{/snippet}
					</InputGroup>

					<InputGroup label="tým" isVertical>
						{#snippet children(id)}
							<Select.Root type="single" bind:value={char.team as string}>
								<Select.Trigger {id}>
									<span>{char.team ? TEAM_LABELS[char.team] : 'vybrat tým'}</span>
									<Icon icon="material-symbols:keyboard-arrow-down" />
								</Select.Trigger>
								<Select.Portal>
									<Select.Content sideOffset={4}>
											<Select.Viewport style="max-height: 16rem; overflow-y: auto;">
											{#each TEAM_ORDER as team}
												<Select.Item value={team} label={TEAM_LABELS[team]}>
													{TEAM_LABELS[team]}
												</Select.Item>
											{/each}
										</Select.Viewport>
									</Select.Content>
								</Select.Portal>
							</Select.Root>
						{/snippet}
					</InputGroup>

					<InputGroup label="schopnost" isVertical isTextarea>
						{#snippet child(id)}
							<textarea {id} bind:value={char.ability}></textarea>
						{/snippet}
					</InputGroup>

					{#each imageLabelsByTeam[char.team] as imageLabel, imageIndex}
						<InputGroup label={imageLabel} isVertical>
							{#snippet child(id)}
								<input
									type="text"
									{id}
									value={getImageAtIndex(char.image, imageIndex)}
									oninput={(event) => updateImageUrl(char, imageIndex, event.currentTarget.value)}
								/>
							{/snippet}
							{#snippet tail()}
								{#if getImageAtIndex(char.image, imageIndex)}
									<ImagePreview src={getImageAtIndex(char.image, imageIndex)} />
								{/if}
							{/snippet}
						</InputGroup>
					{/each}

					<InputGroup label="popis" isVertical isTextarea>
						{#snippet child(id)}
							<textarea {id} bind:value={char.flavor}></textarea>
						{/snippet}
					</InputGroup>

					<div class="field-group">
						<InputGroup label="připomínky" isVertical>
							{#snippet child(id)}
								<input
									type="text"
									{id}
									bind:value={newReminder}
									placeholder="přidat…"
									onkeydown={(event) => event.key === 'Enter' && addReminder()}
								/>
							{/snippet}
							{#snippet tail()}
								<Button.Root
									data-button-variant="ghost"
									data-button-round
									onclick={addReminder}
									aria-label="Přidat"
								>
									<Icon icon="material-symbols:add" />
								</Button.Root>
							{/snippet}
						</InputGroup>
						<div class="tag-list">
							{#each char.reminders ?? [] as reminder, index}
								<div class="tag">
									<span>{reminder}</span>
									<Button.Root
										data-button-variant="ghost"
										data-button-round
										onclick={() => removeReminder(index)}
											aria-label="Odebrat"
									>
										<Icon icon="material-symbols:close" />
									</Button.Root>
								</div>
							{/each}
						</div>
					</div>

					<div class="field-group">
						<InputGroup label="globální připomínky (i když charakter není ve hře)" isVertical>
							{#snippet child(id)}
								<input
									type="text"
									{id}
									bind:value={newReminderGlobal}
									placeholder="přidat…"
									onkeydown={(event) => event.key === 'Enter' && addReminderGlobal()}
								/>
							{/snippet}
							{#snippet tail()}
								<Button.Root
									data-button-variant="ghost"
									data-button-round
									onclick={addReminderGlobal}
									aria-label="Přidat"
								>
									<Icon icon="material-symbols:add" />
								</Button.Root>
							{/snippet}
						</InputGroup>
						<div class="tag-list">
							{#each char.remindersGlobal ?? [] as reminder, index}
								<div class="tag">
									<span>{reminder}</span>
									<Button.Root
										data-button-variant="ghost"
										data-button-round
										onclick={() => removeReminderGlobal(index)}
											aria-label="Odebrat"
									>
										<Icon icon="material-symbols:close" />
									</Button.Root>
								</div>
							{/each}
						</div>
					</div>

					<div class="field-group field-group--inline">
						<span class="field-label">zasahuje do přípravy hry:</span>
						<Switch.Root
							bind:checked={() => (char.setup ?? false), (val) => { char.setup = val; }}
						>
							<Switch.Thumb />
						</Switch.Root>
					</div>
				</div>

				<footer class="modal-footer">
					<Button.Root data-button-variant="ghost" onclick={cancelEdit}>zrušit</Button.Root>
					<Button.Root data-button-variant="accent" onclick={confirmEdit}>
						uložit změny
					</Button.Root>
				</footer>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
header {
	display: flex;
	align-items: center;
	grid-area: 1rem;
	justify-content: space-between;
}


.characters {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	overflow-y: auto;
	padding-inline: 0.4rem;
	/* margin-inline: -0.4rem; */
}

.team-section {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.team-heading {
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--team-color);
	padding-block: 0.25rem;
	border-bottom: 2px solid var(--team-color);
	margin-bottom: 0.2rem;
}

.character-list {
	display: flex;
	flex-direction: column;
	list-style: none;
	padding: 0;
	margin: 0;
}

.character-row {
	display: grid;
	align-items: center;
	grid-template-columns: auto 1fr auto;
	gap: 0.6rem;
	padding: 0.25rem 0.4rem;
	border-radius: var(--border-radius);
	min-width: 0;

	&:hover {
		background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	}
}

.char-img,
.char-img-placeholder {
	width: 2rem;
	height: 2rem;
	border-radius: var(--border-radius);
	flex-shrink: 0;
}

.char-img {
	object-fit: cover;
}

.char-img-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: light-dark(var(--color-neutral-200), var(--color-neutral-700));
	color: light-dark(var(--color-neutral-500), var(--color-neutral-400));
}

.char-name {
	flex: 1;
	min-width: 0;
	font-size: 0.9rem;
}

.char-actions {
	display: flex;
	gap: 0.15rem;
	flex-shrink: 0;
}


.official-pills {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem;
}

.official-pill {
	display: flex;
	align-items: center;
	gap: 0.1rem;
	padding: 0.15rem 0.2rem 0.15rem 0.6rem;
	border-radius: 9999px;
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	border: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	font-size: 0.8rem;
}


.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.9rem 1.2rem;
	border-bottom: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	flex-shrink: 0;

	:global([data-dialog-title]) {
		font-size: var(--size-sm);
		font-weight: 700;
	}
}

.edit-form {
	flex: 1;
	overflow-y: auto;
	padding: 1.2rem;
	display: flex;
	flex-direction: column;
	gap: 0.9rem;

	:global(textarea) {
		all: unset;
		width: 100%;
		min-height: 4.5rem;
		resize: vertical;
		box-sizing: border-box;
	}
}


.field-group {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;

	&.field-group--inline {
		flex-direction: row;
		align-items: center;
		gap: 0.8rem;
	}
}

.field-label {
	font-size: 0.8rem;
	color: light-dark(var(--color-neutral-600), var(--color-neutral-400));
}

.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem;
	align-items: center;
}

.tag {
	display: flex;
	align-items: center;
	gap: 0.1rem;
	padding: 0.1rem 0.15rem 0.1rem 0.5rem;
	border-radius: 9999px;
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	border: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	font-size: var(--size-xs);
}

.modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	padding: 0.9rem 1.2rem;
	border-top: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	flex-shrink: 0;
}
</style>
