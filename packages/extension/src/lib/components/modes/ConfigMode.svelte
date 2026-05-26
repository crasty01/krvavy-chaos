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
	<h2>Nastavení</h2>
	<div class="config-form">
		<InputGroup label="Twitch Id vlastníka hry" subgrid>
			{#snippet child(id)}
				<input
					{id}
					type="text"
					bind:value={config.gameOwner}
				/>
			{/snippet}
		</InputGroup>
	</div>
	<Button.Root data-button-variant="accent" onclick={save}>
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
	display: flex;
	flex-direction: column;
	gap: 0.6em;
	align-items: flex-start;

	& h2 {
		font-size: var(--size-lg);
		margin-block-end: 1rem;
	}

	& .config-form {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.2rem;

		& > :global(.input-group-wrapper) {
			grid-column: span 2;
		}
	}
}
</style>
