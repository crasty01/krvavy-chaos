import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from './db';
import type { PartnerGame } from './db';
import { partnerGame, user } from './db/schema';
import type { PartnerPlayer } from './db/schema';
import { auth } from './auth';
import { getTwitchAccountId } from './actions';
import { sendTwitchExtensionPubSubMessage } from './twitch';
import { getScriptMeta } from '@krvavy-chaos/shared/validate/script';
import type { BotcScript, BotcScriptMeta } from '@krvavy-chaos/shared/validate/script';
import type { ExtensionOverlaySettings } from '@krvavy-chaos/shared/types/web';

const DEFAULT_NAME = 'Externí aplikace';

/** Resolves `Authorization: Bearer <api key>` to the key owner's user id. */
export const authenticateApiKey = async (
	request: Request,
): Promise<{ userId: string; error?: never } | { userId?: never; error: Response }> => {
	const header = request.headers.get('Authorization');
	const key = header?.startsWith('Bearer ') ? header.slice(7).trim() : '';
	if (!key) return { error: json({ error: 'Chybí API klíč' }, { status: 401 }) };

	const result = await auth.api.verifyApiKey({ body: { key } });
	if (!result.valid || !result.key) {
		if (result.error?.code === 'RATE_LIMITED') {
			const tryAgainIn = (result.error as { details?: { tryAgainIn?: number } }).details?.tryAgainIn;
			return {
				error: json({ error: 'Příliš mnoho požadavků' }, {
					status: 429,
					headers: tryAgainIn ? { 'Retry-After': String(Math.ceil(tryAgainIn / 1000)) } : undefined,
				}),
			};
		}
		return { error: json({ error: 'Neplatný API klíč' }, { status: 401 }) };
	}

	return { userId: result.key.userId };
};

/** Tells the Twitch extension of the user's channel to re-fetch the game. */
export const notifyGameUpdate = async (userId: string, gameId: string | null) => {
	const ownerTwitchId = await getTwitchAccountId(userId);
	if (!ownerTwitchId) return false;

	await sendTwitchExtensionPubSubMessage({ type: 'global' }, {
		type: 'game-update',
		data: { ownerId: ownerTwitchId, gameId },
	});
	return true;
};

export const getPartnerOwner = async (userId: string) =>
	(await db.query.user.findFirst({
		where: eq(user.id, userId),
		columns: { id: true, name: true, externalControl: true },
	})) ?? null;

export const getPartnerGame = async (userId: string): Promise<PartnerGame | null> =>
	(await db.query.partnerGame.findFirst({ where: eq(partnerGame.userId, userId) })) ?? null;

type PartnerGameState = {
	name: string;
	script: BotcScript;
	players: Array<PartnerPlayer>;
	overlays: Record<string, ExtensionOverlaySettings>;
};

/**
 * Stores the partner app's game as sent. Fields left out keep their stored value,
 * except `name`: without it the script's `_meta` name is used (shown in the extension's panel header).
 *
 * A different `externalGameId` starts a new game: the row gets a new `id`. The extension keys the viewer's
 * reveal/guess choice and guesses by game id, so viewers are asked again and start with no guesses.
 */
export const savePartnerGame = async (
	owner: { id: string; name: string },
	input: Partial<PartnerGameState> & { externalGameId?: string },
): Promise<{ game: PartnerGame; changed: boolean; newGame: boolean }> => {
	const existing = await getPartnerGame(owner.id);
	const defaultMeta: BotcScriptMeta = { id: '_meta', name: DEFAULT_NAME, author: owner.name };
	const script = input.script ?? existing?.script ?? [defaultMeta];
	const next: PartnerGameState = {
		name: input.name ?? getScriptMeta(script)?.name ?? DEFAULT_NAME,
		script,
		players: input.players ?? existing?.players ?? [],
		overlays: input.overlays ?? existing?.overlays ?? {},
	};

	if (existing) {
		const newGame = input.externalGameId !== undefined && input.externalGameId !== existing.externalGameId;
		const current: PartnerGameState = {
			name: existing.name,
			script: existing.script,
			players: existing.players,
			overlays: existing.overlays,
		};
		// Unchanged pushes must not trigger PubSub — every message makes all viewers re-fetch
		if (!newGame && JSON.stringify(current) === JSON.stringify(next)) return { game: existing, changed: false, newGame: false };

		const [game] = await db.update(partnerGame)
			.set({
				...next,
				...(newGame && { id: crypto.randomUUID(), externalGameId: input.externalGameId, createdAt: new Date() }),
			})
			.where(eq(partnerGame.userId, owner.id))
			.returning();
		return { game, changed: true, newGame };
	}

	const [game] = await db.insert(partnerGame)
		.values({ id: crypto.randomUUID(), userId: owner.id, externalGameId: input.externalGameId ?? null, ...next })
		.returning();
	return { game, changed: true, newGame: true };
};
