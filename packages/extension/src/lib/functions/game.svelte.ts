import type { TwitchExtensionPubSubMessageGameUpdate } from '@krvavy-chaos/shared/types/pubsub';
import type { ExtensionGame } from '@krvavy-chaos/shared/types/web';
import { twitchStore } from '../services/twitch.svelte';

export class Game {
	data = $state<ExtensionGame | null>(null);
	loading = $state(true);
	#loadingTimeout: ReturnType<typeof setTimeout> | null = setTimeout(() => {
		this.loading = false;
	}, 10_000);

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

		if (this.loading) {
			this.loading = false;
			if (this.#loadingTimeout !== null) {
				clearTimeout(this.#loadingTimeout);
				this.#loadingTimeout = null;
			}
		}
	}
}

export const game = new Game();