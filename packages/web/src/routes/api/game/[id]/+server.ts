import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGameById } from '$lib/server/actions';

export const GET: RequestHandler = async ({ url, params }) => {
	const id = params.id;
	if (!id) {
		return json({ error: 'Missing id' }, { status: 400 });
	}

	const game = await getGameById(id);

	if (!game) {
		return json({ error: 'Game not found' }, { status: 404 });
	}

	return json(game);
};
