

export type TwitchExtensionPubSubPerms = {
  listen?: Array<string>;
  send?: Array<string>;
};

export type TwitchExtensionRole = 'broadcaster' | 'moderator' | 'viewer' | 'external';

// https://dev.twitch.tv/docs/extensions/reference#jwt-schema
export type TwitchExtensionAuthToken = {
  channel_id: string;
  exp: number;
  is_unlinked: boolean;
  opaque_user_id: string;
  pubsub_perms: TwitchExtensionPubSubPerms;
  role: TwitchExtensionRole;
  user_id?: string;
};

export type TwitchExtensionAuthHelixToken = {
  opaque_user_id: string;
  client_id: string;
  created_at: number;
}

export type TwitchExtensionAuthorized = {
	channelId: string;
	clientId: string;
	token: string;
	helixToken: string;
	userId: string;
};

export type TwitchExtensionAuthorizedParsed = {
	channelId: string;
	clientId: string;
	_token: string;
	token: TwitchExtensionAuthToken;
	_helixToken: string;
	helixToken: TwitchExtensionAuthHelixToken;
	userId: string;
};

export type TwitchExtensionContext = {
	arePlayerControlsVisible: boolean;
	bitrate: number;
	bufferSize: number;
	displayResolution: string;
	game: string;
	hlsLatencyBroadcaster: number;
	hostingInfo?: {
		hostedChannelId: string;
		hostingChannelId: string;
	};
	isFullScreen: boolean;
	isMuted: boolean;
	isPaused: boolean;
	isTheatreMode: boolean;
	language: string;
	mode: 'viewer' | 'dashboard' | 'config';
	playbackMode: 'video' | 'audio' | 'remote' | 'chat-only';
	theme: 'light' | 'dark';
	videoResolution: string;
	volume: number;
};

export type TwitchExtensionConfigSegment = {
	content: string;
	version: string;
};

export type TwitchExtensionSegmentName = 'broadcaster' | 'developer' | 'global';

export type TwitchExtensionExtConfiguration = {
	broadcaster?: TwitchExtensionConfigSegment;
	developer?: TwitchExtensionConfigSegment;
	global?: TwitchExtensionConfigSegment;
	onChanged: (callback: () => void) => void;
	set: (segment: TwitchExtensionSegmentName, version: string, content: string) => void;
};

export type TwitchExtensionURLSearchParams = {
  anchor: 'component' | 'panel' | 'video_overlay';
  language: string;
  locale: string;
  mode: 'config' | 'dashboard' | 'viewer';
  platform: 'mobile' | 'web';
  popout: boolean;
  state: 
    | 'testing' 
    | 'hosted_test' 
    | 'approved' 
    | 'released' 
    | 'ready_for_review' 
    | 'in_review' 
    | 'pending_action' 
    | 'uploading';
}

export type PubSubCallback = (target: string, contentType: string, message: string) => void;

export type TwitchExtensionExtension = {
	onAuthorized: (callback: (auth: TwitchExtensionAuthorized) => void) => void;
	onContext: (callback: (context: TwitchExtensionContext, changedKeys: Array<string>) => void) => void;
	onError: (callback: (errorValue: unknown) => void) => void;
	onHighlightChanged: (callback: (isHighlighted: boolean) => void) => void;
	onPositionChanged: (callback: (position: { x: number; y: number }) => void) => void;
	onVisibilityChanged: (callback: (isVisible: boolean, context: { game: string }) => void) => void;
	configuration: TwitchExtensionExtConfiguration;
	listen: (target: string, callback: PubSubCallback) => void;
	unlisten: (target: string, callback: PubSubCallback) => void;
	send: (target: string, contentType: string, message: string) => void;
};

export type TwitchExtensionConfigContent = any; // TODO: define this based on the actual configuration schema used in the extension