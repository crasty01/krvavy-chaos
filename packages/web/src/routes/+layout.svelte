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

	let { children } = $props();
	let session = fromStore(authClient.useSession());

	const signOut = () => authClient.signOut({
		fetchOptions: { onSuccess: () => goto('/') }
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header>
	<div class="lead">
		<span class="logo">Krvavý chaos</span>
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

<style lang="postcss">
:global(#app) {
	display: grid;
	grid-template-rows: auto 1fr auto;
	min-height: 100vh;
}

main {
	padding-inline: 2rem;
}

header {
	display: flex;
	flex-direction: row;
	gap: 1rem;
	justify-content: space-between;
	align-items: center;
	padding-inline: 2rem;
	padding-block: 1rem;
}

footer {
	display: flex;
	flex-direction: row;
	gap: 1rem;
	justify-content: space-between;
	align-items: center;
	padding-inline: 2rem;
	padding-block: 1rem;

	font-size: 0.875rem;
	font-family: var(--font-mono);
}
</style>