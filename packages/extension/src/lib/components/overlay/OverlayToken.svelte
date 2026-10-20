<script module lang="ts">
import { game } from '../../functions/game.svelte';
import type { BotcScript, BotcScriptCharacter } from '@krvavy-chaos/shared/validate/script';

const characterFilter = (item: BotcScript[number]): item is BotcScriptCharacter => {
	return typeof item !== 'string' && item.id !== '_meta';
} 

let gameData = $derived(game.data);
let characters = $derived(new Map(gameData?.script.filter(characterFilter).map(character => [character.id, character])));
</script>

<script lang="ts">
import { Tooltip, Avatar, type TooltipTether } from 'bits-ui';
import Icon from '@iconify/svelte';
import type { ExtensionGamePlayer } from '@krvavy-chaos/shared/types/web';
import type { CharacterTooltipPayload } from '.';
import { tokenStyle } from '../../stores/preference.svelte';

const getImageUrl = (image: BotcScriptCharacter['image']): string =>
	Array.isArray(image) ? (image[0] ?? '') : (image ?? '');

let { gamePlayer, numberOfSeats, seatIndex, characterTether }: {
	gamePlayer: ExtensionGamePlayer;
	numberOfSeats: number;
	seatIndex: number;
	characterTether: TooltipTether<CharacterTooltipPayload>;
} = $props();

let character = $derived(gamePlayer.characterId ? characters.get(gamePlayer.characterId) : undefined);
</script>

{#if character && tokenStyle.value !== 'none'}
	<div
		class="overlay__character"
		data-character-alignment={gamePlayer.alignment}
		style:--rotation="{(360 / numberOfSeats) * seatIndex}deg"
	>
		<Tooltip.Trigger tether={characterTether} payload={{ character, gamePlayer }}>
			{#snippet child({ props })}
				<div
					{...props}
					class="overlay__character-token"
				>
					{#if tokenStyle.value === 'icon'}
						<Avatar.Root class="overlay__character-avatar">
							<Avatar.Image src={getImageUrl(character.image)} alt={character.name} />
							<Avatar.Fallback data-no-border>
								<Icon icon="material-symbols:person" width="55%" height="55%" />
							</Avatar.Fallback>
						</Avatar.Root>
					{/if}
					<span class="sr-only">{character.name}</span>
				</div>
			{/snippet}
		</Tooltip.Trigger>
	</div>
{/if}

<style>
.overlay__character {
	position: absolute;
	top: 0;
	left: 50%;
	bottom: 50%;
	transform-origin: bottom center;
	rotate: var(--rotation);


	&[data-character-alignment="neutral"] {
		--color: oklch(from var(--color-accent-600) l 0 h);
	}

	&[data-character-alignment="good"] {
		--color: oklch(from var(--color-accent-600) l c 255);
	}

	&[data-character-alignment="evil"] {
		--color: oklch(from var(--color-accent-600) l c 25);
	}
}

.overlay__character-token {
	width: var(--token-size);
	height: var(--token-size);
	border-radius: var(--token-size);
	position: absolute;
	left: 0;
	right: 0;
	transform: translate(-50%,-50%) rotate(calc(var(--rotation) * -1));
	background-color: var(--color);
	overflow: hidden;
	opacity: var(--token-opacity, 1);
	transition: opacity 0.15s;

	&:hover, &:focus-visible {
		opacity: 1;
		box-shadow: 0 0 0.6rem 0 hsla(from var(--color) h s l / 0.4);
	}
}

:global(.overlay__character-avatar) {
	width: 100%;
	height: 100%;
	border-radius: inherit;

	& :global([data-avatar-fallback]) {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}
}
</style>