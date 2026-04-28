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
import { Tooltip, type TooltipTether } from 'bits-ui';
import type { ExtensionGamePlayer } from '@krvavy-chaos/shared/types/web';
import type { CharacterTooltipPayload } from '.';

let { gamePlayer, numberOfSeats, seatIndex, characterTether }: {
	gamePlayer: ExtensionGamePlayer;
	numberOfSeats: number;
	seatIndex: number;
	characterTether: TooltipTether<CharacterTooltipPayload>;
} = $props();

let character = $derived(gamePlayer.characterId ? characters.get(gamePlayer.characterId) : undefined);
</script>

{#if character}
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
					<span class="sr-only">character token</span>
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
	transform: translate(-50%, -50%);
	/* border: 2px solid var(--color-neutral-900); */
	background-color: hsla(from var(--color) h s l / 0.2);

	&:hover, &:focus-visible {
		background-color: hsla(from var(--color) h s l / 0.4);
		box-shadow: 0 0 0.6rem 0 hsla(from var(--color) h s l / 0.4);
	}
}
</style>