import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { platform } from '$lib/server/db/schema';

const PLATFORMS = [
	{ id: 'twitch', name: 'Twitch', urlTemplate: 'https://twitch.tv/{handle}', icon: 'simple-icons:twitch' },
	{ id: 'youtube', name: 'YouTube', urlTemplate: 'https://youtube.com/@{handle}', icon: 'simple-icons:youtube' },
	{ id: 'kick', name: 'Kick', urlTemplate: 'https://kick.com/{handle}', icon: 'simple-icons:kick' },
	{ id: 'instagram', name: 'Instagram', urlTemplate: 'https://instagram.com/{handle}', icon: 'simple-icons:instagram' },
];

export const GET: RequestHandler = async () => {
	if (!dev) return json({ error: 'Nedostupné v produkci' }, { status: 403 });

	const rows = await db
		.insert(platform)
		.values(PLATFORMS)
		.onConflictDoNothing()
		.returning();

	return json({ inserted: rows.length, platforms: rows });
};
