import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { AlignmentSchema, BotcScriptSchema, getScriptCharacters } from '@krvavy-chaos/shared/validate/script';
import { authenticateApiKey, getPartnerGame, getPartnerOwner, notifyGameUpdate, savePartnerGame } from '$lib/server/partner';
import { parseBody } from '$lib/server/validate';

// Authenticated by API key (Authorization: Bearer <key>), not by session — see hooks.server.ts

const TwitchLoginSchema = v.pipe(
	v.string(),
	v.trim(),
	v.regex(/^@?\w{1,25}$/, 'Neplatný Twitch login'),
	v.transform((login) => login.replace(/^@/, '').toLowerCase()),
);

// Unknown keys (e.g. `dead`) are stripped by v.object — the extension can't display them yet
const PartnerPlayerSchema = v.object({
	seat: v.pipe(v.number(), v.integer(), v.minValue(1)),
	name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(50)),
	twitch: v.optional(v.nullable(TwitchLoginSchema)),
	characterId: v.optional(v.nullable(v.pipe(v.string(), v.minLength(1)))),
	alignment: v.optional(v.nullable(AlignmentSchema)),
});

const OverlaySchema = v.object({
	offsetX: v.number(),
	offsetY: v.number(),
	radius: v.pipe(v.number(), v.minValue(0)),
	tokenSize: v.pipe(v.number(), v.minValue(0)),
});

const hasUniqueValues = (values: Array<string>) => new Set(values).size === values.length;

const PutGameSchema = v.pipe(
	v.object({
		name: v.optional(v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(100))),
		// The partner app's own game id; a different value starts a new game for viewers
		gameId: v.optional(v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(100))),
		script: v.optional(BotcScriptSchema),
		players: v.optional(v.pipe(
			v.array(PartnerPlayerSchema),
			v.maxLength(30),
			v.check((players) => hasUniqueValues(players.map((p) => String(p.seat))), 'Čísla sedadel se opakují'),
			v.check((players) => hasUniqueValues(players.map((p) => p.name.toLowerCase())), 'Jména hráčů se opakují'),
			v.check((players) => hasUniqueValues(players.flatMap((p) => (p.twitch ? [p.twitch] : []))), 'Twitch loginy se opakují'),
			// Lowest seat = top of the circle, then clockwise; gaps in `seat` close up
			v.transform((players) => [...players].sort((a, b) => a.seat - b.seat)),
		)),
		// Keyed by the Twitch login of the streamer's channel; null clears all channels
		overlay: v.optional(v.nullable(v.pipe(
			v.record(TwitchLoginSchema, OverlaySchema),
			v.check((overlays) => Object.keys(overlays).length <= 50, 'Příliš mnoho kanálů'),
		))),
	}),
	v.check(
		(val) => val.gameId !== undefined || val.name !== undefined || val.script !== undefined
			|| val.players !== undefined || val.overlay !== undefined,
		'Žádná data',
	),
);

// Sorted so a different key order in the request doesn't count as a change
const sortKeys = <T>(record: Record<string, T>) =>
	Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));

export const GET: RequestHandler = async ({ request }) => {
	const { userId, error } = await authenticateApiKey(request);
	if (error) return error;

	const owner = await getPartnerOwner(userId);
	if (!owner) return json({ error: 'Uživatel nenalezen' }, { status: 404 });

	const game = await getPartnerGame(userId);
	return json({
		controlEnabled: owner.externalControl,
		gameId: game?.externalGameId ?? null,
		updatedAt: game?.updatedAt ?? null,
	});
};

export const PUT: RequestHandler = async ({ request }) => {
	const { userId, error: authError } = await authenticateApiKey(request);
	if (authError) return authError;

	const { data, error } = await parseBody(request, PutGameSchema);
	if (error) return error;

	const owner = await getPartnerOwner(userId);
	if (!owner) return json({ error: 'Uživatel nenalezen' }, { status: 404 });

	const { game, changed, newGame } = await savePartnerGame(owner, {
		externalGameId: data.gameId,
		name: data.name,
		script: data.script,
		players: data.players?.map((p) => ({
			key: p.twitch ? `twitch:${p.twitch}` : `name:${p.name.toLowerCase()}`,
			name: p.name,
			twitch: p.twitch ?? null,
			characterId: p.characterId ?? null,
			alignment: p.alignment ?? null,
		})),
		overlays: data.overlay === undefined ? undefined : sortKeys(data.overlay ?? {}),
	});

	if (changed && owner.externalControl) await notifyGameUpdate(userId, game.id);

	// The extension only renders characters defined as full objects in the script
	const scriptCharacterIds = new Set(getScriptCharacters(game.script).map((c) => c.id));
	const unknownCharacterIds = [...new Set(
		game.players.flatMap((p) => (p.characterId && !scriptCharacterIds.has(p.characterId) ? [p.characterId] : [])),
	)];

	return json({
		gameId: game.externalGameId,
		controlEnabled: owner.externalControl,
		changed,
		newGame,
		warnings: unknownCharacterIds.length > 0
			? [`Postavy nejsou ve skriptu jako celé objekty a nezobrazí se: ${unknownCharacterIds.join(', ')}`]
			: [],
	});
};
