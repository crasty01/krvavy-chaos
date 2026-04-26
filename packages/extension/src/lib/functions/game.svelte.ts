import type { TwitchExtensionPubSubMessageGameUpdate } from '@krvavy-chaos/shared/types/pubsub';
import type { ExtensionGame } from '@krvavy-chaos/shared/types/web';
import { twitchStore } from '../services/twitch.svelte';

export class Game {
	data = $state<ExtensionGame | null>(null);

	constructor() {}

	async handleGameUpdate(payload?: TwitchExtensionPubSubMessageGameUpdate) {
		const currentGameOwner = twitchStore.broadcasterConfig?.gameOwner ?? twitchStore.auth?.channelId;

		if (!currentGameOwner) {
			console.warn('Received game update but no current game owner is set, ignoring', { payload });
			return;
		}

		if (payload && payload.data.ownerId !== currentGameOwner) {
			console.warn('Received game update for different game owner, ignoring', { payload, currentGameOwner });
			return;
		}

		const response = await fetch(`https://krvavy-chaos-web.vercel.app/api/extension/game/${currentGameOwner}`, {
			headers: { Authorization: `Bearer ${twitchStore.auth?._token}` },
		});
		this.data = await response.json();
	}
}

export const game = new Game();