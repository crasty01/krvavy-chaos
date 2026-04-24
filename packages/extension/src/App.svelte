<script lang="ts">
import * as Anchor from './lib/components/anchor';
import { handleGameUpdate } from './lib/functions/game.svelte';
import { TwitchExtensionStore, twitchStore } from './lib/services/twitch.svelte';

twitchStore.listen('global', async (target, contentType, message) => {
	const parsedMessage = TwitchExtensionStore.parseMessageSafe(message);
	console.log('[KRVAVKA]', { target, contentType, message: parsedMessage });
	if (!parsedMessage) return;

	switch (parsedMessage.type) {
		case 'test':
			console.log('[KRVAVKA] test type of pubsub message:', parsedMessage.data);
			break;
		case 'game-update':
			await handleGameUpdate(parsedMessage);
			break;
		default:
			console.log('[KRVAVKA] unknown type of pubsub message:', (parsedMessage as any).data);
			break;
	}
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