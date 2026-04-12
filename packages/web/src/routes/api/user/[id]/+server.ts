import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { eq, inArray } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, params }) => {
	const id = params.id;
	if (!id) {
		return json({ error: 'Missing id' }, { status: 400 });
	}

	const _user = await db.query.user.findFirst({
		where: eq(user.id, id),
	});

	if (!_user) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	return json(_user);
};
