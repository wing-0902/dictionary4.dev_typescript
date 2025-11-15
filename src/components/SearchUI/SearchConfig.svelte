<script lang='ts'>
  let searchType: string = 'title';
  let searchKeyword: string = '';
</script>

<div>
  <div class='searchSlotRow'>
    <input type='text' bind:value={searchKeyword} />
  </div>
</div>

<style lang='scss'>
  .searchSlotRow {
    display: flex;
    input {
      width: 100%;
      height: 40px;
    }
  }
</style>