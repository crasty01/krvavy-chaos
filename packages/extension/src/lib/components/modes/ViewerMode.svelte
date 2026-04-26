<script lang="ts">
import * as Anchor from '../../components/anchor';
import * as Overlay from '../../components/overlay';
import { game } from '../../functions/game.svelte';
import { TwitchExtensionStore, twitchStore } from '../../services/twitch.svelte';
import { overlayVisibility } from '../../stores/preference.svelte';

twitchStore.listen('global', async (target, contentType, message) => {
	const parsedMessage = TwitchExtensionStore.parseMessageSafe(message);
	console.log('[KRVAVKA]', { target, contentType, message: parsedMessage });
	if (!parsedMessage) return;

	switch (parsedMessage.type) {
		case 'test':
			console.log('[KRVAVKA] test type of pubsub message:', parsedMessage.data);
			break;
		case 'game-update':
			await game.handleGameUpdate(parsedMessage);
			break;
		default:
			console.log('[KRVAVKA] unknown type of pubsub message:', (parsedMessage as any).data);
			break;
	}
});

let anchor = $derived(twitchStore.urlParams.anchor);

$effect(() => {
	game.handleGameUpdate();
});
</script>

{#if anchor === 'video_overlay'}
	<Overlay.DrawerPanel>
		<Anchor.Component />
	</Overlay.DrawerPanel>
	{#if !overlayVisibility.hidden}
		<Anchor.Overlay />
	{/if}
{:else if anchor === 'panel'}
	<Anchor.Panel></Anchor.Panel>
{:else if anchor === 'component'}
	<Anchor.Component></Anchor.Component>
{:else}
	<Anchor.Unknown></Anchor.Unknown>
{/if}