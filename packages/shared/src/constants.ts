import type { TwitchURLSearchParams } from './types/twitch';

export const EXTENSION_ID = 'jnuwmis29lpfuyczbqckyx740ie8hn';
export const EXTENSION_HOSTNAME = `${EXTENSION_ID}.ext-twitch.tv`;

export const DEFAULT_URL_PARAMS: TwitchURLSearchParams = {
	anchor: 'video_overlay',
	language: 'cs',
	locale: 'cs-CZ',
	mode: 'viewer',
	platform: 'web',
	popout: false,
	state: 'hosted_test',
};