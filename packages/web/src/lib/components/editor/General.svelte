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

let scriptMeta = $state(game.script.find((item) => typeof item === 'object' && item.id === '_meta')! as ScriptMetadata);

const urlSchema = valibot.pipe(valibot.string(), valibot.url());

let icon = $state('https://static-cdn.jtvnw.net/jtv_user_pictures/8ccc9229-4a5b-437f-9776-c4d742602e7a-profile_image-150x150.png')
let background = $state('https://images.unsplash.com/photo-1772475385327-ae6212f900aa')
</script>

<!-- <ul>
	<li>name: {scriptMeta.name}</li>
	<li>author: {scriptMeta.author}</li>
	<li>hideTitle: {scriptMeta.hideTitle}</li>
	
	<li>logo: {scriptMeta.logo}</li>
	<li>background: {scriptMeta.background}</li>
	
	<li>bootleggers: {scriptMeta.bootlegger}</li>
</ul> -->

<h2>obecné</h2>
<div class="general">
	<InputGroup label="name">
		{#snippet child(id)}
			<input type="text" {id} bind:value={scriptMeta.name}>
		{/snippet}
	</InputGroup>
	<InputGroup label="author">
		{#snippet child(id)}
			<input type="text" {id} bind:value={scriptMeta.author}>
		{/snippet}
	</InputGroup>
	<InputGroup label="hideTitle">
		{#snippet children(id)}
			<Switch.Root {id} bind:checked={() => (scriptMeta.hideTitle ?? false), (value) => { scriptMeta.hideTitle = value }}>
				<Switch.Thumb />
			</Switch.Root>
		{/snippet}
	</InputGroup>
	
	<InputGroup label="logo">
		{#snippet child(id)}
			<input type="text" {id} bind:value={icon}>
		{/snippet}
		{#snippet tail()}
			{#if valibot.is(urlSchema, icon)}
				<ImagePreview src={icon} />
			{/if}
		{/snippet}
	</InputGroup>

	<InputGroup label="background">
		{#snippet child(id)}
			<input type="text" {id} bind:value={background}>
		{/snippet}
		{#snippet tail()}
			{#if valibot.is(urlSchema, background)}
				<ImagePreview src={background} />
			{/if}
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

input:not([type="checkbox"]) {
	all: unset;
	width: 100%;
}
</style>