import { defineMarkdocConfig, nodes, component } from '@astrojs/markdoc/config';
import shiki from '@astrojs/markdoc/shiki';
import { transformerNotationDiff } from '@shikijs/transformers';

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
      theme: 'night-owl',
      wrap: true,
      langs: [],
      transformers: [
        transformerNotationDiff(),
      ]
    }),
  ],
  nodes: {
    image: {
      ...nodes.image, 
      renred: component('./src/components/MarkdocImage.astro'),
    },
  },
});