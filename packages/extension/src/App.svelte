<script lang="ts">
import ConfigMode from './lib/components/modes/ConfigMode.svelte';
import ViewerMode from './lib/components/modes/ViewerMode.svelte';
import { twitchStore } from './lib/services/twitch.svelte';

let mode = $derived(twitchStore.urlParams.mode);
</script>

{#if twitchStore.broadcasterConfig}
	{#if mode === 'config'}
		<ConfigMode />
	{:else if mode === 'dashboard'}
		<ConfigMode />
	{:else if mode === 'viewer'}
		<ViewerMode />
	{/if}
{/if}