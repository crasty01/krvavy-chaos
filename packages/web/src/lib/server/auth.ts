import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import * as env from '$env/static/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true },
	socialProviders: {
		twitch: {
			clientId: env.TWITCH_CLIENT_ID,
			clientSecret: env.TWITCH_CLIENT_SECRET,
			mapProfileToUser: (profile) => {
				console.log('Twitch profile:', profile);
				return {
					id: profile.sub,
				}; // Return an empty object to use default mapping
			},

		},
	},
	plugins: [sveltekitCookies(getRequestEvent)],
});
