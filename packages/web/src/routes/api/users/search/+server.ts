import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchUsersByName } from '$lib/server/actions';

export const GET: RequestHandler = async ({ url, locals }) => {
	const query = url.searchParams.get('q') ?? '';
	const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);

	const results = await searchUsersByName(query, limit + 1);
	const users = results.filter((u) => u.id !== locals.user?.id).slice(0, limit);
	return json(users);
};
