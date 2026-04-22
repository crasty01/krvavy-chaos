import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_EXTENSION_SECRET, TWITCH_USER_ID } from '$env/static/private';
import jwt from 'jsonwebtoken';
import type { TwitchAuthToken } from '@krvavy-chaos/shared/types/twitch';
import type { TwitchExtensionAuthToken } from '@krvavy-chaos/shared/types/extension';
import type { TwitchExtensionPubSubMessage } from '@krvavy-chaos/shared/types/pubsub';

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

export const sendTwitchExtensionPubSubMessage = async (broadcasterId: string, message: TwitchExtensionPubSubMessage) => {
	const extensionToken = jwt.sign({
		user_id: TWITCH_USER_ID,
		role: 'external',
		channel_id: broadcasterId,
		pubsub_perms: {
			send: ["broadcast"]
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
			target: ["broadcast"],
			broadcaster_id: broadcasterId,
			is_global_broadcast: false,
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