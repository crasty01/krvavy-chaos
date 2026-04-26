<script lang="ts">
import { Button } from 'bits-ui';
import Icon from '@iconify/svelte';
import AvatarWithLabel from '$lib/components/utils/AvatarWithLabel.svelte';
import InputGroup from '$lib/components/form/InputGroup.svelte';
import InfoBox from '$lib/components/utils/InfoBox.svelte';
import type { GameFull, User } from '$lib/server/db';

let { game }: {
	game: GameFull;
} = $props();

const isCreator = $derived(game.creator.id === game.createdBy);

const removeEditor = (userId: string) => {
	game.editors = game.editors.filter((e) => e.userId !== userId);
};

let searchQuery = $state('');
let searchResults = $state<Array<User>>([]);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const updateSuggestions = async () => {
	const limit = 8 + game.editors.length;
	const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}`);
	if (res.ok) {
		const all: Array<User> = await res.json();
		searchResults = all.filter((u) => !alreadyEditor(u.id)).slice(0, 8);
	}
}

const onSearchInput = () => {
	if (searchTimeout) clearTimeout(searchTimeout);
	if (!searchQuery.trim()) {
		searchResults = [];
		return;
	}
	searchTimeout = setTimeout(updateSuggestions, 250);
};

const addEditor = (user: User) => {
	game.editors = [...game.editors, { gameId: game.id, userId: user.id, user }];
	updateSuggestions();
};

const alreadyEditor = (userId: string) =>
	userId === game.createdBy || game.editors.some((e) => e.userId === userId);
</script>

<h2>editoři</h2>

<div class="editors">
	{#if isCreator}
		<section class="editor-search">
			<InputGroup label="přidat editora" isVertical>
				{#snippet child(id)}
					<input
						type="search"
						{id}
						bind:value={searchQuery}
						oninput={onSearchInput}
						placeholder="hledat uživatele"
						autocomplete="off"
					/>
				{/snippet}
			</InputGroup>

			{#if searchResults.length > 0}
				<ul class="search-results">
					{#each searchResults as user (user.id)}
						<li>
							<AvatarWithLabel src={user.image} name={user.name} />
							<Button.Root
								data-button-variant="ghost"
								data-button-round
								onclick={() => addEditor(user)}
								aria-label="Přidat editora"
							>
								<Icon icon="material-symbols:add" />
							</Button.Root>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	{:else}
		<InfoBox>
			Editory může spravovat pouze tvůrce hry.
		</InfoBox>
	{/if}

	<section class="editor-list">
		<div class="editor-pill creator">
			<AvatarWithLabel src={game.creator.image} name={game.creator.name} />
			<span class="badge">tvůrce</span>
		</div>
		{#each game.editors as editor (editor.userId)}
			<div class="editor-pill">
				<AvatarWithLabel src={editor.user.image} name={editor.user.name} />
				{#if isCreator}
					<Button.Root
						data-button-variant="ghost"
						data-button-round
						onclick={() => removeEditor(editor.userId)}
						aria-label="Odebrat editora"
					>
						<Icon icon="material-symbols:close" />
					</Button.Root>
				{/if}
			</div>
		{/each}
	</section>
</div>

<style>
.editors {
	display: grid;
	grid-template-columns: 18rem 1fr;
	gap: 3rem;
	align-items: start;
}

.editor-list {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.5rem;
	padding-top: 1.6rem;
}

.editor-pill {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.25rem 0.6rem 0.25rem 0.35rem;
	border-radius: 9999px;
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	border: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
}

.creator {
	opacity: 0.6;
}

.badge {
	font-size: 0.75rem;
	padding: 0.1rem 0.5rem;
	border-radius: 9999px;
	background-color: light-dark(var(--color-neutral-200), var(--color-neutral-700));
	color: light-dark(var(--color-neutral-600), var(--color-neutral-300));
}

.editor-search {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.search-results {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.2rem;

	& li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.2rem 0.4rem;
		border-radius: 0.4rem;

		&:hover {
			background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
		}

		& :global([data-button-root]) {
			margin-left: auto;
		}
	}
}

input {
	all: unset;
	width: 100%;
}
</style>

