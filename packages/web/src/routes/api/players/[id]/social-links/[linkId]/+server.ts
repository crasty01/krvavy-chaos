import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPlayerById, removePlayerSocialLink } from '$lib/server/actions';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const player = await getPlayerById(params.id);
	if (!player) return json({ error: 'Hráč nenalezen' }, { status: 404 });
	if (player.createdBy !== locals.user.id) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	await removePlayerSocialLink(params.linkId, params.id);
	return new Response(null, { status: 204 });
};
