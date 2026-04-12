import { TWITCH_USER_ID } from '$env/static/private';
import { sendTwitchExtensionPubSubMessage } from '$lib/server/twitch';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const response = await sendTwitchExtensionPubSubMessage(TWITCH_USER_ID, { type: 'test', data: 'Hello from server!' });
	return new Response(JSON.stringify(response), {
		headers: { 'Content-Type': 'application/json' },
	});
};