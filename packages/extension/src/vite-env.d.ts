import type { TwitchExtension } from './lib/types/twitch';

declare global {
	interface Window {
		Twitch?: { ext?: TwitchExtension };
	};
};

export {};