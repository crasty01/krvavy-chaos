import { error } from '@sveltejs/kit';
import { getGameById, listPlayers, listPlatforms } from '$lib/server/actions';
import type { PageServerLoad, Actions } from './$types';
import type { GameFull } from '$lib/server/db';
import type { Breadcrumb } from '@krvavy-chaos/shared/types/web';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw error(401, 'Nepřihlášen')

	const [game, allPlayers, platforms] = await Promise.all([
		getGameById(params.id),
		listPlayers(locals.user.id),
		listPlatforms(),
	]);

	if (!game) throw error(404, 'Hra nenalezena');

	const isCreator = game.createdBy === locals.user.id;
	const isEditor = game.editors.some((editor) => editor.userId === locals.user!.id);

	if (!isCreator && !isEditor) throw error(403, 'Nemáte přístup k této hře');

	return {
		game: (game satisfies GameFull),
		allPlayers,
		platforms,
		breadcrumbs: [{
			label: 'přehled',
			href: '/dashboard',
			icon: 'material-symbols:home'
		},
		{
			label: 'seznam her',
			href: '/dashboard/games',
		},
		{
			label: 'editor hry',
			href: `/dashboard/games/${game.id}`,
		}] satisfies Array<Breadcrumb>,
	};
};