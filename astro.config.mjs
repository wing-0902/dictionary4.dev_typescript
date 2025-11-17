// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import svelte from '@astrojs/svelte';

import vue from '@astrojs/vue';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

const siteUrl = import.meta.env.PUBLIC_SITE_DOMAIN;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  integrations: [svelte(), vue(), mdx(), sitemap()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Fira Code",
        cssVariable: "--font-fira-code"
      },
      {
        provider: fontProviders.google(),
        name: 'M PLUS 1 Code',
        cssVariable: "--font-m-plus-1-code"
      }
    ]
  }
});