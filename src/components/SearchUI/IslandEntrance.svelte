<script lang='ts'>
  import ModeConfig from "./ModeConfig.svelte";
  import PagefindConnector from "./PagefindConnector.svelte";
  import TitlePagefind from "./TitlePagefind.svelte";

  let searchMode: string = '見出し'

  $: SearchComponent =
    searchMode === '見出し' ? TitlePagefind :
    searchMode === '全文' ? PagefindConnector :
    null;
</script>

<div class='root'>
  {#if (SearchComponent !== null)}
    <svelte:component this={SearchComponent}>
      <ModeConfig bind:searchMode = {searchMode} />
    </svelte:component>
  {:else}
    <h2>エラーが発生しました．</h2>
  {/if}
  <PagefindConnector>
    <ModeConfig bind:searchMode={searchMode} />
  </PagefindConnector>
</div>