<script lang="ts">
import Icon from '@iconify/svelte';
import { Button } from 'bits-ui';
import InputGroup from '../form/InputGroup.svelte';
import { twitchStore } from '../../services/twitch.svelte';
import { createAsyncAction } from '../../services/async.svelte';
import { parseConfig } from '../../functions/config';

const STATUS_ICONS = {
	loading: 'material-symbols:progress-activity',
	success: 'material-symbols:check-circle',
	error: 'material-symbols:cancel',
} as const;

let config = $state(parseConfig(twitchStore.broadcasterConfig));

const saveAction = createAsyncAction({ minLoading: 200, minSuccess: 1500, minError: 2500 });
const saveIcon = $derived(saveAction.status === 'idle' ? 'material-symbols:save' : STATUS_ICONS[saveAction.status]);
const save = () => saveAction.trigger(async () => twitchStore.updateConfig('broadcaster', '1', config));
</script>

<div class="config">
	<h2>Nastavení overlay</h2>
	<InputGroup label="Twitch Id vlastníka hry">
		{#snippet child(id)}
			<input
				{id}
				type="text"
				bind:value={config.gameOwner}
			/>
		{/snippet}
	</InputGroup>
	<InputGroup label="offset x">
		{#snippet child(id)}
			<input
				{id}
				type="text"
				bind:value={config.overlay.offsetX}
			/>
		{/snippet}
		{#snippet tail()}
			<span>vmin</span>
		{/snippet}
	</InputGroup>
	<InputGroup label="offset y">
		{#snippet child(id)}
			<input
				{id}
				type="text"
				bind:value={config.overlay.offsetY}
			/>
		{/snippet}
		{#snippet tail()}
			<span>vmin</span>
		{/snippet}
	</InputGroup>
	<InputGroup label="vzdálenost tokenů od středu">
		{#snippet child(id)}
			<input
				{id}
				type="text"
				bind:value={config.overlay.radius}
			/>
		{/snippet}
		{#snippet tail()}
			<span>vmin</span>
		{/snippet}
	</InputGroup>
	<InputGroup label="velikost tokenů">
		{#snippet child(id)}
			<input
				{id}
				type="text"
				bind:value={config.overlay.tokenSize}
			/>
		{/snippet}
		{#snippet tail()}
			<span>vmin</span>
		{/snippet}
	</InputGroup>
	<Button.Root data-button-variant="outline" onclick={save}>
		<Icon icon={saveIcon} data-spin={String(saveAction.status === 'loading')} />
		<span>uložit</span>
	</Button.Root>

	<p><i>* 1vmin je 1% výšky/šířky (ta menší z nich) videa</i></p>
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
