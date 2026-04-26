import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { getPlayerById, addPlayerSocialLink } from '$lib/server/actions';
import { parseBody } from '$lib/server/validate';

const SocialLinkSchema = v.object({
	platformId: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
	handle: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(100)),
});

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const player = await getPlayerById(params.id);
	if (!player) return json({ error: 'Hráč nenalezen' }, { status: 404 });
	if (player.createdBy !== locals.user.id) return json({ error: 'Nemáš oprávnění' }, { status: 403 });

	const { data, error } = await parseBody(request, SocialLinkSchema);
	if (error) return error;

	const link = await addPlayerSocialLink(params.id, data.platformId, data.handle);
	return json(link, { status: 201 });
};
