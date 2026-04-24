import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyTwitchExtensionJWT } from '$lib/server/twitch';
import { getUserByTwitchId, getGameById } from '$lib/server/actions';

export const GET: RequestHandler = async ({ request, params }) => {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token || !verifyTwitchExtensionJWT(token)) {
		return json({ error: 'Neplatný token' }, { status: 401 });
	}

	const owner = await getUserByTwitchId(params.id);
	if (!owner?.activeGameId) return json(null);

	const activeGame = await getGameById(owner.activeGameId);
	return json(activeGame ?? null);
};
