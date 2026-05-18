import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyTwitchExtensionJWT, getTwitchChannelById } from '$lib/server/twitch';
import { getUserByTwitchId, getGameById } from '$lib/server/actions';
import type { ExtensionOverlaySettings } from '@krvavy-chaos/shared/types/web';

const DEFAULT_OVERLAY: ExtensionOverlaySettings = { offsetX: 0, offsetY: 0, radius: 40, tokenSize: 9.3 };

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
	const decodedToken = token ? verifyTwitchExtensionJWT(token) : null;
	if (!decodedToken) {
		return json({ error: 'Neplatný token' }, { status: 401 });
	}

	// channel_id comes from the verified JWT — not from the URL parameter
	const channelOwner = await getUserByTwitchId(decodedToken.channel_id);
	if (!channelOwner?.activeGameId) return json(null);

	const activeGame = await getGameById(channelOwner.activeGameId);
	if (!activeGame) return json(null);

	// Resolve overlay: game master (game creator) → game-level; player (matched via Twitch social link) → player-level; fallback → defaults.
	const isGameMaster = channelOwner.id === activeGame.createdBy;
	let broadcasterOverlay: ExtensionOverlaySettings;
	if (isGameMaster) {
		broadcasterOverlay = {
			offsetX: activeGame.overlayOffsetX ?? DEFAULT_OVERLAY.offsetX,
			offsetY: activeGame.overlayOffsetY ?? DEFAULT_OVERLAY.offsetY,
			radius: activeGame.overlayRadius ?? DEFAULT_OVERLAY.radius,
			tokenSize: activeGame.overlayTokenSize ?? DEFAULT_OVERLAY.tokenSize,
		};
	} else {
		const channel = await getTwitchChannelById(decodedToken.channel_id);

		const channelGamePlayer = channel?.login
			? activeGame.gamePlayers.find((gp) =>
					gp.player.socialLinks.some(
						(sl) =>
							sl.platformId === 'twitch' &&
							sl.handle.toLowerCase() === channel.login.toLowerCase(),
					),
			  )
			: undefined;

		broadcasterOverlay = channelGamePlayer ? {
			offsetX: channelGamePlayer.overlayOffsetX ?? DEFAULT_OVERLAY.offsetX,
			offsetY: channelGamePlayer.overlayOffsetY ?? DEFAULT_OVERLAY.offsetY,
			radius: channelGamePlayer.overlayRadius ?? DEFAULT_OVERLAY.radius,
			tokenSize: channelGamePlayer.overlayTokenSize ?? DEFAULT_OVERLAY.tokenSize,
		} : { ...DEFAULT_OVERLAY };
	}

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
