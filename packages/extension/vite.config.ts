import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';

export default defineConfig({
  plugins: [
    svelte(),
    zipPack({ outFileName: 'app.zip' }),
  ],
});
