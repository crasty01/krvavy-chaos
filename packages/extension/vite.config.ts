import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import zipPack from 'vite-plugin-zip-pack';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
		svelte(),
		zipPack({ outFileName: 'app.zip' }),
	],
	resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  },
})
