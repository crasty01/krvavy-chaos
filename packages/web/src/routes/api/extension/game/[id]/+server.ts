import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyTwitchExtensionJWT } from '$lib/server/twitch';
import { getUserByTwitchId, getGameById } from '$lib/server/actions';

export const GET: RequestHandler = async ({ request, params }) => {
	// const authHeader = request.headers.get('Authorization');
	// const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
	// if (!token || !verifyTwitchExtensionJWT(token)) {
	// 	return json({ error: 'Neplatný token' }, { status: 401 });
	// }

	const owner = await getUserByTwitchId(params.id);
	if (!owner?.activeGameId) return json(null);

	const activeGame = await getGameById(owner.activeGameId);
	if (!activeGame) return json(null);

	const origin = new URL(request.url).origin;
	const { gamePlayers, ...rest } = activeGame;
	return json({
		...rest,
		gamePlayers: gamePlayers.map(({ player, ...gp }) => {
			const { socialLinks, ...playerRest } = player;
			return {
				...gp,
				profileUrl: socialLinks.length > 0 ? `${origin}/playerlink/${player.id}` : null,
				player: playerRest,
			};
		}),
	});
};
