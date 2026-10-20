<script lang="ts">
	import { game } from '../../functions/game.svelte';
	import Icon from '@iconify/svelte';
	import { Avatar, Tooltip, mergeProps, type TooltipTether } from 'bits-ui';
	import CharacterPicker from '../form/CharacterPicker.svelte';
	import { isScriptCharacter, type BotcScriptCharacter } from '@krvavy-chaos/shared/validate/script';
	import type { ExtensionGamePlayer } from '@krvavy-chaos/shared/types/web';
	import { tokenStyle } from '../../stores/preference.svelte';
	import type { CharacterTooltipPayload } from '.';

	let { gamePlayer, numberOfSeats, seatIndex, guessId, onguess, characterTether }: {
		gamePlayer: ExtensionGamePlayer;
		numberOfSeats: number;
		seatIndex: number;
		guessId: string | null;
		onguess: (characterId: string | null) => void;
		characterTether?: TooltipTether<CharacterTooltipPayload>;
	} = $props();

	let gameData = $derived(game.data);
	let scriptCharacters = $derived(
		(gameData?.script.filter(isScriptCharacter) ?? []) as Array<BotcScriptCharacter>,
	);
	let characterMap = $derived(new Map(scriptCharacters.map((c) => [c.id, c])));
	let guessCharacter = $derived(guessId ? characterMap.get(guessId) : undefined);

	const getImageUrl = (image: BotcScriptCharacter['image']): string =>
		Array.isArray(image) ? (image[0] ?? '') : (image ?? '');
</script>

{#snippet pickerTrigger(extraProps: Record<string, unknown>)}
	<CharacterPicker characters={scriptCharacters} selectedId={guessId} onselect={onguess}>
		{#snippet children(popoverProps)}
			<div class="overlay__guess-token" {...mergeProps(popoverProps, extraProps)} title={guessCharacter?.name ?? 'Hádat postavu'}>
				{#if guessCharacter && tokenStyle.value === 'icon'}
					<Avatar.Root class="overlay__guess-avatar" data-no-border>
						<Avatar.Image src={getImageUrl(guessCharacter.image)} alt={guessCharacter.name} />
						<Avatar.Fallback data-no-border>
							<Icon icon="material-symbols:person" width="55%" height="55%" />
						</Avatar.Fallback>
					</Avatar.Root>
				{:else if !guessCharacter && tokenStyle.value === 'icon'}
					<Icon icon="material-symbols:person" class="overlay__guess-placeholder-icon" width="55%" height="55%" />
				{/if}
				<span class="overlay__guess-edit" aria-hidden="true">
					<Icon icon="material-symbols:edit" width="70%" height="70%" />
				</span>
			</div>
		{/snippet}
	</CharacterPicker>
{/snippet}

{#if tokenStyle.value !== 'none'}
<div
	class="overlay__guess"
	data-guessed={!!guessCharacter}
	style:--rotation="{(360 / numberOfSeats) * seatIndex}deg"
>
	{#if guessCharacter && characterTether}
		<Tooltip.Trigger tether={characterTether} payload={{ character: guessCharacter, gamePlayer }}>
			{#snippet child({ props: tooltipProps })}
				{@render pickerTrigger(tooltipProps)}
			{/snippet}
		</Tooltip.Trigger>
	{:else}
		{@render pickerTrigger({})}
	{/if}
</div>
{/if}

<style>
.overlay__guess {
	position: absolute;
	top: 0;
	left: 50%;
	bottom: 50%;
	transform-origin: bottom center;
	rotate: var(--rotation);
}

.overlay__guess-token {
	width: var(--token-size);
	height: var(--token-size);
	border-radius: var(--token-size);
	position: absolute;
	left: 0;
	right: 0;
	transform: translate(-50%,-50%) rotate(calc(var(--rotation) * -1));
	display: grid;
	place-items: center;
	overflow: visible;
	cursor: pointer;
	background-color: var(--color-neutral-700);
	border: 1.5px solid var(--color-neutral-500);
	opacity: var(--token-opacity, 1);
	transition: background-color 0.15s, box-shadow 0.15s, opacity 0.15s;

	&:hover,
	&:focus-visible {
		opacity: 1;
		background-color: var(--color-neutral-600);
		box-shadow: 0 0 0.5rem 0 hsla(from var(--color-neutral-500) h s l / 0.35);
		outline: none;

		.overlay__guess-edit {
			opacity: 1;
		}
	}
}

.overlay__guess[data-guessed='true'] .overlay__guess-token {
	border-style: solid;
	border-color: var(--color-accent-400);
	background-color: var(--color-accent-600);
}

:global(.overlay__guess-avatar) {
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

:global(.overlay__guess-placeholder-icon) {
	opacity: 0.35;
}

.overlay__guess-edit {
	position: absolute;
	top: -0.15rem;
	right: -0.15rem;
	width: 35%;
	height: 35%;
	background-color: light-dark(var(--color-neutral-200), var(--color-neutral-800));
	border-radius: 50%;
	border: 1px solid light-dark(var(--color-neutral-300), var(--color-neutral-600));
	display: grid;
	place-items: center;
	color: light-dark(var(--color-neutral-600), var(--color-neutral-300));
	opacity: 0.5;
	transition: opacity 0.15s;
	pointer-events: none;
}
</style>
