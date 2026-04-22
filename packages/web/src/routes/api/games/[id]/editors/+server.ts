import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { canEditGame, addGameEditor } from '$lib/server/actions';
import { parseBody } from '$lib/server/validate';

const AddEditorSchema = v.object({
	userId: v.pipe(v.string(), v.minLength(1)),
});

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const { isCreator } = await canEditGame(params.id, locals.user.id);
	if (!isCreator) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	const { data, error } = await parseBody(request, AddEditorSchema);
	if (error) return error;

	await addGameEditor(params.id, data.userId);
	return new Response(null, { status: 204 });
};
