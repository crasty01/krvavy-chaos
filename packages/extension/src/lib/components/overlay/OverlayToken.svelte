<script lang="ts">
import type { Alignment } from '@krvavy-chaos/shared/index';

let { playerAlignment = 'neutral', numberOfSeats, seatIndex, tokenSize = '6.2rem' }: {
	playerAlignment?: Alignment;
	tokenSize?: string;
	numberOfSeats: number;
	seatIndex: number;
} = $props();

let id = $derived(crypto.randomUUID());
let popover = $state<HTMLDivElement>();

const openPopover = () => popover?.showPopover();
const closePopover = () => popover?.hidePopover();

let tokenColor = $derived.by(() => {
	switch (playerAlignment) {
		case 'evil': return '#ff0000';
		case 'good': return '#0000ff';
		default: return '#ffffff';
	}
})
</script>

<div
	class="overlay__character"
	style:--rotation="{(360 / numberOfSeats) * seatIndex}deg"
	style:--size="{tokenSize}"
	style:--color="{tokenColor}"
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
		<ul>
			<li>numberOfSeats: {numberOfSeats}</li>
			<li>seatIndex: {seatIndex}</li>
		</ul>
	</div>
</div>

<style>
.overlay__character {
	position: absolute;
	top: calc(var(--size) / 2);
	left: 50%;
	bottom: 50%;
	transform-origin: bottom center;
	rotate: var(--rotation);
}

.overlay__character-token {
	width: var(--size);
	height: var(--size);
	border-radius: var(--size);
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

.overlay__character-info {

}
</style>