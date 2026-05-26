import { game } from '../functions/game.svelte';
import type { ExtensionOverlaySettings } from '@krvavy-chaos/shared/types/web';

const STORAGE_KEY_PREFIX = 'krvavy-viewer-preference';

type ViewerPreference = 'undecided' | 'reveal' | 'predict';

const storageKey = (gameId: string) => `${STORAGE_KEY_PREFIX}:${gameId}`;

const readStored = (gameId: string): ViewerPreference => {
	const stored = localStorage.getItem(storageKey(gameId));
	return stored === 'reveal' || stored === 'predict' ? stored : 'undecided';
};

class ViewerPreferenceStore {
	// Tracks in-session choices so the getter re-runs reactively after choose/reset
	#chosen = $state<Record<string, ViewerPreference>>({});

	get value(): ViewerPreference {
		const id = game.data?.id;
		if (!id) return 'undecided';
		// Reading #chosen makes this getter reactive to choose/reset calls
		return this.#chosen[id] ?? readStored(id);
	}

	choose = (pref: 'reveal' | 'predict') => {
		const id = game.data?.id;
		if (!id) return;
		this.#chosen[id] = pref;
		localStorage.setItem(storageKey(id), pref);
	};

	reset = () => {
		const id = game.data?.id;
		if (!id) return;
		delete this.#chosen[id];
		localStorage.removeItem(storageKey(id));
	};
}

export const viewerPreference = new ViewerPreferenceStore();

const VIEWER_OVERLAY_KEY = 'krvavy-viewer-overlay';

class ViewerOverlayStore {
	#override = $state<ExtensionOverlaySettings | null>(
		JSON.parse(localStorage.getItem(VIEWER_OVERLAY_KEY) ?? 'null'),
	);

	get hasOverride() { return this.#override !== null; }
	get current() { return this.#override; }

	effective = (base: ExtensionOverlaySettings): ExtensionOverlaySettings =>
		this.#override ?? base;

	update = (values: ExtensionOverlaySettings) => {
		this.#override = { ...values };
		localStorage.setItem(VIEWER_OVERLAY_KEY, JSON.stringify(this.#override));
	};

	reset = () => {
		this.#override = null;
		localStorage.removeItem(VIEWER_OVERLAY_KEY);
	};
}

export const viewerOverlay = new ViewerOverlayStore();

const GUESS_KEY_PREFIX = 'krvavy-viewer-guesses';
const guessKey = (gameId: string) => `${GUESS_KEY_PREFIX}:${gameId}`;

type GuessRecord = Record<string, string>; // playerId → characterId

const readStoredGuessRecord = (gameId: string): GuessRecord => {
	try {
		return JSON.parse(localStorage.getItem(guessKey(gameId)) ?? '{}');
	} catch {
		return {};
	}
};

class PlayerGuessesStore {
	// gameId → (playerId → characterId) — populated lazily on first mutation per game
	#data = $state<Record<string, GuessRecord>>({});

	#ensureLoaded = (gameId: string) => {
		if (!(gameId in this.#data)) {
			this.#data[gameId] = readStoredGuessRecord(gameId);
		}
	};

	getGuess = (playerId: string): string | null => {
		const id = game.data?.id;
		if (!id) return null;
		// Reading #data[id] makes this reactive — re-runs when any guess for this game changes
		const map = this.#data[id];
		if (map) return map[playerId] ?? null;
		// First render before any mutation: read directly from localStorage
		return readStoredGuessRecord(id)[playerId] ?? null;
	};

	setGuess = (playerId: string, characterId: string) => {
		const id = game.data?.id;
		if (!id) return;
		this.#ensureLoaded(id);
		this.#data[id][playerId] = characterId;
		localStorage.setItem(guessKey(id), JSON.stringify(this.#data[id]));
	};

	clearGuess = (playerId: string) => {
		const id = game.data?.id;
		if (!id) return;
		this.#ensureLoaded(id);
		delete this.#data[id][playerId];
		localStorage.setItem(guessKey(id), JSON.stringify(this.#data[id]));
	};

	reset = () => {
		const id = game.data?.id;
		if (!id) return;
		this.#data[id] = {};
		localStorage.removeItem(guessKey(id));
	};
}

export const playerGuesses = new PlayerGuessesStore();

const TOKEN_STYLE_KEY = 'krvavy-viewer-token-style';
export type TokenStyle = 'icon' | 'color' | 'none';

const readTokenStyle = (): TokenStyle => {
	const stored = localStorage.getItem(TOKEN_STYLE_KEY);
	return stored === 'icon' || stored === 'color' || stored === 'none' ? stored : 'icon';
};

class TokenStyleStore {
	value = $state<TokenStyle>(readTokenStyle());

	set = (style: TokenStyle) => {
		this.value = style;
		localStorage.setItem(TOKEN_STYLE_KEY, style);
	};
}

export const tokenStyle = new TokenStyleStore();
