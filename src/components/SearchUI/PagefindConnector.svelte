<script>
  import { onMount } from "svelte";
  import { PagefindUI } from "@pagefind/default-ui";
  import "@pagefind/default-ui/css/ui.css";

  onMount(() => {
    new PagefindUI({
      element: "#search",
      language: 'ja',
      showSubResults: true,
      showImages: false,
      bundlePath: 'https://js.dictionary4.dev/content_search/',
      baseUrl: "/content/",
      pageSize: 8,
    });
  });
</script>

<section class="searchBox">
  <div id="search"></div>
</section>

<style lang="scss">
  .searchBox {
    margin-top: 95px;
    #search {
      --pagefind-ui-primary: var(--a-default);
      --pagefind-ui-primary-hover: var(--a-hover);
      --pagefind-ui-scale: 1;
      --pagefind-ui-tag-text: var(--foreground-sub);
      --pagefind-ui-text: var(--foreground);
      --pagefind-ui-background: transparent;
      --pagefind-ui-border: var(--foreground);
      --pagefind-ui-tag: var(--foreground-sub);
      --pagefind-ui-border-width: 2px;
      --pagefind-ui-border-radius: 31px;
      --pagefind-ui-image-border-radius: 8px;
      --pagefind-ui-image-box-ratio: 3 / 2;
      --pagefind-ui-font: var(--font-zen-kaku-gothic-new);
      --pagefind-ui-tag: rgba(0, 16, 72, 0.7);
    }
  }
</style>