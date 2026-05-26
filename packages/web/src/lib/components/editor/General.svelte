<script lang="ts">
import * as valibot from 'valibot';
import Icon from '@iconify/svelte';
import InputGroup from '$lib/components/form/InputGroup.svelte';
import ImagePreview from '$lib/components/form/ImagePreview.svelte';
import OverlaySlider from '$lib/components/form/OverlaySlider.svelte';
import { Switch } from 'bits-ui';
import type { GameFull } from '$lib/server/db';
import type { BotcScriptMeta } from '@krvavy-chaos/shared/validate/script';

let { game }: {
	game: GameFull;
} = $props();

let scriptMeta = $derived(
	game.script.find((item) => typeof item === 'object' && item.id === '_meta') as BotcScriptMeta
);

const urlSchema = valibot.pipe(valibot.string(), valibot.url());

$effect(() => { game.name = scriptMeta.name; });

const OVERLAY_DEFAULTS = { offsetX: 0, offsetY: 0, radius: 40, tokenSize: 9.3 };
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
			<input type="text" {id} bind:value={() => scriptMeta.logo ?? '', (value) => { scriptMeta.logo = value.trim() === '' ? undefined : value }}>
		{/snippet}
		{#snippet tail()}
			{#if valibot.is(urlSchema, scriptMeta.logo)}
				<ImagePreview src={scriptMeta.logo} />
			{/if}
		{/snippet}
	</InputGroup>

	<InputGroup label="pozadí">
		{#snippet child(id)}
			<input type="text" {id} bind:value={() => scriptMeta.background ?? '', (value) => { scriptMeta.background = value.trim() === '' ? undefined : value }}>
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

<h2>nastavení overlay pro game mastera</h2>
<p class="dm-overlay-hint">Nastavení overlay pro game mastera a zároveň defaultních hodnot pro hráče. 1&nbsp;vmin = 1&nbsp;% kratší strany videa.</p>
<div class="dm-overlay">
	<div class="overlay-group">
		<div class="overlay-group-header">
			<Icon icon="material-symbols:open-with" width={14} height={14} />
			<span>Pozice</span>
		</div>
		<OverlaySlider label="Posun X" min={-50} max={50} step={0.1}
			bind:value={() => game.overlayOffsetX ?? OVERLAY_DEFAULTS.offsetX, (v) => { game.overlayOffsetX = v; }}
		/>
		<OverlaySlider label="Posun Y" min={-50} max={50} step={0.1}
			bind:value={() => game.overlayOffsetY ?? OVERLAY_DEFAULTS.offsetY, (v) => { game.overlayOffsetY = v; }}
		/>
	</div>
	<div class="overlay-group">
		<div class="overlay-group-header">
			<Icon icon="material-symbols:straighten" width={14} height={14} />
			<span>Rozměry</span>
		</div>
		<OverlaySlider label="Vzdálenost od středu" min={10} max={60} step={0.1}
			bind:value={() => game.overlayRadius ?? OVERLAY_DEFAULTS.radius, (v) => { game.overlayRadius = v; }}
		/>
		<OverlaySlider label="Velikost tokenů" min={3} max={20} step={0.1}
			bind:value={() => game.overlayTokenSize ?? OVERLAY_DEFAULTS.tokenSize, (v) => { game.overlayTokenSize = v; }}
		/>
	</div>
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

.dm-overlay-hint {
	font-size: 0.75rem;
	opacity: 0.55;
	margin: 0 0 0.5rem;
}

.dm-overlay {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.overlay-group {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	padding: 0.75rem;
	border: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-800));
	border-radius: 0.5rem;
	background: light-dark(hsl(from var(--color-neutral-950) h s l / 2%), hsl(from var(--color-neutral-50) h s l / 3%));
}

.overlay-group-header {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	font-size: 0.7rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	opacity: 0.5;
	margin-bottom: 0.1rem;
}
</style>