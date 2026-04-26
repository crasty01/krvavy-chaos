import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listPlatforms } from '$lib/server/actions';

export const GET: RequestHandler = async () => {
	const platforms = await listPlatforms();
	return json(platforms);
};
