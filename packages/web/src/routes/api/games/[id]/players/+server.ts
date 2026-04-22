import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { canEditGame, addGamePlayer } from '$lib/server/actions';
import { parseBody } from '$lib/server/validate';

const AddGamePlayerSchema = v.object({
	playerId: v.pipe(v.string(), v.minLength(1)),
	seatOrder: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const { canEdit } = await canEditGame(params.id, locals.user.id);
	if (!canEdit) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	const { data, error } = await parseBody(request, AddGamePlayerSchema);
	if (error) return error;

	const row = await addGamePlayer(params.id, data.playerId, data.seatOrder);
	return json(row, { status: 201 });
};
