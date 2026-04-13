<script lang="ts">
	import Icon from '@iconify/svelte';
import { Button } from 'bits-ui';

let { breadcrumbs }: {
	breadcrumbs: Array<{
		label: string;
		href: string;
		icon?: string;
	}>;
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

	li {
		display: contents;
		list-style: none;
	}
}
</style>