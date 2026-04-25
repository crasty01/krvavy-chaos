<script lang="ts">
import type { ExtensionGamePlayer } from '@krvavy-chaos/shared/types/web';

let { gamePlayer, numberOfSeats, seatIndex }: {
	gamePlayer: ExtensionGamePlayer;
	numberOfSeats: number;
	seatIndex: number;
} = $props();

let id = $derived(crypto.randomUUID());
let popover = $state<HTMLDivElement>();

const openPopover = () => popover?.showPopover();
const closePopover = () => popover?.hidePopover();
</script>

<div
	class="overlay__character"
	data-character-alignment={gamePlayer.alignment}
	style:--rotation="{(360 / numberOfSeats) * seatIndex}deg"
>
	<div
		role="button"
		tabindex="0"
		class="overlay__character-token"
		onmouseenter={openPopover}
		onmouseleave={closePopover}
		onfocusin={openPopover}
		onfocusout={closePopover}
		aria-controls={id}
		aria-haspopup="dialog"
	>
		<span class="sr-only">character token</span>
	</div>

	<div bind:this={popover} popover="auto" {id} class="overlay__character-info">
		<pre>{JSON.stringify(gamePlayer, null, 2)}</pre>
	</div>
</div>

<style>
.overlay__character {
	position: absolute;
	top: calc(var(--token-size) / 2);
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