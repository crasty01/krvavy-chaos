<script lang="ts">
	import InputGroup from '$lib/components/inputgroup/InputGroup.svelte';
	import AvatarWithLabel from '$lib/components/utils/AvatarWithLabel.svelte';
	import InfoBox from '$lib/components/utils/InfoBox.svelte';
	import type { User } from '$lib/server/db';
	import Icon from '@iconify/svelte';
	import { Button } from 'bits-ui';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';

	let {
		selectedUserIds = $bindable(),
	}: {
		selectedUserIds: SvelteSet<string>;
	} = $props();
	 
	let search = $state('');
	let userMap = new SvelteMap<string, User>();
	let searchedUserIds = new SvelteSet<string>();

	const searchUsers = async (query: string) => {
		const response = await fetch(`/api/user/search?q=${query}&limit=${10 + selectedUserIds.size}`);
		const users = await response.json();

		return users;
	}

	const getUsers = async (ids: Array<string>) => {
		const responses = await Promise.all(ids.map(id => fetch(`/api/user/${id}`)));
		const users = await Promise.all(responses.map(response => response.json()));

		return users;
	}

	$effect(() => {
		searchUsers(search).then(users => {
			searchedUserIds.clear();
			for (const user of users) {
				if (searchedUserIds.size < 10 && !selectedUserIds.has(user.id)) {
					searchedUserIds.add(user.id);
				}
				userMap.set(user.id, user);
			}
		});
	});

	$effect(() => {
		getUsers([...selectedUserIds].filter(id => !userMap.has(id))).then(users => {
			for (const user of users) {
				console.log(user)
				userMap.set(user.id, user);
			}
		});
	});
</script>

<section class="editors">
	<div class="editors__search">
		<InputGroup>
			<input type="text" name="gameName" id="gameName" bind:value={search}>
			{#snippet lead()}
				<Icon icon="material-symbols:search" />
			{/snippet}
		</InputGroup>
	</div>
	<div class="editors__searched">
		{#if searchedUserIds.size > 0 && search.length > 0}
			<ul class="list">
				{#each searchedUserIds as userId}
					{@const user = userMap.get(userId)!}
					{#key userId}
						<li class="list-item">
							<AvatarWithLabel name={user.name} src={user.image} />
							<Button.Root data-button-round type="button" onclick={() => selectedUserIds.add(user.id)}>
								<Icon icon="material-symbols:add" />
							</Button.Root>
						</li>
					{/key}
				{/each}
			</ul>
		{:else}
		<InfoBox>
			vyhedávání neodpoídá žádný uživatel
		</InfoBox>
		{/if}
	</div>
	<div class="editors__selected">
		{#if selectedUserIds.size > 0}
			<ul class="list">
				{#each selectedUserIds as userId}
					{@const user = userMap.get(userId)}
					{#if user}
						{#key userId}
							<li class="list-item">
								<AvatarWithLabel name={user.name} src={user.image} />
								<Button.Root data-button-round type="button" onclick={() => selectedUserIds.delete(user.id)}>
									<Icon icon="material-symbols:delete" />
								</Button.Root>
							</li>
						{/key}
					{/if}
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
.editors {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-areas: "search ." "searched selected";
	gap: var(--size-sm) var(--size-xl);

	& .editors__search {
		grid-area: search;
	}

	& .editors__searched {
		grid-area: searched;
	}

	& .editors__selected {
		grid-area: selected;
	}
}

.list {
	list-style: none;
	margin: 0;
	padding: 0;
	/* padding-inline: var(--size-sm); */
	display: grid;
	gap: .2rem;

	& .list-item {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		gap: var(--size-sm);
		align-items: center;
		padding: 0.4rem 0.4rem;
		padding-right: 0.7rem;
		/* border-radius: var(--border-radius); */
		border-radius: 999999px;
		font-weight: 500;
		color: light-dark(var(--color-neutral-900), var(--color-neutral-50));

		&:hover {
			background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
		}
	}
}
</style>