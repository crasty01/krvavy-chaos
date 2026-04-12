<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	$inspect(data);
</script>

<svelte:head>
	<title>{data.name}</title>
</svelte:head>

<pre>{JSON.stringify(data, null, 2)}</pre>

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
</style>
