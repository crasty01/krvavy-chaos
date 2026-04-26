import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { Breadcrumb } from '@krvavy-chaos/shared/types/web';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const _user = await db.query.user.findFirst({
		where: eq(user.id, locals.user.id),
		with: { activeGame: { with: { gamePlayers: true, editors: true } } },
	});

	console.log('/dashboard load');
	return {
		game: _user?.activeGame ?? null,
		breadcrumbs: [{
			label: 'přehled',
			href: '/dashboard',
			icon: 'material-symbols:home'
		}] satisfies Array<Breadcrumb>,
	};
};

console.log('dashboard page.server.ts loaded');