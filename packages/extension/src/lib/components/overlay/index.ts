import type { ExtensionGamePlayer } from '@krvavy-chaos/shared/types/web';
import type { BotcScriptCharacter } from '@krvavy-chaos/shared/validate/script';

export { default as Root } from './OverlayRoot.svelte';
export { default as Token } from './OverlayToken.svelte';

export type CharacterTooltipPayload = {
	character: BotcScriptCharacter;
	gamePlayer: ExtensionGamePlayer;
};