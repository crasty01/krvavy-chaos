import type { BotcScript, BotcAlignment } from '../validate/script';

export type Breadcrumb = {
	label: string;
	href: string;
	icon?: string;
};

export type ExtensionUser = {
	id: string;
	name: string;
	email: string;
	image: string | null;
	activeGameId: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type ExtensionPlayer = {
	id: string;
	name: string;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	socialLinks: Array<{
		handle: string;
		id: string;
		platformId: string;
		playerId: string;
	}>;
};

export type ExtensionGamePlayer = {
	id: string;
	gameId: string;
	playerId: string;
	seatOrder: number;
	characterId: string | null;
	alignment: BotcAlignment | null;
	player: ExtensionPlayer;
};

export type ExtensionGameEditor = {
	gameId: string;
	userId: string;
	user: ExtensionUser;
};

export type ExtensionPlatform = {
	id: string;
	name: string;
	urlTemplate: string | null;
	icon: string | null;
};

export type ExtensionGame = {
	id: string;
	name: string;
	script: BotcScript;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	gamePlayers: Array<ExtensionGamePlayer>;
	editors: Array<ExtensionGameEditor>;
	creator: ExtensionUser;
	platforms: Array<ExtensionPlatform>;
};
