// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import rehypePrettyCode from 'rehype-pretty-code';

import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://js.dictionary4.dev',
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
      },
      {
        provider: fontProviders.google(),
        name: 'Zen Kaku Gothic New',
        cssVariable: '--font-zen-kaku-gothic-new'
      },
    ]
  },
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {

        }
      ]
    ],
  },
});