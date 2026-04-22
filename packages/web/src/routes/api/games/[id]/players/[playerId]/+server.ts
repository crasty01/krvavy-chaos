import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { canEditGame, getGamePlayerByPlayerAndGame, updateGamePlayer, removeGamePlayer } from '$lib/server/actions';
import { parseBody } from '$lib/server/validate';
import { AlignmentSchema } from '@krvavy-chaos/shared/types/script';

const PatchGamePlayerSchema = v.pipe(
	v.object({
		seatOrder: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
		characterId: v.optional(v.nullable(v.pipe(v.string(), v.minLength(1)))),
		alignment: v.optional(v.nullable(AlignmentSchema)),
	}),
	v.check(
		(val) => val.seatOrder !== undefined || val.characterId !== undefined || val.alignment !== undefined,
		'Žádná data',
	),
);

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { canEdit } = await canEditGame(params.id, locals.user.id);
	if (!canEdit) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	const gp = await getGamePlayerByPlayerAndGame(params.id, params.playerId);
	if (!gp) return json({ error: 'Hráč v hře nenalezen' }, { status: 404 });

	const { data, error } = await parseBody(request, PatchGamePlayerSchema);
	if (error) return error;

	const updated = await updateGamePlayer(gp.id, data);
	return json(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { canEdit } = await canEditGame(params.id, locals.user.id);
	if (!canEdit) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	const gp = await getGamePlayerByPlayerAndGame(params.id, params.playerId);
	if (!gp) return json({ error: 'Hráč v hře nenalezen' }, { status: 404 });

	await removeGamePlayer(gp.id);
	return new Response(null, { status: 204 });
};
