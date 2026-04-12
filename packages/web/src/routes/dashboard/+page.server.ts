import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { game, user } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const _user = await db.query.user.findFirst({
		where: eq(user.id, locals.user.id),
	});

	if (!_user?.activeGameId) {
		return { game: undefined };
	}

	const _game = await db.query.game.findFirst({
		where: eq(game.id, _user.activeGameId),
		with: { gamePlayers: true, editors: true },
	});

	return { game: _game };
};
