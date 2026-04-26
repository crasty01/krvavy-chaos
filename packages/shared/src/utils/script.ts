import type { ExtensionGamePlayer } from '@krvavy-chaos/shared/types/web';
import type { BotcScriptCharacter } from '@krvavy-chaos/shared/validate/script';

export const getAlignedCharacterImage = (
	character: BotcScriptCharacter,
	gamePlayer: ExtensionGamePlayer,
) => {
	if (!character.image) return null;
	if (typeof character.image === 'string') return character.image;
	if (!gamePlayer.alignment || character.image.length === 1) return character.image[0];

	if (character.team === 'traveller' && character.image.length === 3) {
		// Traveller characters with 3 images have a specific order of [neutral, good, evil]
		switch (gamePlayer.alignment) {
			case 'neutral':
				return character.image[0];
			case 'good':
				return character.image[1];
			case 'evil':
				return character.image[2];
		}
	}

	// For non-traveller characters, they should have 2 images in the order of [normal, flipped]
	if (character.team === 'demon' || character.team === 'minion') {
		return gamePlayer.alignment === 'evil' ? character.image[0] : character.image[1];
	}
	if (character.team === 'outsider' || character.team === 'townsfolk') {
		return gamePlayer.alignment === 'good' ? character.image[0] : character.image[1];
	}

	return character.image[0];
}