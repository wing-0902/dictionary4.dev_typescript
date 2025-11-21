<script lang='ts'>
  import { onMount } from "svelte";

  export let searchMode: string;
  function changeMode(toMode: string) {
    searchMode = toMode;
    updateUrl(toMode);
  }

  onMount(async () => {
    //1. URLから初期クエリを取得
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('m') ?? '見出し';
    searchMode = initialQuery;
  })

  function updateUrl(newQuery: string) {
    if (typeof window === 'undefined') return;

    const newUrl = new URL(window.location.href);
    if (newQuery) {
      newUrl.searchParams.set('m', newQuery);
    }
    window.history.replaceState({}, '', newUrl.toString());
  }
</script>

<div class='root'>
  <button
    on:click={() => changeMode('見出し')}
  >
    見出し
  </button>
  <button
    on:click={() => changeMode('用例')}
  >
    用例
  </button>
  <button
    on:click={() => changeMode('全文')}
  >
    全文
  </button>
</div>

<style lang='scss'>
  .root {
    --side-margin: 7px;
    margin: 0 var(--side-margin);
    width: calc(100% - 2 * var(--side-margin));
    display: flex;
    button {
      flex: 1;
      font-family: var(--font-zen-kaku-gothic-new);
      font-size: 14px;
      margin: 0;
      height: 28px;
      border: 1px solid var(--foreground);
      &:first-child {
        border-radius: 14px 0 0 14px;
      }
      &:last-child {
        border-radius: 0 14px 14px 0;
      }
    }
  }
</style>