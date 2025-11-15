<script lang='ts'>
  let searchType: string = 'title';

  function changeType(toWhat: string) {
    searchType = toWhat;
  }
</script>

<div class='root'>
  <div class='searchConfigRow'>
    <button
      on:click={() => changeType('title')}
    >
      見出し
    </button>
    <button
      on:click={() => changeType('content')}
    >
      用例・全文
    </button>
  </div>
</div>

<style lang='scss'>
  .root {
    padding: 4px;
    .searchConfigRow {
      display: flex;
      height: 30px;
      button {
        width: 50%;
        height: 100%;
        border: 1px solid var(--themeColor);
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