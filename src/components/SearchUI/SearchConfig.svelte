<script lang='ts'>
  import PagefindConnector from "./PagefindConnector.svelte";
</script>

<div class='root'>
  <PagefindConnector />
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