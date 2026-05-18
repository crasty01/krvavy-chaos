import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_EXTENSION_SECRET, TWITCH_USER_ID } from '$env/static/private';
import jwt from 'jsonwebtoken';
import type { TwitchAuthToken, TwitchUser } from '@krvavy-chaos/shared/types/twitch';
import type { TwitchExtensionAuthToken } from '@krvavy-chaos/shared/types/extension';
import type { TwitchExtensionPubSubMessage, TwitchExtensionPubSubMessageOptions } from '@krvavy-chaos/shared/types/pubsub';

let expirationTime = 0;
let currentToken: TwitchAuthToken | null = null;

export const createAndCacheTwitchToken = async () => {
	const time = Date.now();
	const res = await fetch('https://id.twitch.tv/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: TWITCH_CLIENT_ID,
			client_secret: TWITCH_CLIENT_SECRET,
			grant_type: 'client_credentials',
		}),
	});

	if (!res.ok) {
		throw new Error(`Failed to get Twitch token: ${res.status} ${res.statusText}`);
	}

	const data = await res.json() as TwitchAuthToken;
	currentToken = data;
	expirationTime = time + ((data.expires_in - 60) * 1000); // Subtract 1 minute to be safe
	return data;
};

export const getTwitchToken = async () => {
	if (currentToken && expirationTime - Date.now() > 60 * 1000) {
		return currentToken;
	}
	
	return await createAndCacheTwitchToken();
};

export const sendTwitchExtensionPubSubMessage = async (options: TwitchExtensionPubSubMessageOptions, message: TwitchExtensionPubSubMessage) => {
	const extensionToken = jwt.sign({
		user_id: TWITCH_USER_ID,
		role: 'external',
		channel_id: options.type === 'broadcast' ? options.broadcasterId : 'all',
		pubsub_perms: {
			send: [options.type]
		}
	}, Buffer.from(TWITCH_EXTENSION_SECRET, 'base64'), { expiresIn: '1h' });

	await fetch('https://api.twitch.tv/helix/extensions/pubsub', {
		method: 'POST',
		headers: {
			'Client-ID': TWITCH_CLIENT_ID,
			'Authorization': `Bearer ${extensionToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			target: [options.type],
			...(options.type === 'broadcast' ? { broadcaster_id: options.broadcasterId } : {}),
			is_global_broadcast: options.type === 'global',
			message: JSON.stringify(message),
		}),
	});
};

export const verifyTwitchExtensionJWT = (token: string): TwitchExtensionAuthToken | null => {
	try {
		return jwt.verify(token, Buffer.from(TWITCH_EXTENSION_SECRET, 'base64')) as TwitchExtensionAuthToken;
	} catch {
		return null;
	}
};

/** Returns the Twitch login (username) for a given Twitch user ID, or null on failure. */
export const getTwitchChannelById = async (twitchId: string) => {
	const appToken = await getTwitchToken();
	const res = await fetch(`https://api.twitch.tv/helix/users?id=${encodeURIComponent(twitchId)}`, {
		headers: {
			'Client-ID': TWITCH_CLIENT_ID,
			'Authorization': `Bearer ${appToken.access_token}`,
		},
	});
	if (!res.ok) return null;
	const data = await res.json() as { data: Array<TwitchUser> };
	return data.data[0] ?? null;
};