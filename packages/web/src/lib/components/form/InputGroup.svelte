<script lang="ts">
	import { Label, useId } from 'bits-ui';
	import type { Snippet } from 'svelte';

  let { lead, tail, child, children, label, isTextarea = false }: {
		lead?: Snippet;
		tail?: Snippet;
		child?: Snippet<[string]>;
		children?: Snippet<[string]>;
		label: string;
		isTextarea?: boolean;
	} = $props();

	let id = useId();
</script>

<div class="input-group-wrapper">
	<Label.Root for={id}>
		<span>{label}:</span>
	</Label.Root>
	{#if children}
		{@render children(id)}
	{:else}
		<div
			class="input-group"
			class:input-group--is-textarea={isTextarea}
			role="group"
		>
			{#if lead}
				<div class="input-group__lead">{@render lead()}</div>
			{/if}

			{#if child}
				<div class="input-group__content">{@render child(id)}</div>
			{/if}

			{#if tail}
				<div class="input-group__tail">{@render tail()}</div>
			{/if}
		</div>
	{/if}
</div>

<style>
.input-group-wrapper {
	display: flex;
	gap: 1rem;
	align-items: center;
}

.input-group {
	display: flex;
	align-items: center;
	padding-inline: 0.8rem;
	padding-block: 0.3rem;
	gap: 0.8rem;
	width: auto;
	border: 1px solid;
	border-color: light-dark(var(--color-neutral-500), var(--color-neutral-500));
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-900));
	border-radius: var(--border-radius);

	&:focus-within {
		border-color: light-dark(var(--color-accent-500), var(--color-accent-500));
	}

	&.input-group--is-textarea {
		grid-template-rows: 1fr auto;
		grid-template-areas: "content content content" "lead . tail";
		padding-block: 0.8rem;
	}

	& .input-group__lead {
		grid-area: lead;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.4rem;
	}

	& .input-group__content {
		grid-area: content;
		display: flex;
		width: 100%;
		flex-grow: 1;
	}

	& .input-group__tail {
		grid-area: tail;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.4rem;
	}
}
</style>