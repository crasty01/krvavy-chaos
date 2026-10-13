import { db } from './db';
import type { GamePlayer, User } from './db';
import { and, eq, like, or, sql, inArray, notInArray } from 'drizzle-orm';
import { game, user, player, gamePlayer, gameEditor, account, platform, playerSocialLink } from './db/schema';
import type { BotcScript, BotcScriptMeta } from '@krvavy-chaos/shared/validate/script';

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
			with: {
				player: {
					with: { socialLinks: { with: { platform: true } } }
				}
			},
			orderBy: (gp, { asc }) => [asc(gp.seatOrder)],
		},
		// Only public user columns — this result is sent to the dashboard and the Twitch extension
		editors: {
			with: { user: { columns: { id: true, name: true, image: true } } },
		},
		creator: {
			columns: { id: true, name: true, image: true },
		},
	},
});
export const createGame = async (userId: string, userName: string) => {
	const id = crypto.randomUUID();
	const _meta: BotcScriptMeta = { id: '_meta', name: 'Nová hra', author: userName };
	const newGame = { id, name: 'Nová hra', script: [_meta], createdBy: userId };
	await db.insert(game).values(newGame);
	return newGame;
};

export const updateGame = async (id: string, data: { name?: string; script?: BotcScript; overlayOffsetX?: number | null; overlayOffsetY?: number | null; overlayRadius?: number | null; overlayTokenSize?: number | null }) => {
	const [updated] = await db.update(game).set(data).where(eq(game.id, id)).returning();
	return updated ?? null;
};

export const syncGameFull = async (
	gameId: string,
	creatorId: string,
	data: {
		name?: string;
		script?: BotcScript;
		editors?: Array<string>;
		players?: Array<Pick<GamePlayer, 'playerId' | 'seatOrder' | 'characterId' | 'alignment'>>;
		overlayOffsetX?: number | null;
		overlayOffsetY?: number | null;
		overlayRadius?: number | null;
		overlayTokenSize?: number | null;
	},
) => {
	await db.transaction(async (tx) => {
		// 1. Update name + script + game-level overlay
		if (data.name !== undefined || data.script !== undefined || data.overlayOffsetX !== undefined || data.overlayOffsetY !== undefined || data.overlayRadius !== undefined || data.overlayTokenSize !== undefined) {
			await tx.update(game)
				.set({
					...(data.name !== undefined && { name: data.name }),
					...(data.script !== undefined && { script: data.script }),
					...(data.overlayOffsetX !== undefined && { overlayOffsetX: data.overlayOffsetX }),
					...(data.overlayOffsetY !== undefined && { overlayOffsetY: data.overlayOffsetY }),
					...(data.overlayRadius !== undefined && { overlayRadius: data.overlayRadius }),
					...(data.overlayTokenSize !== undefined && { overlayTokenSize: data.overlayTokenSize }),
				})
				.where(eq(game.id, gameId));
		}
		// 2. Sync editors
		if (data.editors !== undefined) {
			const desired = data.editors.filter((id) => id !== creatorId);
			const existing = await tx
				.select({ userId: gameEditor.userId })
				.from(gameEditor)
				.where(eq(gameEditor.gameId, gameId));
			const existingIds = existing.map((e) => e.userId).filter((id) => id !== creatorId);
			const toAdd = desired.filter((id) => !existingIds.includes(id));
			const toRemove = existingIds.filter((id) => !desired.includes(id));
			if (toAdd.length > 0) {
				await tx.insert(gameEditor).values(toAdd.map((userId) => ({ gameId, userId })));
			}
			if (toRemove.length > 0) {
				await tx.delete(gameEditor).where(
					and(eq(gameEditor.gameId, gameId), inArray(gameEditor.userId, toRemove)),
				);
			}
		}
		// 3. Sync game-players
		if (data.players !== undefined) {
			const desired = data.players;
			const desiredPlayerIds = desired.map((p) => p.playerId);
			const existing = await tx
				.select()
				.from(gamePlayer)
				.where(eq(gamePlayer.gameId, gameId));
			// Remove players no longer in the list
			const toRemove = existing.filter((gp) => !desiredPlayerIds.includes(gp.playerId));
			if (toRemove.length > 0) {
				await tx.delete(gamePlayer).where(
					and(eq(gamePlayer.gameId, gameId), inArray(gamePlayer.playerId, toRemove.map((r) => r.playerId))),
				);
			}
			// Upsert each desired player
			for (const p of desired) {
				const existingRow = existing.find((gp) => gp.playerId === p.playerId);
				if (existingRow) {
					await tx.update(gamePlayer)
						.set({ seatOrder: p.seatOrder, characterId: p.characterId ?? null, alignment: p.alignment ?? null })
						.where(eq(gamePlayer.id, existingRow.id));
				} else {
					await tx.insert(gamePlayer).values({
						id: crypto.randomUUID(),
						gameId,
						playerId: p.playerId,
						seatOrder: p.seatOrder,
						characterId: p.characterId ?? null,
						alignment: p.alignment ?? null,
					});
				}
			}
		}
	});
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
	data: { seatOrder?: number; characterId?: string | null; alignment?: 'good' | 'neutral' | 'evil' | null; overlayOffsetX?: number | null; overlayOffsetY?: number | null; overlayRadius?: number | null; overlayTokenSize?: number | null },
) => {
	const [updated] = await db.update(gamePlayer).set(data).where(eq(gamePlayer.id, id)).returning();
	return updated ?? null;
};

export const removeGamePlayer = async (id: string) => {
	await db.delete(gamePlayer).where(eq(gamePlayer.id, id));
};

export const addGameEditor = async (gameId: string, userId: string) => {
	await db.insert(gameEditor).values({ gameId, userId });
};

export const removeGameEditor = async (gameId: string, userId: string) => {
	await db.delete(gameEditor).where(
		and(eq(gameEditor.gameId, gameId), eq(gameEditor.userId, userId)),
	);
};

export const listPlayers = async (createdBy: string) =>
	db.select().from(player).where(eq(player.createdBy, createdBy));
export const createPlayer = async (userId: string, name: string) => {
	const id = crypto.randomUUID();
	const [row] = await db.insert(player).values({ id, name, createdBy: userId }).returning();
	return row;
};

export const getPlayerById = async (id: string) =>
	db.query.player.findFirst({ where: eq(player.id, id), with: { socialLinks: true } });

export const getPlayerPublic = async (id: string) => db.query.player.findFirst({
	where: eq(player.id, id),
	columns: { id: true, name: true },
	with: { socialLinks: { with: { platform: true } } },
});

export const updatePlayer = async (id: string, data: { name?: string }) => {
	const [updated] = await db.update(player).set(data).where(eq(player.id, id)).returning();
	return updated ?? null;
};

export const deletePlayer = async (id: string) => {
	await db.delete(player).where(eq(player.id, id));
};

export const listPlatforms = async () => db.select().from(platform);

export const addPlayerSocialLink = async (playerId: string, platformId: string, handle: string) => {
	const id = crypto.randomUUID();
	const [row] = await db.insert(playerSocialLink).values({ id, playerId, platformId, handle }).returning();
	return row;
};

export const removePlayerSocialLink = async (id: string, playerId: string) => {
	await db.delete(playerSocialLink).where(
		and(eq(playerSocialLink.id, id), eq(playerSocialLink.playerId, playerId)),
	);
};

export const getUserByTwitchId = async (twitchId: string): Promise<User | null> => {
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