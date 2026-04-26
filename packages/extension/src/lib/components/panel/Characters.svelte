<script lang="ts">
import Icon from '@iconify/svelte';
import { getCharactersByTeam, isScriptCharacter, TEAM_COLORS, TEAM_LABELS, TEAM_ORDER, type BotcScriptCharacter } from '@krvavy-chaos/shared/validate/script';
import { Accordion, Avatar } from 'bits-ui';
import type { ExtensionGame } from '@krvavy-chaos/shared/types/web';

let { data }: {
	data: ExtensionGame;
} = $props();

const getImageUrl = (image: BotcScriptCharacter['image']): string =>
	Array.isArray(image) ? (image[0] ?? '') : (image ?? '');

let customCharacters = $derived(data.script.filter(isScriptCharacter));
let byTeam = $derived(getCharactersByTeam(customCharacters));
let characters = $derived(new Map(customCharacters.map(character => [character.id, character])));
</script>

<div class="characters">
	{#each TEAM_ORDER as team}
		{#if byTeam.has(team)}
			<section class="team-section">
				<h3 class="team-heading" style:--team-color={TEAM_COLORS[team]}>
					{TEAM_LABELS[team]}
				</h3>
				<Accordion.Root type="single">
					{#each byTeam.get(team)! as character (character.id)}
						<Accordion.Item value={character.id}>
							<Accordion.Header>
								<Accordion.Trigger>
									<Avatar.Root>
										<Avatar.Image src={getImageUrl(character.image)} alt={character.name} />
										<Avatar.Fallback>
											<Icon icon="material-symbols:person" width={20} height={20} />
										</Avatar.Fallback>
									</Avatar.Root>
									<span class="char-name ellipsis">{character.name}</span>
									<Icon class="chevron" icon="material-symbols:expand-more" width={16} height={16} />
								</Accordion.Trigger>
							</Accordion.Header>
							<Accordion.Content>
								<p class="char-ability">{character.ability}</p>
								{#if character.flavor}
									<p class="char-flavor">„{character.flavor}"</p>
								{/if}
								{#if character.jinxes?.length}
									<ul class="char-jinxes">
										{#each character.jinxes as jinx (jinx.id)}
											{@const otherCharacter = characters.get(jinx.id)}
											<li>
												{#if otherCharacter}
													<span>jinx s postavou: <strong>{otherCharacter.name}</strong></span>
												{/if}
												<p>{jinx.reason}</p>
											</li>
										{/each}
									</ul>
								{/if}
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</section>
		{/if}
	{/each}
</div>

<style>
.characters {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	overflow-y: auto;
	padding-inline: 0.4rem;
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

/* Accordion.Root — character list */
.characters :global([data-accordion-root]) {
	display: flex;
	flex-direction: column;
}

/* Accordion.Trigger — character row */
.characters :global([data-accordion-trigger]) {
	display: grid;
	align-items: center;
	grid-template-columns: auto 1fr auto;
	gap: 0.6rem;
	padding: 0.25rem 0.4rem;
	border-radius: var(--border-radius);
	min-width: 0;
	width: 100%;
	background: transparent;
	border: none;
	cursor: pointer;
	text-align: left;

	&:hover {
		background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	}

	&:global([data-state='open']) {
		background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	}
}

.characters :global([data-accordion-item][data-state='open'] .chevron) {
	transform: rotate(180deg);
}

.characters :global([data-accordion-trigger] .chevron) {
	flex-shrink: 0;
	opacity: 0.5;
	transition: transform 0.15s;
}

.characters :global([data-accordion-trigger] [data-avatar-root]) {
	width: 2rem;
	height: 2rem;
	border-radius: var(--border-radius);
	flex-shrink: 0;
	border: none;
}

.char-name {
	flex: 1;
	min-width: 0;
	font-size: 0.9rem;
}

/* Accordion.Content — ability details */
.characters :global([data-accordion-content][data-state='open']) {
	padding: 0.4rem 0.4rem 0.6rem calc(0.4rem + 2rem + 0.6rem);
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
	overflow: hidden;
}

.char-ability {
	font-size: 0.8rem;
	line-height: 1.45;
	margin: 0;
	opacity: 0.9;
}

.char-flavor {
	font-size: 0.75rem;
	font-style: italic;
	opacity: 0.55;
	margin: 0;
}

.char-jinxes {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	font-size: 0.75rem;
	opacity: 0.75;
}
</style>
