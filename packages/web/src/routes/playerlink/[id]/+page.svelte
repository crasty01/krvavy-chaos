<script lang="ts">
import Icon from '@iconify/svelte';
import type { PageData } from './$types';

let { data }: { data: PageData } = $props();

const buildUrl = (urlTemplate: string | null, handle: string): string | null => {
	if (!urlTemplate) return null;
	return urlTemplate.replace('{handle}', handle);
};
</script>

<svelte:head>
	<title>{data.player.name} — Krvavá hodina odbila</title>
</svelte:head>

<section>
	<h1>{data.player.name}</h1>

	{#if data.player.socialLinks.length > 0}
		<ul class="link-list">
			{#each data.player.socialLinks as link (link.id)}
				{@const url = buildUrl(link.platform?.urlTemplate ?? null, link.handle)}
				<li>
					{#if url}
						<a href={url} target="_blank" rel="noopener noreferrer" class="platform-link">
							{#if link.platform?.icon}
								<Icon icon={link.platform.icon} width={20} height={20} />
							{:else}
								<Icon icon="material-symbols:link" width={20} height={20} />
							{/if}
							<span>{link.platform?.name ?? link.platformId}: {link.handle}</span>
						</a>
					{:else}
						<span class="platform-handle">
							{#if link.platform?.icon}
								<Icon icon={link.platform.icon} width={20} height={20} />
							{:else}
								<Icon icon="material-symbols:link" width={20} height={20} />
							{/if}
							<span>{link.platform?.name ?? link.platformId}: {link.handle}</span>
						</span>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p>Tento hráč nemá žádné sociální sítě.</p>
	{/if}
</section>

<style>
section {
	display: grid;
	align-content: center;
	padding-block: 2rem;
	max-width: 32rem;
}

h1 {
	font-size: var(--size-2xl);
	margin-bottom: 1.5rem;
}

.link-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.platform-link,
.platform-handle {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	padding: 0.6rem 0.8rem;
	border-radius: var(--border-radius);
	background-color: light-dark(var(--color-neutral-100), var(--color-neutral-800));
	text-decoration: none;
	color: inherit;
}

.platform-link:hover {
	background-color: light-dark(var(--color-neutral-200), var(--color-neutral-700));
}
</style>
