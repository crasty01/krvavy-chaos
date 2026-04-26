<script lang="ts">
import ConfigMode from './lib/components/modes/ConfigMode.svelte';
import ViewerMode from './lib/components/modes/ViewerMode.svelte';
import { iconList } from './lib/icon-list';
import { twitchStore } from './lib/services/twitch.svelte';
import { loadIcons } from '@iconify/svelte';

loadIcons(iconList);

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