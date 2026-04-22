import { db } from './db';
import { and, eq, like, or, sql } from 'drizzle-orm';
import { game, user, player, gamePlayer, gameEditor, account } from './db/schema';
import type { BotcScript, ScriptMetadata } from '@krvavy-chaos/shared/validate/script';

// ─── Users ───────────────────────────────────────────────────────────

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

// ─── Games ───────────────────────────────────────────────────────────

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

export const createGame = async (userId: string, userName: string) => {
	const id = crypto.randomUUID();
	const _meta: ScriptMetadata = { id: '_meta', name: 'Nová hra', author: userName };
	const newGame = { id, name: 'Nová hra', script: [_meta], createdBy: userId };
	await db.insert(game).values(newGame);
	return newGame;
};

export const updateGame = async (id: string, data: { name?: string; script?: BotcScript }) => {
	const [updated] = await db.update(game).set(data).where(eq(game.id, id)).returning();
	return updated ?? null;
};

export const deleteGame = async (id: string) => {
	await db.delete(game).where(eq(game.id, id));
};

export const activateGame = async (userId: string, gameId: string | null) => {
	await db.update(user).set({ activeGameId: gameId }).where(eq(user.id, userId));
};

export const canEditGame = async (gameId: string, userId: string) => {
	const [row] = await db
		.select({ createdBy: game.createdBy })
		.from(game)
		.where(eq(game.id, gameId))
		.limit(1);

	if (!row) return { exists: false, canEdit: false, isCreator: false };
	if (row.createdBy === userId) return { exists: true, canEdit: true, isCreator: true };

	const [editorRow] = await db
		.select({ gameId: gameEditor.gameId })
		.from(gameEditor)
		.where(and(eq(gameEditor.gameId, gameId), eq(gameEditor.userId, userId)))
		.limit(1);

	return { exists: true, canEdit: !!editorRow, isCreator: false };
};

// ─── Game Players ─────────────────────────────────────────────────────

export const addGamePlayer = async (gameId: string, playerId: string, seatOrder: number) => {
	const id = crypto.randomUUID();
	const [row] = await db.insert(gamePlayer).values({ id, gameId, playerId, seatOrder }).returning();
	return row;
};

export const getGamePlayerByPlayerAndGame = async (gameId: string, playerId: string) => {
	const [row] = await db
		.select()
		.from(gamePlayer)
		.where(and(eq(gamePlayer.gameId, gameId), eq(gamePlayer.playerId, playerId)))
		.limit(1);
	return row ?? null;
};

export const updateGamePlayer = async (
	id: string,
	data: { seatOrder?: number; characterId?: string | null; alignment?: 'good' | 'neutral' | 'evil' | null },
) => {
	const [updated] = await db.update(gamePlayer).set(data).where(eq(gamePlayer.id, id)).returning();
	return updated ?? null;
};

export const removeGamePlayer = async (id: string) => {
	await db.delete(gamePlayer).where(eq(gamePlayer.id, id));
};

// ─── Game Editors ─────────────────────────────────────────────────────

export const addGameEditor = async (gameId: string, userId: string) => {
	await db.insert(gameEditor).values({ gameId, userId });
};

export const removeGameEditor = async (gameId: string, userId: string) => {
	await db.delete(gameEditor).where(
		and(eq(gameEditor.gameId, gameId), eq(gameEditor.userId, userId)),
	);
};

// ─── Players ─────────────────────────────────────────────────────────

export const listPlayers = async (createdBy: string) =>
	db.select().from(player).where(eq(player.createdBy, createdBy));

export const createPlayer = async (userId: string, name: string) => {
	const id = crypto.randomUUID();
	const [row] = await db.insert(player).values({ id, name, createdBy: userId }).returning();
	return row;
};

export const getPlayerById = async (id: string) =>
	db.query.player.findFirst({ where: eq(player.id, id), with: { socialLinks: true } });

export const updatePlayer = async (id: string, data: { name?: string }) => {
	const [updated] = await db.update(player).set(data).where(eq(player.id, id)).returning();
	return updated ?? null;
};

export const deletePlayer = async (id: string) => {
	await db.delete(player).where(eq(player.id, id));
};

// ─── Twitch Accounts ─────────────────────────────────────────────────

export const getUserByTwitchId = async (twitchId: string) => {
	const acct = await db.query.account.findFirst({
		where: and(eq(account.providerId, 'twitch'), eq(account.accountId, twitchId)),
		with: { user: true },
	});
	return acct?.user ?? null;
};

export const getTwitchAccountId = async (userId: string) => {
	const acct = await db.query.account.findFirst({
		where: and(eq(account.providerId, 'twitch'), eq(account.userId, userId)),
	});
	return acct?.accountId ?? null;
};