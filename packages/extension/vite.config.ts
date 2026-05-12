import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import zipPack from 'vite-plugin-zip-pack';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

// https://vite.dev/config/
export default defineConfig({
	base: './',
  plugins: [
		svelte(),
		zipPack({ outFileName: 'app.zip' }),
	],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	build: {
		cssMinify: 'esbuild',
	},
})
