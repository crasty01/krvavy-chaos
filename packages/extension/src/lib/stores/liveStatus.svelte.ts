import { twitchStore } from '../services/twitch.svelte';

export const LIVE_STALE_MS = 54 * 60 * 1000;

export const getTwitchHandle = (profileUrl: string | null): string | null =>
	profileUrl?.startsWith('https://twitch.tv/') ? profileUrl.slice('https://twitch.tv/'.length) : null;

export class LiveStatus {
	liveLogins = $state<Set<string>>(new Set());
	#lastChecked = 0;

	get lastChecked() { return this.#lastChecked; }

	isStale = () => Date.now() - this.#lastChecked >= LIVE_STALE_MS;

	isLive = (twitchHandle: string) => this.liveLogins.has(twitchHandle.toLowerCase());

	async refresh(twitchHandles: Array<string>) {
		if (twitchHandles.length === 0) return;

		const helixToken = twitchStore.auth?._helixToken;
		const clientId = twitchStore.auth?.clientId;
		if (!helixToken || !clientId) return;

		const params = twitchHandles.map(h => `user_login=${encodeURIComponent(h)}`).join('&');
		try {
			const res = await fetch(`https://api.twitch.tv/helix/streams?${params}&first=100`, {
				headers: {
					'Client-ID': clientId,
					'Authorization': `Extension ${helixToken}`,
				},
			});
			if (!res.ok) return;
			const data = await res.json() as { data: Array<{ user_login: string }> };
			this.liveLogins = new Set(data.data.map(s => s.user_login.toLowerCase()));
		} catch {
			// silently ignore — live status is best-effort
		}
		this.#lastChecked = Date.now();
	}
}

export const liveStatus = new LiveStatus();
