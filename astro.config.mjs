// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: 'https://ts.dictionary4.dev',
  integrations: [svelte(), vue()]
});