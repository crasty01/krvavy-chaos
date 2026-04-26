import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const result = await db.query.user.findFirst({
		where: eq(user.id, params.id),
	});

	if (!result) return json({ error: 'Uživatel nenalezen' }, { status: 404 });
	return json(result);
};
