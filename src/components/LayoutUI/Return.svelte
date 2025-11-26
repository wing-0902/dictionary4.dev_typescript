<script lang='ts'>
  import { onMount } from "svelte";
  import { addQuery } from "../SearchUI/addQuery.mts";

  let query: string = '';
  let mode: string = '';

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') ?? '';
    const initialMode = urlParams.get('m') ?? '見出し';
    query = initialQuery;
    mode = initialMode;
  })
</script>

<div class='root'>
  <p>
    <a
      href={addQuery("/", {
        'q': query,
        'm': mode,
      })}
    >＜<span>戻る</span></a>
  </p>
</div>

<style lang="scss">
  .root {
    width: 100%;
    display: flex;
    align-items: center;
    p {
      a {
        text-decoration: none;
        span:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>