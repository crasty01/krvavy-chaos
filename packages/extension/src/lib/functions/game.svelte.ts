import type { TwitchExtensionPubSubMessageGameUpdate } from '@krvavy-chaos/shared/types/pubsub';
import { twitchStore } from '../services/twitch.svelte';

export const handleGameUpdate = async (payload: TwitchExtensionPubSubMessageGameUpdate) => {
	const currentGameOwner = twitchStore.broadcasterConfig.gameOwner ?? twitchStore.auth?.channelId;

	if (!currentGameOwner) {
		console.warn('Received game update but no current game owner is set, ignoring', { payload });
		return;
	}

	if (payload.data.ownerId !== currentGameOwner) {
		console.warn('Received game update for different game owner, ignoring', { payload, currentGameOwner });
		return;
	}

	const response = await fetch(`/api/extension/game/${payload.data.ownerId}`, {
		headers: { Authorization: `Bearer ${twitchStore.auth?._token}` },
	});
	const data = await response.json();

	console.log('Received game update, new data:', data);
}