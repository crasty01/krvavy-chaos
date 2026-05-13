<script lang="ts">
import type { ExtensionOverlaySettings } from '@krvavy-chaos/shared/types/web';
import type { Snippet } from 'svelte';

let { children, config }: {
	children?: Snippet;
	config: ExtensionOverlaySettings;
} = $props();
</script>

<section
	id="overlay"
	class="overlay"
	style:--token-size="{config.tokenSize}vmin"
	style:--overlay-radius="{config.radius}vmin"
  style:--offset-x="{config.offsetX}vmin"
  style:--offset-y="{config.offsetY}vmin"
>
	<div class="overlay__wrapper">
		<div class="overlay__content">
			{@render children?.()}
		</div>
	</div>
</section>

<style>
.overlay {
	--wrapper-size: 100vmin;

	position: absolute;
	inset: 0;
	width: 100vw;
	height: 100vh;
	display: grid;
	place-content: center;
	overflow: hidden;

	& .overlay__wrapper {
		width: var(--wrapper-size);
		height: var(--wrapper-size);
		/* background-color: #343434; */
		border-radius: var(--wrapper-size);
		overflow: hidden;
    display: grid;
    place-content: center;
	}

	& .overlay__content {
		width: var(--overlay-radius);
		height: var(--overlay-radius);
		border-radius: var(--wrapper-size);
    position: absolute;
    top: 50%;
    left: 50%;
    translate: calc(-50% + var(--offset-x)) calc(-50% + var(--offset-y));
	}
}
</style>