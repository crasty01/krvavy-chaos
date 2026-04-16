import { db } from '$lib/server/db';
import { game } from '$lib/server/db/schema';
import type { ScriptMetadata } from '@krvavy-chaos/shared/validate/script';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const id = crypto.randomUUID();

	const _metadata: ScriptMetadata = {
		id: '_meta',
		name: 'Nová hra',
		author: locals.user.name,
	};

	const _game = {
		id: id,
		name: 'Nová hra',
		script: [_metadata],
		createdBy: locals.user.id,
	};

	await db.insert(game).values(_game);

	return json(_game);
};