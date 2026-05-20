<script lang="ts">
import Icon from '@iconify/svelte';
import { Button } from 'bits-ui';
import type { ExtensionGame, ExtensionOverlaySettings } from '@krvavy-chaos/shared/types/web';
import { game } from '../../functions/game.svelte';
import { viewerOverlay } from '../../stores/preference.svelte';
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

	<section class="settings-header">
		<!-- <span class="settings-hint">Každý streamer může mít jinak upravený vizuál hry, ale nemusí mít čas to nastavit v rozšíření, takže to občas zbyde na divákovi, aby si to upravil sám.</span> -->
		<span class="settings-hint">Nastavení platí pouze pro vás.</span>
		<span class="settings-hint">1 vmin = 1 % kratší strany videa.</span>
	</section>

	<section class="settings-content">
		{#if local}
			<OverlaySlider label="Posun po ose X" min={-50} max={50} step={0.1} bind:value={local.offsetX} onchange={onChange} />
			<OverlaySlider label="Posun po ose Y" min={-50} max={50} step={0.1} bind:value={local.offsetY} onchange={onChange} />
			<OverlaySlider label="Vzdálenost tokenů od středu" min={10} max={60} step={0.1} bind:value={local.radius} onchange={onChange} />
			<OverlaySlider label="Velikost tokenů" min={3} max={20} step={0.1} bind:value={local.tokenSize} onchange={onChange} />
		{/if}
	</section>

	<!-- {#if viewerOverlay.hasOverride} -->
		<section class="settings-reset">
			<Button.Root disabled={viewerOverlay.hasOverride} data-button-variant="outline" class="reset-btn" onclick={reset}>
				<Icon icon="material-symbols:settings-backup-restore" width={16} height={16} />
				<span>Obnovit nastavení streamera</span>
			</Button.Root>
		</section>
	<!-- {/if} -->
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

.settings-header {
	display: flex;
	flex-direction: column;
}

.settings-content {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
}

.settings-hint {
	font-size: 0.75rem;
	opacity: 0.55;
	margin: 0;
}

:global(.reset-btn) {
	font-size: var(--size-2xs);
	align-self: flex-start;
}
</style>
