<script lang="ts">
	import { Button } from 'bits-ui';
	import InputGroup from '../form/InputGroup.svelte';
	import { twitchStore } from '../../services/twitch.svelte';

	let gameOwner = $state(
		(twitchStore.broadcasterConfig as { gameOwner?: string } | null)?.gameOwner ?? ''
	);

	let saving = $state(false);
	let saved = $state(false);

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		saving = true;
		saved = false;
		await twitchStore.updateConfig('broadcaster', '1', { gameOwner });
		saving = false;
		saved = true;
	};
</script>

<div class="config">
	<h2>Nastavení overlay</h2>
	<form onsubmit={handleSubmit}>
		<InputGroup label="ID vlastníka hry" isVertical>
			{#snippet child(id)}
				<input
					{id}
					type="text"
					placeholder="Twitch ID kanálu"
					bind:value={gameOwner}
					disabled={saving}
				/>
			{/snippet}
		</InputGroup>
		<Button.Root type="submit" disabled={saving || !gameOwner.trim()} data-button-variant="accent">
			{saving ? 'Ukládám…' : 'Uložit'}
		</Button.Root>
		{#if saved}
			<p class="saved">Nastavení uloženo.</p>
		{/if}
	</form>
</div>

<style>
	.config {
		padding: 1.5rem;
		font-family: var(--font-primary, system-ui, sans-serif);
		color: light-dark(var(--color-neutral-900), var(--color-neutral-50));
	}

	h2 {
		font-size: var(--size-lg);
		margin-block-end: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 24rem;
	}

	.saved {
		color: var(--color-accent-400);
		font-size: var(--size-xs);
		margin: 0;
	}
</style>
