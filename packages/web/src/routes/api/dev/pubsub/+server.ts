import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { TWITCH_USER_ID } from '$env/static/private';
import type { RequestHandler } from './$types';
import { sendTwitchExtensionPubSubMessage } from '$lib/server/twitch';

export const POST: RequestHandler = async ({ locals }) => {
	if (!dev) return json({ error: 'Nedostupné v produkci' }, { status: 403 });

	await sendTwitchExtensionPubSubMessage({
		type: 'broadcast',
		broadcasterId: TWITCH_USER_ID,
	}, { type: 'test', data: 'Hello from server!' });
	return new Response(null, { status: 204 });
};
