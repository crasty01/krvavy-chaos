import { game } from '../functions/game.svelte';

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
