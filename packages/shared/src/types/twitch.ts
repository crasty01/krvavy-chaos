export type TwitchPubSubPerms = {
  listen?: Array<string>;
  send?: Array<string>;
};

export type TwitchRole = 'broadcaster' | 'moderator' | 'viewer' | 'external';

// https://dev.twitch.tv/docs/extensions/reference#jwt-schema
export type TwitchAuthToken = {
  channel_id: string;
  exp: number;
  is_unlinked: boolean;
  opaque_user_id: string;
  pubsub_perms: TwitchPubSubPerms;
  role: TwitchRole;
  user_id?: string;
};

export type TwitchAuthHelixToken = {
  opaque_user_id: string;
  client_id: string;
  created_at: number;
}

export type TwitchAuthorized = {
	channelId: string;
	clientId: string;
	token: string;
	helixToken: string;
	userId: string;
};

export type TwitchAuthorizedParsed = {
	channelId: string;
	clientId: string;
	token: TwitchAuthToken;
	helixToken: TwitchAuthHelixToken;
	userId: string;
};

export type TwitchContext = {
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

export type TwitchConfigSegment = {
	content: string;
	version: string;
};

export type TwitchSegmentName = 'broadcaster' | 'developer' | 'global';

export type TwitchExtConfiguration = {
	broadcaster?: TwitchConfigSegment;
	developer?: TwitchConfigSegment;
	global?: TwitchConfigSegment;
	onChanged: (callback: () => void) => void;
	set: (segment: TwitchSegmentName, version: string, content: string) => void;
};

export type TwitchURLSearchParams = {
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

export type TwitchExtension = {
	onAuthorized: (callback: (auth: TwitchAuthorized) => void) => void;
	onContext: (callback: (context: TwitchContext, changedKeys: Array<string>) => void) => void;
	onError: (callback: (errorValue: unknown) => void) => void;
	onHighlightChanged: (callback: (isHighlighted: boolean) => void) => void;
	onPositionChanged: (callback: (position: { x: number; y: number }) => void) => void;
	onVisibilityChanged: (callback: (isVisible: boolean, context: { game: string }) => void) => void;
	configuration: TwitchExtConfiguration;
	listen: (target: string, callback: PubSubCallback) => void;
	unlisten: (target: string, callback: PubSubCallback) => void;
	send: (target: string, contentType: string, message: string) => void;
};

export type TwitchConfigContent = any; // TODO: define this based on the actual configuration schema used in the extension