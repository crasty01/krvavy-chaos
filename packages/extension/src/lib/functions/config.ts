import type { TwitchExtensionConfigContent } from '@krvavy-chaos/shared/types/extension';

export const parseConfig = (config: null | undefined | Partial<TwitchExtensionConfigContent>): TwitchExtensionConfigContent => {
	return {
		gameOwner: config?.gameOwner ?? undefined,
		overlay: {
			offsetX: config?.overlay?.offsetX ?? 0,
			offsetY: config?.overlay?.offsetY ?? 0,
			radius: config?.overlay?.radius ?? 40,
			tokenSize: config?.overlay?.tokenSize ?? 9.3,
		},
	}
};