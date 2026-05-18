import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyTwitchExtensionJWT, getTwitchChannelById } from '$lib/server/twitch';
import { getUserByTwitchId, getGameById } from '$lib/server/actions';
import type { ExtensionOverlaySettings } from '@krvavy-chaos/shared/types/web';

const DEFAULT_OVERLAY: ExtensionOverlaySettings = { offsetX: 0, offsetY: 0, radius: 40, tokenSize: 9.3 };

export const GET: RequestHandler = async ({ request, params }) => {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
	const decodedToken = token ? verifyTwitchExtensionJWT(token) : null;
	if (!decodedToken) {
		return json({ error: 'Neplatný token' }, { status: 401 });
	}

	const channelOwner = await getTwitchChannelById(decodedToken.channel_id);
	const gameOwner = await getUserByTwitchId(params.id);
	const activeGame = gameOwner?.activeGameId ? await getGameById(gameOwner.activeGameId) : null;
	if (!gameOwner || !gameOwner.activeGameId || !channelOwner || !activeGame) {
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

	console.log({
		isGameMaster,
		gameOwnerTwitchId: params.id,
		channelOwnerTwitchId: decodedToken.channel_id,
		channelOwner,
		gameOwner,
		activeGame,
		channelGamePlayer,
	});

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

	const origin = new URL(request.url).origin;
	const { gamePlayers, ...rest } = activeGame;

	return json({
		...rest,
		gamePlayers: gamePlayers.map(({ player, overlayOffsetX: _ox, overlayOffsetY: _oy, overlayRadius: _or, overlayTokenSize: _ts, ...gp }) => {
			const { socialLinks, ...playerRest } = player;
			return {
				...gp,
				profileUrl: socialLinks.length > 0 ? `${origin}/playerlink/${player.id}` : null,
				player: playerRest,
			};
		}),
		broadcasterOverlay,
	});
};
