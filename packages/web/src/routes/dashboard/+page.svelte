<script lang="ts">
import { authClient } from '$lib/auth-client.svelte';
import { Button } from 'bits-ui';
import { fromStore } from 'svelte/store';
import Game from '$lib/components/layout/Game.svelte';
import type { PageData } from './$types';
import InfoBox from '$lib/components/utils/InfoBox.svelte';
import Icon from '@iconify/svelte';
import Breadcrumbs from '$lib/components/utils/Breadcrumbs.svelte';

let session = fromStore(authClient.useSession());
let { data }: { data: PageData } = $props();

const breadcrumbs = $derived([{
	label: 'přehled',
	href: '/dashboard',
	icon: 'material-symbols:home'
}]);
</script>

<section class="breadcrumbs">
	<Breadcrumbs {breadcrumbs} />
</section>

<section class="hero">
	<h1 class="title">přehled</h1>
	<p>Vítej, {session.current.data?.user.name}!</p>
</section>

<section class="active-game">
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
.title {
	font-size: var(--size-4xl);
}

section.breadcrumbs {
	display: flex;
	flex-direction: row;
	gap: 0;

	& > :global(*):not(:first-child) {
		&::before {
			content: '/';
		}
	}
}

section.hero {
	display: grid;
	width: 100%;
	align-content: flex-start;
	justify-items: flex-start;
}

section.active-game {
	display: grid;
	width: 100%;
	align-content: flex-start;
	justify-items: flex-start;
	gap: var(--size-sm);
}
</style>