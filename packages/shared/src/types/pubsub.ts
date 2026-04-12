export type TwitchExtensionPubSubMessageTesting = {
	type: 'test';
	data: any;
};

export type TwitchExtensionPubSubMessageScriptUpdate = {
	type: 'script-update';
	data: {
		scriptUrl: string;
	};
};

export type TwitchExtensionPubSubMessage = TwitchExtensionPubSubMessageTesting
	| TwitchExtensionPubSubMessageScriptUpdate;