import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyTwitchExtensionJWT } from '$lib/server/twitch';
import { getUserByTwitchId, getGameById } from '$lib/server/actions';

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader?.toLowerCase()?.startsWith('bearer ')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const payload = verifyTwitchExtensionJWT(authHeader.slice(7));
	if (!payload) {
		return json({ error: 'Invalid token' }, { status: 401 });
	}

	const broadcaster = await getUserByTwitchId(payload.channel_id);
	if (!broadcaster) {
		return json({ error: 'Broadcaster not found' }, { status: 404 });
	}

	if (!broadcaster.activeGameId) {
		return json(null);
	}

	const activeGame = await getGameById(broadcaster.activeGameId);
	return json(activeGame ?? null);
};
