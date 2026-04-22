import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { listPlayers, createPlayer } from '$lib/server/actions';
import { parseBody } from '$lib/server/validate';

const PlayerSchema = v.object({
	name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(50)),
});

export const GET: RequestHandler = async ({ locals }) => {
	const players = await listPlayers(locals.user.id);
	return json(players);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { data, error } = await parseBody(request, PlayerSchema);
	if (error) return error;

	const player = await createPlayer(locals.user.id, data.name);
	return json(player, { status: 201 });
};
