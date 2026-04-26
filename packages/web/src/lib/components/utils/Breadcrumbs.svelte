<script lang="ts">
import Icon from '@iconify/svelte';
import { Button } from 'bits-ui';
import type { Breadcrumb } from '@krvavy-chaos/shared/types/web';

let { breadcrumbs }: {
	breadcrumbs: Array<Breadcrumb>;
} = $props();
</script>

<ul class="breadcrumbs">
	{#each breadcrumbs as { label, href, icon }, i}
		<li>
			{#if i > 0}
				<span>&gt;</span>
			{/if}
			<Button.Root data-button-variant="ghost" {href}>
				{#if icon}
					<Icon {icon} />
				{/if}
				<span>{label}</span>
			</Button.Root>
		</li>
	{/each}
</ul>

<style>
.breadcrumbs {
	display: flex;
	flex-direction: row;
	gap: 0.2rem;
	align-items: center;
	background-color: hsl(from light-dark(var(--color-neutral-100), var(--color-neutral-800)) h s l / 0.2);
	border-radius: var(--border-radius);
	margin-block: 0.2rem;
	margin-inline: 1rem;
	width: calc(100% - 2rem);

	li {
		display: contents;
		list-style: none;
	}
}
</style>