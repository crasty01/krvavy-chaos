import { db } from '$lib/server/db';
import { game } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const id = crypto.randomUUID();

	const _game = {
		id: id,
		name: 'Nová hra',
		script: [{ id: '_meta', name: 'Nový skript', author: locals.user.name }],
		createdBy: locals.user.id,
	};

	await db.insert(game).values(_game);

	return json(_game);
};