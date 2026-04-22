import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { getPlayerById, updatePlayer, deletePlayer } from '$lib/server/actions';
import { parseBody } from '$lib/server/validate';

const PlayerSchema = v.object({
	name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(50)),
});

export const GET: RequestHandler = async ({ params, locals }) => {
	const player = await getPlayerById(params.id);
	if (!player) return json({ error: 'Hráč nenalezen' }, { status: 404 });
	if (player.createdBy !== locals.user.id) return json({ error: 'Nemáš oprávnění' }, { status: 403 });
	return json(player);
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const player = await getPlayerById(params.id);
	if (!player) return json({ error: 'Hráč nenalezen' }, { status: 404 });
	if (player.createdBy !== locals.user.id) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	const { data, error } = await parseBody(request, PlayerSchema);
	if (error) return error;

	const updated = await updatePlayer(params.id, { name: data.name });
	return json(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const player = await getPlayerById(params.id);
	if (!player) return json({ error: 'Hráč nenalezen' }, { status: 404 });
	if (player.createdBy !== locals.user.id) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	await deletePlayer(params.id);
	return new Response(null, { status: 204 });
};
