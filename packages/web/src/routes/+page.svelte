<script lang="ts">
	import Icon from "@iconify/svelte";
	import { authClient } from '$lib/auth-client.svelte';
	import { Button } from 'bits-ui';

	const signIn = () => {
		authClient.signIn.social({
			provider: 'twitch',
			callbackURL: '/dashboard',
		});
	};
</script>

<svelte:head>
	<title>Krvavá hodina odbila</title>
</svelte:head>

<section>
	<h1 class="title">Krvavá hodina odbila</h1>
	<p>
		Twitch overlay editor pro český Blood on the Clocktower komunitní stream
		„Krvavá hodina odbila".
	</p>
	<Button.Root data-button-variant="accent" onclick={signIn}>
		<span>Přihlásit se přes Twitch</span>
		<Icon icon="material-symbols:arrow-outward" width=20 height=20 />
	</Button.Root>
</section>

<style>

.title {
	font-size: var(--size-4xl);
}

section {
	display: grid;
	height: 100%;
	width: 100%;
	align-content: center;
	justify-items: flex-start;

	& h1 {
		text-transform: uppercase;
		font-weight: 900;
	}

	& p {
		margin-bottom: 1rem;
		font-family: var(--font-mono);
	}
}
</style>