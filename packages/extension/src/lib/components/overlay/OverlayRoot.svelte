<script lang="ts">
import type { Snippet } from 'svelte';

let { children }: {
	children?: Snippet;
} = $props();
</script>

<section id="overlay" class="overlay">
	<div class="overlay__wrapper">
		<div class="overlay__content">
			{@render children?.()}
		</div>
	</div>
</section>

<style>
#overlay {
}

.overlay {
	--size: min(100vw, 100vh);

	position: absolute;
	inset: 0;
	width: 100vw;
	height: 100vh;
	display: grid;
	place-content: center;
	overflow: hidden;

	& .overlay__wrapper {
		width: var(--size);
		height: var(--size);
		/* background-color: #343434; */
		border-radius: var(--size);
		overflow: hidden;
		padding: 17.3rem;
	}

	& .overlay__content {
		width: 100%;
		height: 100%;
		border-radius: var(--size);
		position: relative;
	}
}
</style>