import type { RequestHandler } from './$types';
import { isFetchableImageUrl, verifyImageUrl } from '$lib/server/image-proxy';

// Serves script images to the Twitch extension from our own (allowlisted) domain — see image-proxy.ts

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 8_000;

class BlockedUrlError extends Error {}

// Errors aren't cached, so a temporary upstream failure doesn't stick in the CDN
const fail = (status: number, message: string) =>
	new Response(message, {
		status,
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
	});

/** Follows redirects manually so every hop goes through isFetchableImageUrl. */
const fetchImage = async (target: URL) => {
	const signal = AbortSignal.timeout(TIMEOUT_MS);
	let current = target;
	for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
		if (!isFetchableImageUrl(current)) throw new BlockedUrlError();
		const response = await fetch(current, { redirect: 'manual', signal, headers: { Accept: 'image/*' } });
		const location = response.headers.get('location');
		if (response.status >= 300 && response.status < 400 && location) {
			current = new URL(location, current);
			continue;
		}
		return response;
	}
	throw new Error('Too many redirects');
};

export const GET: RequestHandler = async ({ url }) => {
	const target = url.searchParams.get('u');
	const signature = url.searchParams.get('s');
	if (!target || !signature) return fail(400, 'Chybí parametry');
	if (!verifyImageUrl(target, signature)) return fail(403, 'Neplatný podpis');

	let targetUrl: URL;
	try {
		targetUrl = new URL(target);
	} catch {
		return fail(400, 'Neplatná adresa');
	}

	let upstream: Response;
	try {
		upstream = await fetchImage(targetUrl);
	} catch (error) {
		if (error instanceof BlockedUrlError) return fail(400, 'Nepovolená adresa');
		return fail(502, 'Obrázek se nepodařilo načíst');
	}

	if (!upstream.ok || !upstream.body) return fail(502, 'Obrázek se nepodařilo načíst');

	const contentType = upstream.headers.get('content-type') ?? '';
	if (!contentType.toLowerCase().startsWith('image/')) return fail(415, 'Adresa nevede na obrázek');
	if (Number(upstream.headers.get('content-length') ?? 0) > MAX_BYTES) return fail(413, 'Obrázek je příliš velký');

	// Buffered (max 5 MB) so an oversized image gets a proper 413 and only complete images are cached
	const reader = upstream.body.getReader();
	const chunks: Array<Uint8Array> = [];
	let size = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		size += value.byteLength;
		if (size > MAX_BYTES) {
			await reader.cancel();
			return fail(413, 'Obrázek je příliš velký');
		}
		chunks.push(value);
	}

	const body = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}

	return new Response(body, {
		headers: {
			'Content-Type': contentType,
			'Content-Length': String(size),
			// Signed URLs are stable, so the browser and Vercel's CDN can cache them
			'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
			'X-Content-Type-Options': 'nosniff',
			// An SVG opened directly must not run scripts on our origin
			'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
		},
	});
};
