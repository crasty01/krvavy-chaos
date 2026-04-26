import { json } from '@sveltejs/kit';
import { activateGame, canEditGame, getTwitchAccountId } from '$lib/server/actions';
import { sendTwitchExtensionPubSubMessage } from '$lib/server/twitch';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { exists, isCreator } = await canEditGame(params.id, locals.user.id);
	if (!exists) return json({ error: 'Hra nenalezena' }, { status: 404 });
	if (!isCreator) return json({ error: 'Nemáte oprávnění deaktivovat tuto hru' }, { status: 403 });

	await activateGame(locals.user.id, null);

	const ownerTwitchId = await getTwitchAccountId(locals.user.id);
	if (!ownerTwitchId) return json({ error: 'Nepodařilo se najít Twitch účet' }, { status: 500 });

	await sendTwitchExtensionPubSubMessage({ type: 'global' }, {
		type: 'game-update',
		data: {
			ownerId: ownerTwitchId,
			gameId: null,
		}
	});

	return json({ message: 'Hra deaktivována' }, { status: 200 });
};
