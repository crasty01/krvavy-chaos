import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { game } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Nepřihlášen');

	const id = crypto.randomUUID();

	await db.insert(game).values({
		id: id,
		name: 'Nová hra',
		script: [{ id: '_meta', name: 'Nový skript', author: locals.user.name }],
		createdBy: locals.user.id,
	});

	throw redirect(303, `/dashboard/games/${id}`);
};
