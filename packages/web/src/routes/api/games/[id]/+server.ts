import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { getGameById, syncGameFull, deleteGame, canEditGame, getTwitchAccountId } from '$lib/server/actions';
import { parseBody } from '$lib/server/validate';
import { ScriptSchema } from '@krvavy-chaos/shared/validate/script';
import { sendTwitchExtensionPubSubMessage } from '$lib/server/twitch';
import { db } from '$lib/server/db';
import { account, user } from '$lib/server/db/auth.schema';
import { eq } from 'drizzle-orm';

const GamePlayerInputSchema = v.object({
	playerId: v.string(),
	seatOrder: v.pipe(v.number(), v.integer(), v.minValue(0)),
	characterId: v.optional(v.nullable(v.string())),
	alignment: v.optional(v.nullable(v.picklist(['good', 'neutral', 'evil']))),
});

const PatchGameSchema = v.pipe(
	v.object({
		name: v.optional(v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(100))),
		script: v.optional(ScriptSchema),
		editors: v.optional(v.array(v.string())),
		players: v.optional(v.array(GamePlayerInputSchema)),
	}),
	v.check(
		(val) => val.name !== undefined || val.script !== undefined || val.editors !== undefined || val.players !== undefined,
		'Žádná data',
	),
);

export const GET: RequestHandler = async ({ params }) => {
	const result = await getGameById(params.id);
	if (!result) return json({ error: 'Hra nenalezena' }, { status: 404 });
	return json(result);
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { exists, canEdit, isCreator } = await canEditGame(params.id, locals.user.id);
	if (!exists) return json({ error: 'Hra nenalezena' }, { status: 404 });
	if (!canEdit && !isCreator) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	// Only creator can change editors
	const { data, error } = await parseBody(request, PatchGameSchema);
	if (error) return error;

	const originalGame = await getGameById(params.id);
	if (!originalGame) return json({ error: 'Hra nenalezena' }, { status: 404 });

	const originalEditors = new Set(originalGame?.editors.map(editor => editor.userId) ?? []);
	const editors = new Set(data.editors);

	if (!isCreator && (editors.size !== originalEditors.size || !editors.isSubsetOf(originalEditors))) {
		return json({ error: 'Pouze tvůrce může měnit editory' }, { status: 403 });
	}

	await syncGameFull(params.id, originalGame.creator.id, {
		...data,
		players: data.players?.map((p) => ({
			...p,
			characterId: p.characterId ?? null,
			alignment: p.alignment ?? null,
		})),
	});

	const ownerTwitchId = await getTwitchAccountId(originalGame.creator.id);
	if (!ownerTwitchId) return json({ error: 'Nepodařilo se najít Twitch účet' }, { status: 500 });

	await sendTwitchExtensionPubSubMessage({
		type: 'global'
	}, {
		type: 'game-update',
		data: {
			ownerId: ownerTwitchId,
			gameId: params.id,
		}
	});

	return new Response(null, { status: 204 });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { exists, isCreator } = await canEditGame(params.id, locals.user.id);
	if (!exists) return json({ error: 'Hra nenalezena' }, { status: 404 });
	if (!isCreator) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	await deleteGame(params.id);
	return new Response(null, { status: 204 });
};
