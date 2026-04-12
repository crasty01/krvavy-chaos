import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { game, gameEditor } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const ownGames = await db.query.game.findMany({
		where: eq(game.createdBy, locals.user.id),
		with: { gamePlayers: true, editors: true },
		orderBy: (g, { desc }) => [desc(g.updatedAt)],
	});

	const editorEntries = await db.query.gameEditor.findMany({
		where: eq(gameEditor.userId, locals.user.id),
		with: { game: { with: { gamePlayers: true, editors: true } } },
	});

	const sharedGames = editorEntries
		.map((e) => e.game)
		.filter((g) => g.createdBy !== locals.user!.id);

	return { ownGames, sharedGames };
};
