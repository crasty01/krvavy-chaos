import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

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

	const isPublic = pathname === '/' || pathname.startsWith('/api/auth');

	if (!event.locals.user && !isPublic) {
		throw redirect(302, '/');
	}

	if (event.locals.user && pathname === '/') {
		throw redirect(302, '/dashboard');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleBetterAuth, handleAuthGuard);
