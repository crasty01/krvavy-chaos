import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getGameById } from '$lib/server/actions';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw error(401, 'Nepřihlášen')

	const game = await getGameById(params.id);

	if (!game) throw error(404, 'Hra nenalezena');

	const isCreator = game.createdBy === locals.user.id;
	const isEditor = game.editors.some((e) => e.userId === locals.user!.id);

	if (!isCreator && !isEditor) throw error(403, 'Nemáte přístup k této hře');

	return game;
};

export const actions: Actions = {
	updateScript: async ({ request, params, locals }) => {
		if (!locals.user) {
			throw error(401, 'Nepřihlášen');
		}
		
		// validate data, update script in database, and send Twitch PubSub message to notify clients about the update
	},
};
