import { db } from '$lib/server/db';
import { user, account } from '$lib/server/db/auth.schema';
import { and, eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) return { user: null };

	const result = await db.query.user.findFirst({
		where: eq(user.id, locals.user.id),
		with: {
			accounts: {
				columns: { id: true, accountId: true, providerId: true },
				where: and(eq(account.providerId, 'twitch'), eq(account.userId, locals.user.id)),
				limit: 1,
			},
		},
	});

	if (!result) return { user: null };

	const { accounts, ...userFields } = result;
	return {
		user: { ...userFields, twitchAccount: accounts[0] ?? null },
	};
};