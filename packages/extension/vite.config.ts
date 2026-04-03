import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import zipPack from 'vite-plugin-zip-pack';

// https://vite.dev/config/
export default defineConfig({
	base: './',
  plugins: [
		svelte(),
		zipPack({ outFileName: 'app.zip' }),
	],
})
