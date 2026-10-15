import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { apikey, partnerGame, user } from '$lib/server/db/schema';
import type { Breadcrumb } from '@krvavy-chaos/shared/types/web';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const _user = await db.query.user.findFirst({
		where: eq(user.id, locals.user.id),
		columns: { externalControl: true },
		with: { activeGame: { with: { gamePlayers: true, editors: true } } },
	});

	const _partnerGame = await db.query.partnerGame.findFirst({
		where: eq(partnerGame.userId, locals.user.id),
		columns: { name: true, players: true, updatedAt: true },
	});

	const apiKeys = await db
		.select({
			id: apikey.id,
			name: apikey.name,
			start: apikey.start,
			createdAt: apikey.createdAt,
			lastRequest: apikey.lastRequest,
		})
		.from(apikey)
		.where(eq(apikey.userId, locals.user.id))
		.orderBy(desc(apikey.createdAt));

	console.log('/dashboard load');
	return {
		game: _user?.activeGame ?? null,
		externalControl: _user?.externalControl ?? false,
		partnerGame: _partnerGame
			? { name: _partnerGame.name, playersLength: _partnerGame.players.length, updatedAt: _partnerGame.updatedAt }
			: null,
		apiKeys,
		breadcrumbs: [{
			label: 'přehled',
			href: '/dashboard',
			icon: 'material-symbols:home'
		}] satisfies Array<Breadcrumb>,
	};
};

console.log('dashboard page.server.ts loaded');
