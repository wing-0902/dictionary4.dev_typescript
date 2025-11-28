<script lang='ts'>
  export let href: string;

  import { onMount } from "svelte";
  import { addQuery } from "./SearchUI/addQuery.mts";

  let query: string = '';
  let mode: string = '';

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    query = urlParams.get('q') ?? '';
    mode = urlParams.get('m') ?? '';
  })
</script>

<a
  href={addQuery(href, {
    'q': query,
    'm': mode,
  })}
>
  <slot />
</a>

<style lang="scss">
  a {
    text-decoration: none;
    &:active {
      text-decoration: underline;
    }
  }
</style>