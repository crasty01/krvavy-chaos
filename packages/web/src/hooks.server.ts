import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { EXTENSION_HOSTNAME } from '@krvavy-chaos/shared/constants';

const EXTENSION_ORIGIN = `https://${EXTENSION_HOSTNAME}`;

const handleCors: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname.startsWith('/api/extension')) {
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': EXTENSION_ORIGIN,
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Authorization, Content-Type',
					'Access-Control-Max-Age': '86400',
				},
			});
		}

		const response = await resolve(event);
		response.headers.set('Access-Control-Allow-Origin', EXTENSION_ORIGIN);
		return response;
	}

	return resolve(event);
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

const handleAuthGuard: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	const isPublic =
		pathname === '/' ||
		pathname === '/privacy' ||
		pathname.startsWith('/api/auth') ||
		pathname.startsWith('/playerlink') ||
		pathname.startsWith('/api/extension');

	if (!event.locals.user && !isPublic) {
		if (pathname.startsWith('/api/')) {
			return new Response(JSON.stringify({ error: 'Nepřihlášen' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		throw redirect(302, '/');
	}

	if (event.locals.user && pathname === '/') {
		throw redirect(302, '/dashboard');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleCors, handleBetterAuth, handleAuthGuard);
