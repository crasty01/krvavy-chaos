import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyTwitchExtensionJWT, getTwitchChannelById } from '$lib/server/twitch';
import { getUserByTwitchId, getGameById } from '$lib/server/actions';
import { getPartnerGame } from '$lib/server/partner';
import { isImageProxyEnabled, proxyScriptImages } from '$lib/server/image-proxy';
import type { PartnerGame, PublicUser } from '$lib/server/db';
import type { ExtensionGame, ExtensionOverlaySettings } from '@krvavy-chaos/shared/types/web';

const DEFAULT_OVERLAY: ExtensionOverlaySettings = { offsetX: 0, offsetY: 0, radius: 40, tokenSize: 9.3 };

/** Builds the extension payload from the partner app's game; players are synthesized, not DB rows. */
const toExtensionGame = (game: PartnerGame, owner: PublicUser, channelLogin: string): ExtensionGame => ({
	id: game.id,
	name: game.name,
	script: game.script,
	createdBy: owner.id,
	createdAt: game.createdAt,
	updatedAt: game.updatedAt,
	creator: { id: owner.id, name: owner.name, image: owner.image },
	gamePlayers: game.players.map((p, seatOrder) => ({
		id: `${game.id}:${p.key}`,
		gameId: game.id,
		playerId: p.key,
		seatOrder,
		characterId: p.characterId,
		alignment: p.alignment,
		profileUrl: p.twitch ? `https://twitch.tv/${p.twitch}` : null,
		player: { id: p.key, name: p.name, createdBy: owner.id, createdAt: game.createdAt, updatedAt: game.updatedAt },
	})),
	// Each streamer has their own layout; channels the app didn't send get the defaults
	broadcasterOverlay: game.overlays[channelLogin.toLowerCase()] ?? DEFAULT_OVERLAY,
});

export const GET: RequestHandler = async ({ request, params, url }) => {
	// Script images go through our domain, the only one the extension needs allowlisted
	const withProxiedImages = (game: ExtensionGame): ExtensionGame =>
		isImageProxyEnabled() ? { ...game, script: proxyScriptImages(game.script, url.origin) } : game;

	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
	const decodedToken = token ? verifyTwitchExtensionJWT(token) : null;
	if (!decodedToken) {
		return json({ error: 'Neplatný token' }, { status: 401 });
	}

	const channelOwner = await getTwitchChannelById(decodedToken.channel_id);
	const gameOwner = await getUserByTwitchId(params.id);
	if (!gameOwner || !channelOwner) {
		return json(null, { status: 404 });
	}

	// With external control enabled, the partner app's game replaces the manually activated one
	if (gameOwner.externalControl) {
		const partner = await getPartnerGame(gameOwner.id);
		if (!partner) return json(null, { status: 404 });
		return json(withProxiedImages(toExtensionGame(partner, gameOwner, channelOwner.login)));
	}

	const activeGame = gameOwner.activeGameId ? await getGameById(gameOwner.activeGameId) : null;
	if (!activeGame) {
		return json(null, { status: 404 });
	}

	const isGameMaster = params.id === decodedToken.channel_id;
	const channelGamePlayer = activeGame.gamePlayers.find((gamePlayer) =>
		gamePlayer.player.socialLinks.some(
			(socialLink) =>
				socialLink.platformId === 'twitch' &&
				socialLink.handle.toLowerCase() === channelOwner.login.toLowerCase(),
		),
	);

	let broadcasterOverlay: ExtensionOverlaySettings = isGameMaster ? {
		offsetX: activeGame.overlayOffsetX ?? DEFAULT_OVERLAY.offsetX,
		offsetY: activeGame.overlayOffsetY ?? DEFAULT_OVERLAY.offsetY,
		radius: activeGame.overlayRadius ?? DEFAULT_OVERLAY.radius,
		tokenSize: activeGame.overlayTokenSize ?? DEFAULT_OVERLAY.tokenSize,
	} : {
		offsetX: channelGamePlayer?.overlayOffsetX ?? activeGame.overlayOffsetX ?? DEFAULT_OVERLAY.offsetX,
		offsetY: channelGamePlayer?.overlayOffsetY ?? activeGame.overlayOffsetY ?? DEFAULT_OVERLAY.offsetY,
		radius: channelGamePlayer?.overlayRadius ?? activeGame.overlayRadius ?? DEFAULT_OVERLAY.radius,
		tokenSize: channelGamePlayer?.overlayTokenSize ?? activeGame.overlayTokenSize ?? DEFAULT_OVERLAY.tokenSize,
	};

	// Explicit allow-list: this payload is readable by every Twitch viewer
	return json(withProxiedImages({
		id: activeGame.id,
		name: activeGame.name,
		script: activeGame.script,
		createdBy: activeGame.createdBy,
		createdAt: activeGame.createdAt,
		updatedAt: activeGame.updatedAt,
		creator: {
			id: activeGame.creator.id,
			name: activeGame.creator.name,
			image: activeGame.creator.image,
		},
		gamePlayers: activeGame.gamePlayers.map((gp) => {
			const twitchLink = gp.player.socialLinks.find((sl) => sl.platformId === 'twitch');
			return {
				id: gp.id,
				gameId: gp.gameId,
				playerId: gp.playerId,
				seatOrder: gp.seatOrder,
				characterId: gp.characterId,
				alignment: gp.alignment,
				profileUrl: twitchLink ? `https://twitch.tv/${twitchLink.handle}` : null,
				player: {
					id: gp.player.id,
					name: gp.player.name,
					createdBy: gp.player.createdBy,
					createdAt: gp.player.createdAt,
					updatedAt: gp.player.updatedAt,
				},
			};
		}),
		broadcasterOverlay,
	}));
};
