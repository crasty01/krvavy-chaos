<script lang="ts" module>
const STORAGE_KEY = 'theme-preference';

type Theme = 'auto' | 'light' | 'dark';

const icons: Record<Theme, string> = {
	auto: 'material-symbols:brightness-auto',
	light: 'material-symbols:light-mode',
	dark: 'material-symbols:dark-mode',
};

const labels: Record<Theme, string> = {
	auto: 'Automatický',
	light: 'Světlý',
	dark: 'Tmavý',
};

const cycle: Record<Theme, Theme> = {
	light: 'dark',
	dark: 'light',
	auto: 'light', // does not work
};
</script>

<script lang="ts">
	import Icon from "@iconify/svelte";
	import { browser } from '$app/environment';
	import { Button } from 'bits-ui';

	const getStoredTheme = (): Theme => {
		if (!browser) return 'auto';
		return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'auto';
	};

	let theme = $state<Theme>(getStoredTheme());
	const colorScheme = $derived(theme === 'auto' ? 'dark light' : theme);

	const toggle = () => {
		theme = cycle[theme];
	};

	$effect(() => {
		localStorage.setItem(STORAGE_KEY, theme);
	});
</script>

<svelte:head>
	<meta name="color-scheme" content={colorScheme} />
</svelte:head>

<Button.Root data-button-round onclick={toggle} aria-label="Přepnout motiv: {labels[theme]}" title={labels[theme]}>
	<Icon icon={icons[theme]} width="1.25rem" height="1.25rem" />
</Button.Root>