<script lang="ts">
	import './reset.css';
	import './base.css';
	import './components.css';
	import favicon from '$lib/assets/favicon.svg';
	import Icon from "@iconify/svelte";
	import { authClient } from '$lib/auth-client.svelte';
	import { Button } from 'bits-ui';
	import { fromStore } from 'svelte/store';
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/utils/ThemeToggle.svelte';
	import { page } from '$app/state';
	import Breadcrumbs from '$lib/components/utils/Breadcrumbs.svelte';

	let { children } = $props();
	let session = fromStore(authClient.useSession());

	const signOut = () => authClient.signOut({
		fetchOptions: { onSuccess: () => goto('/') }
	});

	$inspect(page)
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header>
	<div class="lead">
		<Button.Root href="/dashboard">
			<Icon icon="material-symbols:water-drop" />
			<span class="logo">Krvavý chaos</span>
		</Button.Root>
	</div>
	<div class="tail">
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
	overflow: auto;
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