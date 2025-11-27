import { defineMarkdocConfig, nodes, component } from '@astrojs/markdoc/config';
import shiki from '@astrojs/markdoc/shiki';

export default defineMarkdocConfig({
  tags: {
    code: {
      render: component('./src/components/CodeLayout.astro'),
      attributes: {
        // https://markdoc.dev/docs/attributes#defining-attributes
        title: { type: String },
      },
    },
  },
  extends: [
    shiki({
      theme: 'dracula',
      wrap: true,
      langs: [],
    }),
  ],
  nodes: {
    image: {
      ...nodes.image, 
      renred: component('./src/components/MarkdocImage.astro'),
    },
  },
});