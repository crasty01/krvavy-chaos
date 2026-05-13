<script lang="ts">
import '@krvavy-chaos/shared/css/reset.css';
import '@krvavy-chaos/shared/css/tokens.css';
import '@krvavy-chaos/shared/css/components.css';
import './base.css';
import ThemeToggle from '$lib/components/utils/ThemeToggle.svelte';
import Breadcrumbs from '$lib/components/utils/Breadcrumbs.svelte';
import Icon, { loadIcons } from "@iconify/svelte";
import { authClient } from '$lib/auth-client.svelte';
import { Button, Tooltip } from 'bits-ui';
import { fromStore } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { createAsyncAction } from '$lib/functions/async.svelte';
import type { PageData } from './$types';
import type { Snippet } from 'svelte';
import { iconList } from '$lib/icon-list';

loadIcons(iconList);

let { children, data }: {
	children: Snippet;
	data: PageData;
} = $props();
let session = fromStore(authClient.useSession());

const signOut = () => authClient.signOut({
	fetchOptions: { onSuccess: () => goto('/') }
});

const STATUS_ICONS = {
	loading: 'material-symbols:progress-activity',
	success: 'material-symbols:check-circle',
	error: 'material-symbols:cancel',
	idle: 'material-symbols:content-copy'
} as const;

const copyUserIdState = createAsyncAction({ minLoading: 200, minSuccess: 1500, minError: 2500 });
const copyUserId = () => copyUserIdState.trigger(async () => {
	const accountId = data.user?.twitchAccount.accountId
	if (accountId) {
		await navigator.clipboard.writeText(accountId);
	}
});
const copyUserIdIcon = $derived(STATUS_ICONS[copyUserIdState.status])

$inspect(page);
</script>

<svelte:head>
	<title>Krvavá hodina odbila</title>
</svelte:head>

<header>
	<div class="lead">
		<Button.Root href="/dashboard">
			<Icon icon="material-symbols:water-drop" />
			<span class="logo">Krvavá hodina odbila</span>
		</Button.Root>
	</div>
	<div class="tail">
		{#if session.current.data && data.user?.twitchAccount.id}
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={200}>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button.Root {...props} data-button-variant="outline" onclick={copyUserId}>
								<span>{data.user.twitchAccount.accountId}</span>
								<Icon icon={copyUserIdIcon} data-spin={String(copyUserIdState.status === 'loading')} />
							</Button.Root>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content>
							<Tooltip.Arrow />
							<p>
								Tohle je tvoje twitch ID. Všichni spoluhráči,
								kteří chtějí mít na svém kanále tvou aktivní hru,
								musí toto ID vložit do nastavení rozšíření.
							</p>
							<span>
								<em>*zkopíruješ ho kliknutím*</em>
							</span>
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>
		{/if}
		{#if session.current.data}
			<Button.Root data-button-variant="solid" onclick={signOut}>
				<span>Odhlásit se</span>
				<Icon icon="material-symbols:arrow-outward" />
			</Button.Root>
		{/if}
	</div>
</header>

{#if page.data.breadcrumbs}
	<Breadcrumbs breadcrumbs={page.data.breadcrumbs} />
{/if}

<main>
	{@render children()}
</main>

<footer>
	<div class="lead">
		<span class="copyright">&copy; 2026 Daniel Vondra</span>
		<a href="/privacy" class="privacy-link">Zásady ochrany osobních údajů</a>
	</div>
	<div class="tail">
		<ThemeToggle />
	</div>
</footer>

<style>
:global(#app) {
	display: grid;
	grid-template-rows: auto 1fr auto;
	min-height: 100vh;
	gap: 2rem;
	max-width: var(--max-width);
	margin-inline: auto;
	/* vh? */
	height: 100vh;
	overflow: hidden;

	:global(&:has(> .breadcrumbs)) {
		grid-template-rows: auto auto 1fr auto;
	}
}

main {
	padding-inline: 1rem;
	display: grid;
	/* align-content: flex-start; */
	align-content: stretch;
	gap: 2rem;
	height: 100%;
	overflow-y: auto;
}

header {
	min-height: 5rem;
	display: flex;
	flex-direction: row;
	gap: 1rem;
	justify-content: space-between;
	align-items: center;
	padding-inline: 1rem;
	padding-block: 1rem;

	& .tail {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}
}

footer {
	min-height: 5rem;
	display: flex;
	flex-direction: row;
	gap: 1rem;
	justify-content: space-between;
	align-items: center;
	padding-inline: 1rem;
	padding-block: 1rem;

	font-size: var(--size-xs);
	font-family: var(--font-mono);
}
</style>