export type TwitchExtensionPubSubMessageTesting = {
	type: 'test';
	data: any;
};

export type TwitchExtensionPubSubMessageGameUpdate = {
	type: 'game-update';
	data: {
		ownerId: string;
		gameId: string | null;
	};
};

export type TwitchExtensionPubSubMessage = TwitchExtensionPubSubMessageTesting
	| TwitchExtensionPubSubMessageGameUpdate;

export type TwitchExtensionPubSubMessageOptions = {
	type: 'broadcast';
	broadcasterId: string;
} | {
	type: 'global';
}