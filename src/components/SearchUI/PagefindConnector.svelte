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

<section class="root">
  <div id="search" class='pgSearch'></div>
</section>

<style lang="scss">
  .root {
    margin-top: 11px;
  }
</style>