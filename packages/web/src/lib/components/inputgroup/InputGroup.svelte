<script lang="ts">
	import type { Snippet } from 'svelte';

  let { lead, tail, children, isTextarea = false }: {
		lead?: Snippet;
		tail?: Snippet;
		children?: Snippet;
		isTextarea?: boolean;
	} = $props();
</script>

<div
  class="input-group"
	class:input-group--is-textarea={isTextarea}
  role="group"
>
  {#if lead}
		<div class="input-group__lead">{@render lead()}</div>
	{/if}

  {#if tail}
		<div class="input-group__tail">{@render tail()}</div>
	{/if}

  {#if children}
		<div class="input-group__content">{@render children()}</div>
	{/if}
</div>

<style>
.input-group {
	display: grid;
	grid-template-columns: auto 1fr auto;
	grid-template-areas: "lead content tail";
	align-items: center;
	padding-inline: 0.8rem;
	padding-block: 0.3rem;
	gap: 0.8rem;
	width: auto;
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-900));
	border: 1px light-dark(var(--color-neutral-500), var(--color-neutral-500)) solid;
	border-radius: var(--border-radius);

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

	& .input-group__tail {
		grid-area: tail;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.4rem;
	}

	& .input-group__content {
		grid-area: content;
		display: flex;
		width: 100%;
	}

	& :global(input),
	& :global(textarea) {
		all: unset;
		width: 100%;
  	field-sizing: content;
	}
}
</style>