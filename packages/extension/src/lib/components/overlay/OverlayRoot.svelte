<script lang="ts">
import type { Snippet } from 'svelte';

let { children }: {
	children?: Snippet;
} = $props();
</script>

<section
	id="overlay"
	class="overlay"
	style:--token-size="9.3vmin"
	style:--token-padding="25.3vmin"
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
		padding: var(--token-padding);
	}

	& .overlay__content {
		width: 100%;
		height: 100%;
		border-radius: var(--wrapper-size);
		position: relative;
	}
}
</style>