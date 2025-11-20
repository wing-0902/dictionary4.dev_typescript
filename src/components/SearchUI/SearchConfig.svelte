<script lang='js'>
  let isTitle = true;
  let searchWord = '';

  import { onMount } from "svelte";

  let pagefind = null;

  onMount(() => {
    if (isTitle) {
      pagefind = import("https://tsdict.mdmbypass.wing.osaka/h1_only_search/pagefind.js");
    } else {
      pagefind = import('https://tsdict.mdmbypass.wing.osaka/content_search/pagefind.js');
    }
    pagefind.options({
      bundlePath: "/content/"
    });
    pagefind.init();
  });

  function changeType(toWhich) {
    const cacheTitle = isTitle;
    isTitle = toWhich;

    if (isTitle != cacheTitle) {
      pagefind.destroy();
      if (isTitle) {
        pagefind = import("https://tsdict.mdmbypass.wing.osaka/h1_only_search/pagefind.js");
      } else {
        pagefind = import("https://tsdict.mdmbypass.wing.osaka/content_search/pagefind.js");
      }
      pagefind.init();
    }
  }
</script>

<div class='root'>
  <div class='searchText'>
    <input type='text' bind:value={searchWord} />
  </div>
  <div class='searchConfigRow'>
    <button
      on:click={() => changeType(true)}
      class:isActive={isTitle === true}
    >
      見出し
    </button>
    <button
      on:click={() => changeType(false)}
      class:isActive={isTitle === false}
    >
      用例・全文
    </button>
  </div>
</div>

<style lang='scss'>
  .root {
    padding: 4px;
    .searchText {
      width: 100%;
      input {
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        font-family: var(--font-fira-code), var(--font-m-plus-1-code), monospace;
        font-size: 25px;
      }
    }
    .searchConfigRow {
      display: flex;
      height: 30px;
      button {
        width: 50%;
        height: 100%;
        border: 1px solid var(--themeColor);
        color: var(--themeColor);
        font-family: var(--font-zen-kaku-gothic-new);
        &.isActive {
          background-color: color-mix(in srgb, var(--themeColor) 50%, white);
        }
        &:nth-child(1) {
          border-radius: 15px 0 0 15px;
        }
        &:nth-child(2) {
          border-radius: 0 15px 15px 0;
        }
      }
    }
  }
</style>