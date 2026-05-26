<script lang="ts">
import Icon from '@iconify/svelte';
import { Button, ToggleGroup } from 'bits-ui';
import type { ExtensionGame, ExtensionOverlaySettings } from '@krvavy-chaos/shared/types/web';
import { game } from '../../functions/game.svelte';
import { viewerOverlay, tokenStyle, type TokenStyle } from '../../stores/preference.svelte';
import OverlaySlider from '../form/OverlaySlider.svelte';

// Unused — present so Settings shares the same tab component interface
let { data: _data }: { data?: ExtensionGame } = $props();

let broadcasterOverlay = $derived(game.data?.broadcasterOverlay);

// Initialize from stored viewer override; synced to broadcasterOverlay by $effect when game data loads
let local = $state<ExtensionOverlaySettings | null>(viewerOverlay.current ?? null);

$effect(() => {
	if (broadcasterOverlay && !viewerOverlay.hasOverride) {
		local = { ...broadcasterOverlay };
	}
});

const onChange = () => {
	if (local) viewerOverlay.update({ ...local });
};

const reset = () => {
	viewerOverlay.reset();
	if (broadcasterOverlay) local = { ...broadcasterOverlay };
};
</script>

<div class="settings">
	<h3>Nastavení overlay</h3>

	<div class="settings-group">
		<div class="settings-group-header">
			<Icon icon="material-symbols:palette" width={14} height={14} />
			<span>Zobrazení tokenů</span>
		</div>
		<ToggleGroup.Root
			type="single"
			bind:value={() => tokenStyle.value, (v) => { if (v) tokenStyle.set(v as TokenStyle); }}
		>
			<ToggleGroup.Item value="icon" class="token-style-btn">Obrázek</ToggleGroup.Item>
			<ToggleGroup.Item value="color" class="token-style-btn">Barva</ToggleGroup.Item>
			<ToggleGroup.Item value="none" class="token-style-btn">Nic</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	<div class="settings-group">
		<div class="settings-group-header">
			<Icon icon="material-symbols:open-with" width={14} height={14} />
			<span>Pozice</span>
		</div>
		{#if local}
			<OverlaySlider label="Posun po ose X" min={-50} max={50} step={0.1} bind:value={local.offsetX} onchange={onChange} />
			<OverlaySlider label="Posun po ose Y" min={-50} max={50} step={0.1} bind:value={local.offsetY} onchange={onChange} />
		{/if}
	</div>

	<div class="settings-group">
		<div class="settings-group-header">
			<Icon icon="material-symbols:straighten" width={14} height={14} />
			<span>Rozměry</span>
		</div>
		{#if local}
			<OverlaySlider label="Vzdálenost tokenů od středu" min={10} max={60} step={0.1} bind:value={local.radius} onchange={onChange} />
			<OverlaySlider label="Velikost tokenů" min={3} max={20} step={0.1} bind:value={local.tokenSize} onchange={onChange} />
		{/if}
	</div>

	<Button.Root disabled={viewerOverlay.hasOverride} data-button-variant="outline" class="reset-btn" onclick={reset}>
		<Icon icon="material-symbols:settings-backup-restore" width={16} height={16} />
		<span>Obnovit nastavení streamera</span>
	</Button.Root>

	<div class="settings-hints">
		<p class="settings-hint">Nastavení platí pouze pro vás.</p>
		<p class="settings-hint">1 vmin = 1 % kratší strany videa.</p>
	</div>
</div>

<style>
.settings {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	& h3 {
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}
}

.settings-group {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	padding: 0.75rem;
	border: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-800));
	border-radius: 0.5rem;
	background: light-dark(hsl(from var(--color-neutral-950) h s l / 2%), hsl(from var(--color-neutral-50) h s l / 3%));
}

.settings-group-header {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	font-size: 0.7rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	opacity: 0.5;
}

.settings-hints {
	display: flex;
	flex-direction: column;
	gap: 0.1rem;
}

.settings-hint {
	font-size: 0.75rem;
	opacity: 0.55;
	margin: 0;
}

:global([data-toggle-group-root]) {
	display: flex;
	border: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	border-radius: var(--border-radius);
	overflow: hidden;
}

:global(.token-style-btn) {
	flex: 1;
	padding: 0.25rem 0.5rem;
	font-size: 0.75rem;
	background: none;
	border: none;
	border-right: 1px solid light-dark(var(--color-neutral-200), var(--color-neutral-700));
	color: inherit;
	cursor: pointer;
	opacity: 0.5;

	&:last-child {
		border-right: none;
	}

	&:hover {
		background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
		opacity: 0.8;
	}

	&[data-state='on'] {
		background-color: light-dark(var(--color-neutral-200), var(--color-neutral-700));
		opacity: 1;
		font-weight: 600;
	}
}

:global(.reset-btn) {
	font-size: var(--size-2xs);
	align-self: flex-start;
}
</style>
