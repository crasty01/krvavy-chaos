import type { ExtensionGamePlayer } from '@krvavy-chaos/shared/types/web';
import type { BotcScriptCharacter } from '@krvavy-chaos/shared/validate/script';

export { default as Root } from './OverlayRoot.svelte';
export { default as Token } from './OverlayToken.svelte';
export { default as DrawerPanel } from './DrawerPanel.svelte';

export type CharacterTooltipPayload = {
	character: BotcScriptCharacter;
	gamePlayer: ExtensionGamePlayer;
};