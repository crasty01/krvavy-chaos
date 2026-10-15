import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { setExternalControl } from '$lib/server/actions';
import { getPartnerGame, notifyGameUpdate } from '$lib/server/partner';
import { parseBody } from '$lib/server/validate';

const ControlSchema = v.object({
	enabled: v.boolean(),
});

/** Session-authenticated toggle: hand the Twitch extension over to the partner app, or take it back. */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { data, error } = await parseBody(request, ControlSchema);
	if (error) return error;

	const updated = await setExternalControl(locals.user.id, data.enabled);
	if (!updated) return json({ error: 'Uživatel nenalezen' }, { status: 404 });

	const partnerGame = data.enabled ? await getPartnerGame(locals.user.id) : null;
	await notifyGameUpdate(locals.user.id, data.enabled ? (partnerGame?.id ?? null) : updated.activeGameId);

	return json({ enabled: data.enabled });
};
