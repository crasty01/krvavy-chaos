<script lang="ts">
	import * as v from 'valibot';
	import { Button } from 'bits-ui';
	import Icon from '@iconify/svelte';
	import type { GameFull } from '$lib/server/db';
	import { type BotcScript, BotcScriptSchema, getScriptMeta } from '@krvavy-chaos/shared/validate/script';

	let { game }: { game: GameFull } = $props();

	// --- Export ---

	const exportScript = () => {
		const meta = getScriptMeta(game.script as any);
		const filename = `${meta?.name ?? game.name}.json`;
		const json = JSON.stringify(game.script, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	// --- Import ---

	let fileInput = $state<HTMLInputElement | null>(null);

	type ImportStatus = 'idle' | 'success' | 'error-json' | 'error-schema';
	let importStatus = $state<ImportStatus>('idle');
	let importErrors = $state<Array<string>>([]);

	const triggerImport = () => fileInput?.click();

	const onFileChange = async (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		input.value = '';

		let parsed: unknown;
		try {
			const text = await file.text();
			parsed = JSON.parse(text);
		} catch {
			importStatus = 'error-json';
			importErrors = ['Soubor není platný JSON.'];
			return;
		}

		const result = v.safeParse(BotcScriptSchema, parsed);
		if (!result.success) {
			importStatus = 'error-schema';
			importErrors = result.issues.map((issue) => issue.message);
			return;
		}

		game.script = result.output;
		importStatus = 'success';
		importErrors = [];
	};
</script>

<input
	bind:this={fileInput}
	type="file"
	accept=".json,application/json"
	onchange={onFileChange}
	hidden
/>

<div class="import-export">
	<section>
		<h2>export skriptu</h2>
		<p>Stáhne aktuální skript jako soubor <code>.json</code>, který lze nahrát do jiných nástrojů (např. <a href="https://botc.app/" target="_blank">botc.app</a>).</p>
		<Button.Root data-button-variant="outline" onclick={exportScript}>
			<Icon icon="material-symbols:sim-card-download-rounded" />
			<span>exportovat skript</span>
		</Button.Root>
	</section>

	<section>
		<h2>import skriptu</h2>
		<p>Nahraje skript ze souboru <code>.json</code>. Stávající skript bude nahrazen. Změny je nutné uložit ručně tlačítkem „uložit".</p>
		<Button.Root data-button-variant="outline" onclick={triggerImport}>
			<Icon icon="material-symbols:upload-file-rounded" />
			<span>importovat skript</span>
		</Button.Root>

		{#if importStatus === 'success'}
			<p class="feedback feedback--success">Skript byl úspěšně importován. Kliknutím na „uložit" změny uložíte.</p>
		{:else if importStatus === 'error-json' || importStatus === 'error-schema'}
			<div class="feedback feedback--error">
				<p>Import selhal:</p>
				<ul>
					{#each importErrors as error}
						<li>{error}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</section>
</div>

<style>
.import-export {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	padding: 1rem 0;
}

section {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	max-width: 36rem;
}

h2 {
	font-size: 1rem;
	font-weight: 600;
	margin: 0;
}

p {
	margin: 0;
	color: var(--color-muted, inherit);
}

.feedback {
	padding: 0.75rem 1rem;
	border-radius: 0.375rem;
	font-size: 0.875rem;

	& p, & ul {
		margin: 0;
	}

	& ul {
		padding-left: 1.25rem;
	}
}

.feedback--success {
	background-color: var(--color-success-bg, #d1fae5);
	color: var(--color-success-text, #065f46);
}

.feedback--error {
	background-color: var(--color-error-bg, #fee2e2);
	color: var(--color-error-text, #991b1b);
}
</style>
