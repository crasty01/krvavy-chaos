<script lang="ts">
import Icon from '@iconify/svelte';
import { Button } from 'bits-ui';
import type { ExtensionGame } from '@krvavy-chaos/shared/types/web';
import { twitchStore } from '../../services/twitch.svelte';
import { viewerOverlay } from '../../stores/preference.svelte';
import { parseConfig } from '../../functions/config';

// Unused — present so Settings shares the same tab component interface
let { data: _data }: { data?: ExtensionGame } = $props();

let broadcasterOverlay = $derived(
	twitchStore.broadcasterConfig?.overlay ?? parseConfig(null).overlay,
);

// Initialize from user's stored override, or defaults (synced with broadcaster on mount via $effect)
let local = $state(viewerOverlay.current ?? parseConfig(null).overlay);

$effect(() => {
	if (!viewerOverlay.hasOverride) {
		local = { ...broadcasterOverlay };
	}
});

const onChange = () => {
	viewerOverlay.update({ ...local });
};

const reset = () => {
	viewerOverlay.reset();
	local = { ...broadcasterOverlay };
};
</script>

<div class="settings">
	<h3>Nastavení overlay</h3>

	<section class="settings-header">
		<span class="settings-hint">Každý streamer může mít jinak upravený vizuál hry, ale nemusí mít čas to nastavit v rozšíření, takže to občas zbyde na divákovi, aby si to upravil sám.</span>
		<span class="settings-hint">Nastavení platí pouze pro vás.</span>
		<span class="settings-hint">1 vmin = 1 % kratší strany videa.</span>
	</section>

	<section class="settings-content">
		<div class="setting-row">
			<label for="setting-offset-x">Posun po ose X</label>
			<input
				id="setting-offset-x"
				type="range"
				min="-50"
				max="50"
				step="0.1"
				bind:value={local.offsetX}
				oninput={onChange}
			/>
			<span class="setting-value">{local.offsetX} vmin</span>
		</div>

		<div class="setting-row">
			<label for="setting-offset-y">Posun po ose Y</label>
			<input
				id="setting-offset-y"
				type="range"
				min="-50"
				max="50"
				step="0.1"
				bind:value={local.offsetY}
				oninput={onChange}
			/>
			<span class="setting-value">{local.offsetY} vmin</span>
		</div>

		<div class="setting-row">
			<label for="setting-radius">Vzdálenost tokenů od středu</label>
			<input
				id="setting-radius"
				type="range"
				min="10"
				max="60"
				step="0.1"
				bind:value={local.radius}
				oninput={onChange}
			/>
			<span class="setting-value">{local.radius} vmin</span>
		</div>

		<div class="setting-row">
			<label for="setting-token-size">Velikost tokenů</label>
			<input
				id="setting-token-size"
				type="range"
				min="3"
				max="20"
				step="0.1"
				bind:value={local.tokenSize}
				oninput={onChange}
			/>
			<span class="setting-value">{local.tokenSize} vmin</span>
		</div>
	</section>

	{#if viewerOverlay.hasOverride}
		<section class="settings-reset">
			<Button.Root data-button-variant="outline" class="reset-btn" onclick={reset}>
				<Icon icon="material-symbols:settings-backup-restore" width={16} height={16} />
				<span>Obnovit nastavení streamera</span>
			</Button.Root>
		</section>
	{/if}
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

.setting-row {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto auto;
	gap: 0.15rem 0.5rem;
	align-items: center;

	& label {
		font-size: 0.75rem;
		opacity: 0.8;
		grid-column: 1 / 3;
		grid-row: 1;
	}

	& input[type='range'] {
		grid-column: 2;
		grid-row: 2;
		width: 100%;
		accent-color: var(--color-accent-500);
	}

	& .setting-value {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		opacity: 0.65;
		white-space: nowrap;
		grid-column: 1;
		grid-row: 1 / 3;
		min-width: 5rem;
		align-self: flex-end;
	}
}

:global(.reset-btn) {
	font-size: var(--size-2xs);
	align-self: flex-start;
}
</style>
