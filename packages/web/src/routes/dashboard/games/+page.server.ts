import { eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { game, gameEditor } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import type { Breadcrumb } from '@krvavy-chaos/shared/types/web';

export const load: PageServerLoad = async ({ locals }) => {
	const ownGames = await db.query.game.findMany({
		with: { gamePlayers: true, editors: true },
		where: eq(game.createdBy, locals.user.id),
		orderBy: (game, { desc }) => [desc(game.updatedAt)],
	});

	const sharedGames = await db.query.game.findMany({
		with: {
			gamePlayers: true,
			editors: true,
		},
		where: (game, { and, ne }) => 
			and(
				ne(game.createdBy, locals.user.id),
				inArray(
					game.id,
					db.select({ gameId: gameEditor.gameId })
						.from(gameEditor)
						.where(eq(gameEditor.userId, locals.user.id))
				)
			),
		orderBy: (game, { desc }) => [desc(game.updatedAt)],
	});

	return {
		ownGames,
		sharedGames,
		breadcrumbs: [{
			label: 'přehled',
			href: '/dashboard',
			icon: 'material-symbols:home'
		},
		{
			label: 'seznam her',
			href: '/dashboard/games',
		}] satisfies Array<Breadcrumb>,
	};
};