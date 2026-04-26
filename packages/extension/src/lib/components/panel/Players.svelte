<script lang="ts">
import Icon from '@iconify/svelte';
import { isScriptCharacter, type BotcScriptCharacter } from '@krvavy-chaos/shared/validate/script';
import { Avatar } from 'bits-ui';
import { getAlignedCharacterImage } from '@krvavy-chaos/shared/utils/script';
import type { ExtensionGame } from '@krvavy-chaos/shared/types/web';

let { data }: {
	data: ExtensionGame;
} = $props();

const ALIGNMENT_LABELS: Record<string, string> = { good: 'dobro', evil: 'zlo', neutral: 'neutrál' };

const getImageUrl = (image: BotcScriptCharacter['image']): string =>
	Array.isArray(image) ? (image[0] ?? '') : (image ?? '');

let characterMap = $derived(
	new Map(data.script.filter(isScriptCharacter).map(c => [c.id, c]))
);
let platformMap = $derived(new Map(data.platforms.map(p => [p.id, p])));

const buildUrl = (urlTemplate: string | null, handle: string): string | null => {
	if (!urlTemplate) return null;
	return urlTemplate.replace('{handle}', handle);
};
</script>

<div class="players">
	<ol class="player-list">
		{#each data.gamePlayers as gp (gp.id)}
			{@const character = gp.characterId ? characterMap.get(gp.characterId) : null}
			<li class="player-row">
				<span class="seat-index">{gp.seatOrder + 1}</span>
				<Avatar.Root>
					{#if character}
						<Avatar.Image
							src={getAlignedCharacterImage(character, gp) ?? getImageUrl(character.image)}
							alt={character.name}
						/>
					{/if}
					<Avatar.Fallback>
						<Icon icon="material-symbols:person" width={20} height={20} />
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="player-info">
					<span class="player-name">{gp.player.name}</span>
					{#if character}
						<span class="player-character">
							{character.name}
							{#if gp.alignment}
								<span class="player-alignment" data-alignment={gp.alignment}>
									({ALIGNMENT_LABELS[gp.alignment] ?? gp.alignment})
								</span>
							{/if}
						</span>
					{/if}
				</div>
				{#if gp.player.socialLinks.length}
					<div class="player-links">
						{#each [...gp.player.socialLinks].sort((a, b) => a.platformId.localeCompare(b.platformId)) as link (link.id)}
							{@const platform = platformMap.get(link.platformId)}
							{@const url = buildUrl(platform?.urlTemplate ?? null, link.handle)}
							{#if url}
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									class="social-link"
									title="{platform?.name ?? link.platformId}: {link.handle}"
								>
									{#if platform?.icon}
										<Icon icon={platform.icon} width={16} height={16} />
									{:else}
										<Icon icon="material-symbols:link" width={16} height={16} />
									{/if}
								</a>
							{/if}
						{/each}
					</div>
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

.player-links {
	display: flex;
	gap: 0.2rem;
	flex-shrink: 0;
}

.social-link {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
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
