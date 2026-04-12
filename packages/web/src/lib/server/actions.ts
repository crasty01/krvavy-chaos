import { db } from './db';
import { eq, like, or, sql } from 'drizzle-orm';
import { game, user } from './db/schema';

export const searchUsersByName = async (query: string, limit = 20) => {
	const sanitizedQuery = query.trim();

	if (!sanitizedQuery) {
		return [];
	}

	const maxDistance = Math.max(2, Math.ceil(sanitizedQuery.length / 3));

	const results = await db
		.select()
		.from(user)
		.where(or(
			sql`fuzzy_damlev(fuzzy_translit(lower(${user.name})), fuzzy_translit(lower(${sanitizedQuery}))) <= ${maxDistance}`,
			like(sql`lower(${user.name})`, `%${sanitizedQuery.toLowerCase()}%`)
		))
		.orderBy(
			sql`fuzzy_damlev(fuzzy_translit(lower(${user.name})), fuzzy_translit(lower(${sanitizedQuery})))`
		)
		.limit(limit);

	return results;
};

export const getGameById = async (id: string) => await db.query.game.findFirst({
	where: eq(game.id, id),
	with: {
		gamePlayers: {
			with: { player: true },
			orderBy: (gp, { asc }) => [asc(gp.seatOrder)],
		},
		editors: {
			with: { user: true },
		},
		creator: true,
	},
});