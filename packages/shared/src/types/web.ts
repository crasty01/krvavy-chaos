import type { BotcScript, BotcAlignment } from '../validate/script';

export type Breadcrumb = {
	label: string;
	href: string;
	icon?: string;
};

export type ExtensionUser = {
	id: string;
	name: string;
	image: string | null;
};

export type ExtensionPlayer = {
	id: string;
	name: string;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
};

export type ExtensionGamePlayer = {
	id: string;
	gameId: string;
	playerId: string;
	seatOrder: number;
	characterId: string | null;
	alignment: BotcAlignment | null;
	profileUrl: string | null;
	player: ExtensionPlayer;
};

export type ExtensionPlatform = {
	id: string;
	name: string;
	urlTemplate: string | null;
	icon: string | null;
};

export type ExtensionOverlaySettings = {
	offsetX: number;
	offsetY: number;
	radius: number;
	tokenSize: number;
};

export type ExtensionGame = {
	id: string;
	name: string;
	script: BotcScript;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	gamePlayers: Array<ExtensionGamePlayer>;
	creator: ExtensionUser;
	broadcasterOverlay: ExtensionOverlaySettings;
};
