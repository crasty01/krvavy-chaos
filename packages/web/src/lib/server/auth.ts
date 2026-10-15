import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { apiKey } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true },
	socialProviders: {
		twitch: {
			clientId: env.TWITCH_CLIENT_ID,
			clientSecret: env.TWITCH_CLIENT_SECRET,
		},
	},
	plugins: [
		// Keys are only accepted by /api/partner/game — enableSessionForAPIKeys stays off,
		// so a leaked key can't be used as a full login to the rest of the API
		apiKey({
			defaultPrefix: 'kc_',
			// Plugin default is 10 requests per day
			rateLimit: { enabled: true, timeWindow: 1000 * 60, maxRequests: 60 },
		}),
		sveltekitCookies(getRequestEvent),
	],
});
