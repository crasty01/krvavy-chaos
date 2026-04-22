<script lang="ts">
import * as valibot from 'valibot';
import InputGroup from '$lib/components/form/InputGroup.svelte';
import ImagePreview from '$lib/components/form/ImagePreview.svelte';
import { Switch } from 'bits-ui';
import type { GameFull } from '$lib/server/db';
import type { ScriptMetadata } from '@krvavy-chaos/shared/validate/script';

let { game }: {
	game: GameFull;
} = $props();

let scriptMeta = $derived(
	game.script.find((item) => typeof item === 'object' && item.id === '_meta') as ScriptMetadata
);

const urlSchema = valibot.pipe(valibot.string(), valibot.url());

$effect(() => { game.name = scriptMeta.name; });
</script>

<h2>obecné</h2>
<div class="general">
	<InputGroup label="název hry">
		{#snippet child(id)}
			<input type="text" {id} bind:value={scriptMeta.name}>
		{/snippet}
	</InputGroup>

	<InputGroup label="autor">
		{#snippet child(id)}
			<input type="text" {id} bind:value={scriptMeta.author}>
		{/snippet}
	</InputGroup>
	
	<InputGroup label="logo">
		{#snippet child(id)}
			<input type="text" {id} bind:value={scriptMeta.logo}>
		{/snippet}
		{#snippet tail()}
			{#if valibot.is(urlSchema, scriptMeta.logo)}
				<ImagePreview src={scriptMeta.logo} />
			{/if}
		{/snippet}
	</InputGroup>

	<InputGroup label="pozadí">
		{#snippet child(id)}
			<input type="text" {id} bind:value={scriptMeta.background}>
		{/snippet}
		{#snippet tail()}
			{#if valibot.is(urlSchema, scriptMeta.background)}
				<ImagePreview src={scriptMeta.background} />
			{/if}
		{/snippet}
	</InputGroup>

	<InputGroup label="schovat název">
		{#snippet children(id)}
			<Switch.Root {id} bind:checked={() => (scriptMeta.hideTitle ?? false), (value) => { scriptMeta.hideTitle = value }}>
				<Switch.Thumb />
			</Switch.Root>
		{/snippet}
	</InputGroup>
</div>

<style>
.general {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 0.2rem;

	& > :global(*) {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: span 2;
	}
}
</style>