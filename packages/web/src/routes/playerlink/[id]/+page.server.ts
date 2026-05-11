import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPlayerPublic } from '$lib/server/actions';

export const load: PageServerLoad = async ({ params }) => {
	const player = await getPlayerPublic(params.id);
	if (!player) error(404, 'Hráč nenalezen');
	return { player };
};
