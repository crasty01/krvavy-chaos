import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createGame } from '$lib/server/actions';

export const POST: RequestHandler = async ({ locals }) => {
	const newGame = await createGame(locals.user.id, locals.user.name);
	return json(newGame, { status: 201 });
};
