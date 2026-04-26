<script lang="ts">
import Icon from '@iconify/svelte';
import { Button } from 'bits-ui';
import InputGroup from '../form/InputGroup.svelte';
import { twitchStore } from '../../services/twitch.svelte';
import { createAsyncAction } from '../../services/async.svelte';

const STATUS_ICONS = {
	loading: 'material-symbols:progress-activity',
	success: 'material-symbols:check-circle',
	error: 'material-symbols:cancel',
} as const;

let gameOwner = $state(twitchStore.broadcasterConfig?.gameOwner ?? '');

const saveAction = createAsyncAction({ minLoading: 200, minSuccess: 1500, minError: 2500 });
const saveIcon = $derived(saveAction.status === 'idle' ? 'material-symbols:save' : STATUS_ICONS[saveAction.status]);
const save = () => saveAction.trigger(async () => twitchStore.updateConfig('broadcaster', '1', { gameOwner }));
</script>

<div class="config">
	<h2>Nastavení overlay</h2>
	<InputGroup label="ID vlastníka hry" isVertical>
		{#snippet child(id)}
			<input
				{id}
				type="text"
				placeholder="Twitch ID kanálu"
				bind:value={gameOwner}
				disabled={saveAction.status === 'loading'}
			/>
		{/snippet}
	</InputGroup>
	<Button.Root data-button-variant="outline" onclick={save}>
		<Icon icon={saveIcon} data-spin={String(saveAction.status === 'loading')} />
		<span>uložit</span>
	</Button.Root>
</div>

<style>
.config {
	color-scheme: dark;
	padding: 1.5rem;
	font-family: var(--font-primary, system-ui, sans-serif);
	color: light-dark(var(--color-neutral-900), var(--color-neutral-50));
}

h2 {
	font-size: var(--size-lg);
	margin-block-end: 1rem;
}
</style>
