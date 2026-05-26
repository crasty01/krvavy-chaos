<script lang="ts">
import Icon from '@iconify/svelte';
import { isScriptCharacter, type BotcScriptCharacter } from '@krvavy-chaos/shared/validate/script';
import { Avatar } from 'bits-ui';
import { getAlignedCharacterImage } from '@krvavy-chaos/shared/utils/script';
import type { ExtensionGame } from '@krvavy-chaos/shared/types/web';
import { viewerPreference, playerGuesses } from '../../stores/preference.svelte';
import CharacterPicker from '../form/CharacterPicker.svelte';

let { data }: {
	data: ExtensionGame;
} = $props();

const ALIGNMENT_LABELS: Record<string, string> = { good: 'dobro', evil: 'zlo', neutral: 'neutrál' };

const getImageUrl = (image: BotcScriptCharacter['image']): string =>
	Array.isArray(image) ? (image[0] ?? '') : (image ?? '');

let allCharacters = $derived(data.script.filter(isScriptCharacter) as Array<BotcScriptCharacter>);
let characterMap = $derived(
	new Map(allCharacters.map(c => [c.id, c]))
);
</script>

<div class="players">
	<ol class="player-list">
		{#each data.gamePlayers as gamePlayer (gamePlayer.id)}
			{@const character = gamePlayer.characterId ? characterMap.get(gamePlayer.characterId) : null}
			<li class="player-row">
				<span class="seat-index">{gamePlayer.seatOrder + 1}</span>
				{#if viewerPreference.value === 'predict'}
					{@const guessId = playerGuesses.getGuess(gamePlayer.playerId)}
					{@const guessChar = guessId ? characterMap.get(guessId) : null}
					<CharacterPicker
						characters={allCharacters}
						selectedId={guessId}
						onselect={(id) => {
							if (id) playerGuesses.setGuess(gamePlayer.playerId, id);
							else playerGuesses.clearGuess(gamePlayer.playerId);
						}}
					>
						{#snippet children(props)}
							<span class="guess-avatar-trigger" {...props}>
								<Avatar.Root>
									{#if guessChar}
										<Avatar.Image src={getImageUrl(guessChar.image)} alt={guessChar.name} />
									{/if}
									<Avatar.Fallback>
										<Icon icon="material-symbols:person" width={20} height={20} />
									</Avatar.Fallback>
								</Avatar.Root>
								<span class="guess-edit-hint" aria-hidden="true">
									<Icon icon="material-symbols:edit" width={10} height={10} />
								</span>
							</span>
						{/snippet}
					</CharacterPicker>
					<div class="player-info">
						<span class="player-name">{gamePlayer.player.name}</span>
						<span class="player-guess">
							{#if guessChar}
								<em>{guessChar.name}</em>
							{:else}
								&nbsp;
							{/if}
						</span>
					</div>
				{:else}
					<Avatar.Root>
						{#if character && viewerPreference.value === 'reveal'}
							<Avatar.Image
								src={getAlignedCharacterImage(character, gamePlayer) ?? getImageUrl(character.image)}
								alt={character.name}
							/>
						{/if}
						<Avatar.Fallback>
							<Icon icon="material-symbols:person" width={20} height={20} />
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="player-info">
						<span class="player-name">{gamePlayer.player.name}</span>
						{#if character && viewerPreference.value === 'reveal'}
							<span class="player-character">
								{character.name}
								{#if gamePlayer.alignment}
									<span class="player-alignment" data-alignment={gamePlayer.alignment}>
										({ALIGNMENT_LABELS[gamePlayer.alignment] ?? gamePlayer.alignment})
									</span>
								{/if}
							</span>
						{/if}
					</div>
				{/if}
				{#if gamePlayer.profileUrl}
					<a
						href={gamePlayer.profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="profile-link"
						title="Profil hráče"
					>
						<Icon icon="material-symbols:open-in-new" width={16} height={16} />
					</a>
				{/if}
			</li>
		{/each}
	</ol>
</div>

<style>
.players {
	overflow-y: auto;
	padding-inline: 0.4rem;
}

.player-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
}

.player-row {
	display: grid;
	align-items: center;
	grid-template-columns: 1.5rem 2rem 1fr auto;
	gap: 0.6rem;
	padding: 0.25rem 0.4rem;
	border-radius: var(--border-radius);
	min-width: 0;

	&:hover {
		background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	}
}

.player-row :global([data-avatar-root]) {
	width: 2rem;
	height: 2rem;
	border-radius: var(--border-radius);
	flex-shrink: 0;
	border: none;
}

.seat-index {
	font-size: 0.7rem;
	font-weight: 600;
	opacity: 0.4;
	text-align: right;
	font-variant-numeric: tabular-nums;
}

.player-info {
	display: flex;
	flex-direction: column;
	gap: 0.1rem;
	min-width: 0;
}

.player-name {
	font-size: 0.875rem;
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.player-character {
	font-size: 0.72rem;
	opacity: 0.6;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.player-alignment {
	&[data-alignment='good'] { color: var(--color-good, #4ade80); }
	&[data-alignment='evil'] { color: var(--color-evil, #f87171); }
	&[data-alignment='neutral'] { color: var(--color-neutral, #a3a3a3); }
}

.player-guess {
	font-size: 0.72rem;
	opacity: 0.6;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	em {
		font-style: italic;
	}
}

.picker-trigger {
	display: contents;
}

.guess-avatar-trigger {
	position: relative;
	display: inline-flex;
	cursor: pointer;
	border-radius: var(--border-radius);

	& :global([data-avatar-root]) {
		width: 2rem;
		height: 2rem;
	}

	&:hover .guess-edit-hint,
	&:focus-visible .guess-edit-hint {
		opacity: 1;
	}
}

.guess-edit-hint {
	position: absolute;
	bottom: -0.2rem;
	right: -0.2rem;
	width: 0.9rem;
	height: 0.9rem;
	background-color: light-dark(var(--color-neutral-200), var(--color-neutral-700));
	border: 1px solid light-dark(var(--color-neutral-300), var(--color-neutral-600));
	border-radius: 50%;
	display: grid;
	place-items: center;
	opacity: 0.55;
	transition: opacity 0.15s;
	pointer-events: none;
}

.profile-link {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	flex-shrink: 0;
	border-radius: var(--border-radius);
	opacity: 0.55;
	color: inherit;
	text-decoration: none;
	transition: opacity 0.12s;

	&:hover {
		opacity: 1;
	}
}
</style>
