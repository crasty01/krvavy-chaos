import type { TwitchExtensionConfigContent } from '@krvavy-chaos/shared/types/extension';

export const parseConfig = (config: null | undefined | Partial<TwitchExtensionConfigContent>): TwitchExtensionConfigContent => {
	return {
		gameOwner: config?.gameOwner ?? undefined,
	};
};