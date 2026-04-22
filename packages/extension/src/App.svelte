<script lang="ts">
import { twitchStore } from './lib/services/twitch.svelte';
import * as Anchor from './lib/components/anchor';

twitchStore.listen('broadcast', (target, contentType, message) => {
	console.log('[KRVAVKA]', { target, contentType, message });
	// TODO: handle updates
});

let anchor = $derived(twitchStore.urlParams.anchor);
</script>

<pre>{ twitchStore.debugJson }</pre>

{#if anchor === 'video_overlay'}
	<Anchor.Overlay></Anchor.Overlay>
{:else if anchor === 'panel'}
	<Anchor.Panel></Anchor.Panel>
{:else if anchor === 'component'}
	<Anchor.Component></Anchor.Component>
{:else}
	<Anchor.Unknown></Anchor.Unknown>
{/if}