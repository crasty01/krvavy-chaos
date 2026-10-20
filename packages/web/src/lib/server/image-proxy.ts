import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { isScriptCharacter, isScriptMeta } from '@krvavy-chaos/shared/validate/script';
import type { BotcScript } from '@krvavy-chaos/shared/validate/script';

// The Twitch extension may only load images from allowlisted domains, and every allowlist change
// needs a new reviewed version. Script images (any domain) are therefore served through
// /api/extension/image on our own domain. URLs are HMAC-signed so the endpoint isn't an open proxy.

const PROXY_PATH = '/api/extension/image';

/** Enable only once the extension version with our domain in "Image Domains" is released. */
export const isImageProxyEnabled = () => env.EXTENSION_IMAGE_PROXY === 'true';

// Sub-key derived from the auth secret, so no extra env variable is needed
const getSigningKey = () => {
	if (!env.BETTER_AUTH_SECRET) throw new Error('BETTER_AUTH_SECRET is not set');
	return createHmac('sha256', env.BETTER_AUTH_SECRET).update('extension-image-proxy').digest();
};

export const signImageUrl = (url: string) =>
	createHmac('sha256', getSigningKey()).update(url).digest('base64url').slice(0, 22);

export const verifyImageUrl = (url: string, signature: string) => {
	const expected = Buffer.from(signImageUrl(url));
	const actual = Buffer.from(signature);
	return expected.length === actual.length && timingSafeEqual(expected, actual);
};

export const toProxyUrl = (origin: string, url: string) =>
	url.startsWith(`${origin}/`)
		? url
		: `${origin}${PROXY_PATH}?u=${encodeURIComponent(url)}&s=${signImageUrl(url)}`;

/** Returns a copy of the script with every image URL pointing to the proxy. */
export const proxyScriptImages = (script: BotcScript, origin: string): BotcScript =>
	script.map((entry) => {
		if (isScriptMeta(entry)) {
			return {
				...entry,
				...(entry.logo && { logo: toProxyUrl(origin, entry.logo) }),
				...(entry.background && { background: toProxyUrl(origin, entry.background) }),
			};
		}
		if (isScriptCharacter(entry) && entry.image) {
			return {
				...entry,
				image: typeof entry.image === 'string'
					? toProxyUrl(origin, entry.image)
					: entry.image.map((image) => toProxyUrl(origin, image)),
			};
		}
		return entry;
	});

const PRIVATE_IPV4 = [/^0\./, /^10\./, /^127\./, /^169\.254\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./];

/** Blocks non-http(s) schemes and internal hosts, so a signed URL can't reach internal services. */
export const isFetchableImageUrl = (url: URL) => {
	if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
	const host = url.hostname.toLowerCase();
	if (host === 'localhost' || /\.(localhost|local|internal)$/.test(host)) return false;
	// IPv6 literals — no real script image uses them
	if (host.startsWith('[')) return false;
	if (/^\d+\.\d+\.\d+\.\d+$/.test(host) && PRIVATE_IPV4.some((range) => range.test(host))) return false;
	return true;
};
