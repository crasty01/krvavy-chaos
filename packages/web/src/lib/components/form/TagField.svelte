<script lang="ts">
	import { Button } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';

	type Props = {
		label: string;
		tags: Array<string> | undefined;
		placeholder?: string;
	};

	let { label, tags = $bindable([]), placeholder = 'přidat…' }: Props = $props();

	let newTag = $state('');

	const add = () => {
		const trimmed = newTag.trim();
		if (!trimmed) return;
		tags = [...(tags ?? []), trimmed];
		newTag = '';
	};

	const remove = (index: number) => {
		tags = tags?.filter((_, i) => i !== index);
	};
</script>

<div class="tag-field">
	<InputGroup {label} isVertical>
		{#snippet child(id)}
			<input
				type="text"
				{id}
				bind:value={newTag}
				{placeholder}
				onkeydown={(e) => e.key === 'Enter' && add()}
			/>
		{/snippet}
		{#snippet tail()}
			<Button.Root
				data-button-variant="ghost"
				data-button-round
				onclick={add}
				aria-label="Přidat"
			>
				<Icon icon="material-symbols:add" />
			</Button.Root>
		{/snippet}
	</InputGroup>

	{#if (tags ?? []).length > 0}
		<div class="tag-list">
			{#each tags ?? [] as tag, index}
				<div class="tag">
					<span>{tag}</span>
					<Button.Root
						data-button-variant="ghost"
						data-button-round
						onclick={() => remove(index)}
						aria-label="Odebrat"
					>
						<Icon icon="material-symbols:close" />
					</Button.Root>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
.tag-field {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
}

.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem;
	align-items: center;
}

.tag {
	display: flex;
	align-items: center;
	gap: 0.1rem;
	padding: 0.1rem 0.15rem 0.1rem 0.5rem;
	border-radius: 9999px;
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	border: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	font-size: var(--size-xs);
}
</style>
