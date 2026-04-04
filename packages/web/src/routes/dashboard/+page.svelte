<script lang="ts">
import Icon from '@iconify/svelte';
import { authClient } from '$lib/auth-client.svelte';
import { Button } from 'bits-ui';
import { fromStore } from 'svelte/store';

let session = fromStore(authClient.useSession());
</script>

<section>
	<h1>Dashboard</h1>
	<p>Vítej, {session.current.data?.user.name}!</p>

	<Button.Root data-button-variant="accent" href="/dashboard/games/new">
		<span>+ vytvořit hru</span>
	</Button.Root>
</section>

<style>
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