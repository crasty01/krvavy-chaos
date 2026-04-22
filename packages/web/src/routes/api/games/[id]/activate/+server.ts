import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { activateGame, canEditGame } from '$lib/server/actions';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { exists } = await canEditGame(params.id, locals.user.id);
	if (!exists) return json({ error: 'Hra nenalezena' }, { status: 404 });

	await activateGame(locals.user.id, params.id);
	return new Response(null, { status: 204 });
};
