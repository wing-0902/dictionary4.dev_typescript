<script lang='ts'>
  import ModeConfig from "./ModeConfig.svelte";
  import PagefindConnector from "./PagefindConnector.svelte";
  import TitlePagefind from "./TitlePagefind.svelte";
  import CodePagefind from "./CodePagefind.svelte";

  let searchMode: string = '見出し'

  $: SearchComponent =
    searchMode === '見出し' ? TitlePagefind :
    searchMode === '全文' ? PagefindConnector :
    searchMode === '用例' ? CodePagefind :
    TitlePagefind;
</script>

<div class='root'>
  {#if (SearchComponent !== null)}
    <svelte:component this={SearchComponent}>
      <div>
        <ModeConfig bind:searchMode={searchMode} />
      </div>
    </svelte:component>
  {:else}
    <h2>エラーが発生しました．</h2>
  {/if}
</div>