<script lang="ts">
	import { Button } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		onremove?: () => void;
		children: Snippet;
	};

	let { onremove, children }: Props = $props();
</script>

<div class="pill">
	{@render children()}
	{#if onremove}
		<Button.Root
			data-button-variant="ghost"
			data-button-round
			onclick={onremove}
			aria-label="Odebrat"
		>
			<Icon icon="material-symbols:close" />
		</Button.Root>
	{/if}
</div>

<style>
.pill {
	display: flex;
	align-items: center;
	gap: 0.1rem;
	padding: 0.15rem 0.2rem 0.15rem 0.6rem;
	border-radius: 9999px;
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	border: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	font-size: 0.8rem;
}
</style>
