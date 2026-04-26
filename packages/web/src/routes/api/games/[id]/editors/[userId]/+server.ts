import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { canEditGame, removeGameEditor } from '$lib/server/actions';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { isCreator } = await canEditGame(params.id, locals.user.id);
	if (!isCreator) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	await removeGameEditor(params.id, params.userId);
	return new Response(null, { status: 204 });
};
