import { game } from '../functions/game.svelte';

const STORAGE_KEY_PREFIX = 'krvavy-viewer-preference';
const OVERLAY_HIDDEN_KEY = 'krvavy-overlay-hidden';

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

class OverlayVisibilityStore {
	hidden = $state<boolean>(localStorage.getItem(OVERLAY_HIDDEN_KEY) === 'true');

	toggle = () => {
		this.hidden = !this.hidden;
		localStorage.setItem(OVERLAY_HIDDEN_KEY, String(this.hidden));
	};
}

export const overlayVisibility = new OverlayVisibilityStore();

const VIEWER_OVERLAY_KEY = 'krvavy-viewer-overlay';

export type ViewerOverlaySettings = {
	offsetX: number;
	offsetY: number;
	radius: number;
	tokenSize: number;
};

class ViewerOverlayStore {
	#override = $state<ViewerOverlaySettings | null>(
		JSON.parse(localStorage.getItem(VIEWER_OVERLAY_KEY) ?? 'null'),
	);

	get hasOverride() { return this.#override !== null; }
	get current() { return this.#override; }

	effective = (base: ViewerOverlaySettings): ViewerOverlaySettings =>
		this.#override ?? base;

	update = (values: ViewerOverlaySettings) => {
		this.#override = { ...values };
		localStorage.setItem(VIEWER_OVERLAY_KEY, JSON.stringify(this.#override));
	};

	reset = () => {
		this.#override = null;
		localStorage.removeItem(VIEWER_OVERLAY_KEY);
	};
}

export const viewerOverlay = new ViewerOverlayStore();
