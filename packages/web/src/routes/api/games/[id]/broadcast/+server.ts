import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { canEditGame, getGameById, getTwitchAccountId } from '$lib/server/actions';
import { sendTwitchExtensionPubSubMessage } from '$lib/server/twitch';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { canEdit } = await canEditGame(params.id, locals.user.id);
	if (!canEdit) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	const gameData = await getGameById(params.id);
	if (!gameData) return json({ error: 'Hra nenalezena' }, { status: 404 });

	const twitchId = await getTwitchAccountId(gameData.createdBy);
	if (!twitchId) return json({ error: 'Twitch účet nenalezen' }, { status: 400 });

	await sendTwitchExtensionPubSubMessage(twitchId, { type: 'test', data: null });
	return new Response(null, { status: 204 });
};
