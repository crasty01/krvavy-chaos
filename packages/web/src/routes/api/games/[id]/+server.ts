import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { getGameById, updateGame, deleteGame, canEditGame } from '$lib/server/actions';
import { parseBody } from '$lib/server/validate';
import { ScriptSchema } from '@krvavy-chaos/shared/types/script';

const PatchGameSchema = v.pipe(
	v.object({
		name: v.optional(v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(100))),
		script: v.optional(ScriptSchema),
	}),
	v.check((val) => val.name !== undefined || val.script !== undefined, 'Žádná data'),
);

export const GET: RequestHandler = async ({ params }) => {
	const result = await getGameById(params.id);
	if (!result) return json({ error: 'Hra nenalezena' }, { status: 404 });
	return json(result);
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { canEdit } = await canEditGame(params.id, locals.user.id);
	if (!canEdit) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	const { data, error } = await parseBody(request, PatchGameSchema);
	if (error) return error;

	const updated = await updateGame(params.id, data);
	return json(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { exists, isCreator } = await canEditGame(params.id, locals.user.id);
	if (!exists) return json({ error: 'Hra nenalezena' }, { status: 404 });
	if (!isCreator) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	await deleteGame(params.id);
	return new Response(null, { status: 204 });
};
