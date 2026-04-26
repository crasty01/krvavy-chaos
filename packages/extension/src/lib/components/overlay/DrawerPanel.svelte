<script lang="ts">
import Icon from '@iconify/svelte';
import { Button } from 'bits-ui';
import type { Snippet } from 'svelte';
import { twitchStore } from '../../services/twitch.svelte';

type Props = { children: Snippet };
let { children }: Props = $props();

let open = $state(false);

let inset = $derived(twitchStore.context?.isFullScreen ? '10rem' : '4rem');
</script>

<div class="drawer-panel" class:is-open={open} style:--drawer-inset={inset}>
	<div class="drawer-body">
		{@render children()}
	</div>
	<Button.Root class="drawer-toggle" onclick={() => (open = !open)} aria-label={open ? 'Zavřít panel' : 'Otevřít panel'}>
		<Icon icon={open ? 'material-symbols:chevron-left' : 'material-symbols:chevron-right'} width={20} height={20} />
	</Button.Root>
</div>

<style>
.drawer-panel {
	--drawer-width: 30rem;
	--drawer-inset: 2rem;
	position: absolute;
	top: var(--drawer-inset);
	bottom: var(--drawer-inset);
	left: 0;
	display: flex;
	flex-direction: row;
	align-items: stretch;
	pointer-events: none;
	translate: calc(-1 * var(--drawer-width));
	transition: translate 250ms ease-in-out;
	z-index: 100;

	&.is-open {
		translate: 0;
	}
}

.drawer-body {
	width: var(--drawer-width);
	height: 100%;
	pointer-events: all;
	overflow: hidden;
}

.drawer-panel :global(.drawer-toggle) {
	align-self: center;
	pointer-events: all;
	width: 1.5rem;
	height: 6rem;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
	background-color: light-dark(var(--color-neutral-200), var(--color-neutral-800));
	border: none;
	cursor: pointer;
	flex-shrink: 0;
	transition: background-color 0.15s;
	color: inherit;

	&:hover {
		background-color: light-dark(var(--color-neutral-300), var(--color-neutral-700));
	}
}
</style>
