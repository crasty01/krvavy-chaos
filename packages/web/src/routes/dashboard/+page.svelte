<script lang="ts">
import { authClient } from '$lib/auth-client.svelte';
import { Button } from 'bits-ui';
import { fromStore } from 'svelte/store';
import Game from '$lib/components/layout/Game.svelte';
import type { PageData } from './$types';
	import InfoBox from '$lib/components/utils/InfoBox.svelte';
	import Icon from '@iconify/svelte';

let session = fromStore(authClient.useSession());
let { data }: { data: PageData } = $props();
</script>

<section>
	<h1 class="title">Přehled</h1>
	<p>Vítej, {session.current.data?.user.name}!</p>
</section>

<section>
	<h2>aktivní hra</h2>

	{#if data.game}
		<Game
			id={data.game.id}
			name={data.game.name}
			updatedAt={data.game.updatedAt}
			editorsLength={data.game.editors.length}
			playersLength={data.game.gamePlayers.length}
		/>
	{:else}
		<InfoBox>
			nenalezena žádná aktivní hra
		</InfoBox>
	{/if}

	<Button.Root data-button-variant="accent" href="/dashboard/games">
		<span>přejít na seznam her</span>
		<Icon icon="material-symbols:arrow-outward" width=20 height=20 />
	</Button.Root>
</section>

<style>
section {
	display: grid;
	width: 100%;
	align-content: flex-start;
	justify-items: flex-start;

	& h1, & h2 {
		text-transform: uppercase;
		font-weight: 900;
	}

	& p {
		margin-bottom: 1rem;
		font-family: var(--font-mono);
	}
}
</style>