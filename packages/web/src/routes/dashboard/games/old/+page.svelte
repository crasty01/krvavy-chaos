<script module lang="ts">
import { loadIcons } from '@iconify/svelte';

loadIcons(['material-symbols:arrow-back', 'svg-spinners:8-dots-rotate', 'material-symbols:save'])
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from 'bits-ui';
	import { enhance } from '$app/forms';
	import { useDelayedBoolean } from '$lib/functions/util.svelte';
	import type { PageData } from './$types';
	import InputGroup from '$lib/components/inputgroup/InputGroup.svelte';
	import Editors from './Editors.old.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	let { data }: { data: PageData } = $props();

	$inspect(data);

	// svelte-ignore state_referenced_locally
	let gameName = $state(data.name);
	let saving = useDelayedBoolean(false, 500);
	let selectedUserIds = new SvelteSet<string>();
</script>

<svelte:head>
	<title>{gameName}</title>
</svelte:head>

<form
	class="editor"
	method="POST"
	action="?/updateGame"
	use:enhance={() => {
		saving.current = true;
		return async ({ update }) => {
			saving.current = false;
			await update();
		};
	}}
>
	<header>
		<div class="lead">
			<Button.Root data-button-round href="/dashboard/games">
				<Icon icon="material-symbols:arrow-back" width={20} height={20} />
			</Button.Root>
			<h2>{gameName}</h2>
		</div>

		<div class="tail">
			<Button.Root type="submit" data-button-variant="accent" disabled={saving.current}>
				<Icon icon={saving.current ? 'svg-spinners:8-dots-rotate' : 'material-symbols:save'} width={18} height={18} />
				<span>Uložit</span>
			</Button.Root>
		</div>
	</header>
		
	<!-- <pre>
		name of the game
		editors: searchable, calls api be that searches database by user names, ifo, aht if you can't find your editor, he needs to login for the first time
		players: searchable from existing players, same as users, but with the ability to create new, probably a dialog popup wiht a form for creating one
		players already selected will have their own row in a list, each row will be editable for game specific data (seatOrder, characterId, alignment) + edit button, that opens dialog popup with editable player game nonspecific data, like name and social links
		script editor: import, export - both in valid botc schema; adding, creating new, deleting, editing custom characters (name, id [při vytváření generováno z name + 'cz'], image [vždy 2 linky na obrázek, 3 pokud se jedná o 'traveller'], tým, a jiné, edice být nemusí), a úprava všech tagů pro Script Metadata (ty jsou jen jedny ve skriptu, jako první item)
	</pre> -->

	<section class="game-info">
		<InputGroup>
			<input type="text" name="gameName" id="gameName">
			{#snippet lead()}
				<Icon icon="material-symbols:search" />
			{/snippet}
		</InputGroup>
	</section>

	<Editors bind:selectedUserIds />

	

	<footer></footer>
</form>

<!-- <InputGroup>
	<input type="text" name="" id="">
	{#snippet lead()}
		<Icon icon="material-symbols:search" />
	{/snippet}
</InputGroup>
<InputGroup isTextarea>
	<textarea name="" id=""></textarea>
	{#snippet lead()}
		<Icon icon="material-symbols:search" />
	{/snippet}
</InputGroup> -->

<style>
.editor {
	display: grid;
	justify-content: stretch;
	align-content: flex-start;
	gap: 1.5rem;
	min-height: 100%;
	width: 100%;
	margin-inline: auto;

	& header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		& .lead {
			display: flex;
			align-items: center;
			gap: 1.5rem;

			& h2 {
				font-size: var(--size-xl);
			}
		}

		/* & .tail {} */
	}
}
</style>
