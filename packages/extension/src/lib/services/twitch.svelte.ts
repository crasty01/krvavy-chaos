import { jwtDecode } from "jwt-decode";

import { DEFAULT_URL_PARAMS } from '@krvavy-chaos/shared/constants';
import type {
	TwitchAuthorizedParsed,
	TwitchContext,
	TwitchSegmentName,
	PubSubCallback,
	TwitchExtension,
	TwitchURLSearchParams,
	TwitchConfigContent,
} from '@krvavy-chaos/shared/types/twitch';

// -- Reactive Twitch store --

class TwitchStore {
	extension: TwitchExtension;
	auth = $state<TwitchAuthorizedParsed | null>(null);
	context = $state<TwitchContext | null>(null);

	broadcasterConfig = $state<TwitchConfigContent | null>(null);
	developerConfig = $state<TwitchConfigContent | null>(null);
	globalConfig = $state<TwitchConfigContent | null>(null);

	isVisible = $state(true);
	isHighlighted = $state(false);
	position = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	urlParams: TwitchURLSearchParams;

	isAuthorized = $derived(this.auth !== null);
	isDarkTheme = $derived(this.context?.theme === 'dark');
	channelId = $derived(this.auth?.channelId ?? null);
	token = $derived(this.auth?.token ?? null);
	mode = $derived(this.context?.mode ?? null);

	debugJson = $derived.by(() => JSON.stringify({
		auth: this.auth,
		context: this.context,
		broadcasterConfig: this.broadcasterConfig,
		developerConfig: this.developerConfig,
		globalConfig: this.globalConfig,
		isVisible: this.isVisible,
		isHighlighted: this.isHighlighted,
		position: this.position,
		urlParams: this.urlParams,
		isAuthorized: this.isAuthorized,
		isDarkTheme: this.isDarkTheme,
		channelId: this.channelId,
		mode: this.mode,
	}, null, 2));

	#listeners = new Map<string, Set<PubSubCallback>>();

	constructor() {
		const params = new URLSearchParams(window.location.search);
		this.urlParams = {
			anchor: (params.get('anchor') ?? DEFAULT_URL_PARAMS.anchor) as TwitchURLSearchParams['anchor'],
			language: params.get('language') ?? DEFAULT_URL_PARAMS.language,
			locale: params.get('locale') ?? DEFAULT_URL_PARAMS.locale,
			mode: (params.get('mode') ?? DEFAULT_URL_PARAMS.mode) as TwitchURLSearchParams['mode'],
			platform: (params.get('platform') ?? DEFAULT_URL_PARAMS.platform) as TwitchURLSearchParams['platform'],
			popout: params.get('popout') === 'true',
			state: (params.get('state') ?? DEFAULT_URL_PARAMS.state) as TwitchURLSearchParams['state'],
		};

		this.extension = window.Twitch?.ext!;
		if (!this.extension) {
			console.warn('[TwitchStore] Twitch Extension Helper not available');
			return;
		}

		this.initialize();
	}

	initialize() {
		this.extension.onAuthorized((auth) => {
			this.auth = {
				...auth,
				token: jwtDecode(auth.token),
				helixToken: jwtDecode(auth.helixToken),
			};
		});

		this.extension.onContext((ctx) => {
			this.context = ctx;
		});

		this.extension.onError((errorValue) => {
			console.error('[TwitchExtensionStore]', errorValue);
		});

		this.extension.onVisibilityChanged((visible) => {
			this.isVisible = visible;
		});

		this.extension.onHighlightChanged((isHighlighted) => {
			this.isHighlighted = isHighlighted;
		});

		this.extension.onPositionChanged((position) => {
			this.position = position;
		});

		this.extension.configuration.onChanged(() => {
			const cfg = this.extension.configuration;
			this.broadcasterConfig = cfg.broadcaster ? JSON.stringify(cfg.broadcaster.content) : null;
			this.developerConfig = cfg.developer ? JSON.stringify(cfg.developer.content) : null;
			this.globalConfig = cfg.global ? JSON.stringify(cfg.global.content) : null;
		});

		this.listen('broadcast', (target, contentType, message) => {
			if (target === 'broadcast' && contentType === 'application/json') {
				try {
					const parsed = JSON.parse(message);
					this.broadcasterConfig = parsed;
				} catch (e) {
					console.error('Failed to parse broadcaster config message', e);
				}
			}
		});
	};

	// -- Configuration --

	async updateConfig(segment: TwitchSegmentName, version: string, content: TwitchConfigContent) {
		this.extension.configuration.set(segment, version, JSON.stringify(content));
		this.extension.send('broadcast', 'application/json', content); // can use 'global' or "wisper-<userId>", but for purpuse of this extension, broadcasting to all viewers is fine
	};

	/** Listen for raw PubSub messages on a target. */
	listen(target: string, callback: PubSubCallback) {
		if (!this.#listeners.has(target)) {
			this.#listeners.set(target, new Set());
		}
		this.#listeners.get(target)!.add(callback);
		this.extension.listen(target, callback);
	};

	/** Stop listening for PubSub messages. */
	unlisten(target: string, callback: PubSubCallback) {
		this.#listeners.get(target)?.delete(callback);
		this.extension.unlisten(target, callback);
	};
}

export const twitchStore = new TwitchStore();