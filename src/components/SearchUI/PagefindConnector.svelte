<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  /** 検索クエリを保持する変数 */
  let query = '';
  /** 検索結果を保持する配列 */
  let searchResults: any[] = [];
  /** Pagefindコアライブラリのインスタンス */
  let pagefind: any;
  /** デバウンス処理用のタイマーID */
  let debounceTimer: number | null = null;
  /** 検索中かどうかを示すフラグ */
  let loading = false;

  // PagefindUIのオプションに基づいた設定
  const PAGEFIND_OPTIONS = {
    bundlePath: 'https://js.dictionary4.dev/content_search/',
    baseUrl: "/content/",
    pageSize: 8,
    // highlightParamは検索結果のハイライト処理にカスタムで使用します
    highlightParam: "q", 
  };

  /**
   * 検索クエリに基づいてPagefind検索を実行する
   * @param val 検索クエリ
   */
  async function fetchSearchResults(val: string) {
    if (!pagefind) return;
    const trimmedVal = val.trim();

    if (!trimmedVal) {
      searchResults = [];
      return;
    }

    loading = true;
    try {
      const search = await pagefind.search(trimmedVal);
      
      // 結果をデシリアライズして表示用に整形
      if (search.results.length > 0) {
        const data = await Promise.all(
          search.results.map((r: any) => r.data())
        );
        searchResults = data;
      } else {
        searchResults = [];
      }
    } catch (e) {
      console.error("Pagefind search failed:", e);
      searchResults = [];
    } finally {
      loading = false;
    }
  }

  /**
   * 入力イベントハンドラ（デバウンス処理付き）
   */
  function handleInput(event: Event) {
    const newQuery = (event.target as HTMLInputElement).value;
    query = newQuery; // Svelte変数に即時反映

    // URLの更新
    updateUrl(newQuery);

    // 検索処理にデバウンスを適用
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    // 300ms入力が停止したら検索を実行
    debounceTimer = window.setTimeout(() => {
      fetchSearchResults(newQuery);
    }, 300);
  }

  /**
   * ブラウザのURLを更新し、?q= パラメータを同期する
   * @param newQuery 更新後のクエリ
   */
  function updateUrl(newQuery: string) {
    if (typeof window === 'undefined') return;

    const newUrl = new URL(window.location.href);
    if (newQuery) {
      // ?q=... を設定
      newUrl.searchParams.set('q', newQuery);
      // ハイライト用のパラメータも設定 (highlightParam: "q" と同じ値を使用)
      newUrl.searchParams.set(PAGEFIND_OPTIONS.highlightParam, newQuery);
    } else {
      // クエリが空なら両方のパラメータを削除
      newUrl.searchParams.delete('q');
      newUrl.searchParams.delete(PAGEFIND_OPTIONS.highlightParam);
    }
    // ページをリロードせずにURLを更新
    window.history.pushState({}, '', newUrl.toString());
  }


  // コンポーネントがマウントされたら実行
  onMount(async () => {
    // 1. URLから初期クエリを取得
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') ?? ''; 
    query = initialQuery;

    // 2. Pagefindコアライブラリを動的にインポート
    try {
      // @ts-ignore
      pagefind = await import(
        /* @vite-ignore */
        `${PAGEFIND_OPTIONS.bundlePath}pagefind.js` 
      );
      // オプションを設定 (baseUrlなど)
      await pagefind.options(PAGEFIND_OPTIONS);
      
      // 3. 初期クエリがあれば、検索を実行
      if (query) {
        await fetchSearchResults(query);
      }
      
      // 4. Pagefindのハイライトスクリプトをインポート
      await import(/* @vite-ignore */ `${PAGEFIND_OPTIONS.bundlePath}pagefind-highlight.js`);
      // ハイライトオブジェクトを作成し、URLパラメータ 'q' を監視させる
      // @ts-ignore
      new PagefindHighlight({ highlightParam: PAGEFIND_OPTIONS.highlightParam });

    } catch (e) {
      console.error("Pagefind library or initialization failed.", e);
    }
  });

  // コンポーネントが破棄されたらタイマーをクリア
  onDestroy(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });
</script>

<section class="root">
  <div class="pgSearch">
    <input 
      type="search" 
      placeholder="サイト内検索..." 
      value={query} 
      on:input={handleInput}
      aria-label="サイト内検索"
    />
    {#if (query !== '')}
      <button
        aria-label="検索クエリを削除"
        on:click={() => query = ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
      </button>
    {/if}
  </div>

  <div class="search-output">
    {#if loading}
      <p class='ステータス'>検索中...</p>
    {:else if query && searchResults.length > 0}
      <p class='ステータス'>{searchResults.length}件の結果を表示</p>
      <ul class="results-list">
        {#each searchResults as result}
          <li class="result-item">
            <a href="{result.url}?{PAGEFIND_OPTIONS.highlightParam}={encodeURIComponent(query)}">
              <h4>{result.meta.title || result.url}</h4>
              <p class="excerpt">{@html result.excerpt}</p>
            </a>
          </li>
          {#if result.sub_results && result.sub_results.length > 0}
              <ul class="sub-results-list">
                {#each result.sub_results as subResult, index}
                  {#if index > 0} 
                    <li class="sub-result-item">
                      <a href="{subResult.url}">
                        <span class="sub-result-title">{subResult.title}</span>
                      </a>
                    </li>
                  {/if}
                {/each}
              </ul>
            {/if}
        {/each}
      </ul>
    {:else if query && !loading}
      <p class="ステータス">結果が見つかりませんでした。</p>
    {/if}
  </div>
</section>

<style lang="scss">
  .root {
    width: 100%;
    .pgSearch {
      position: relative;
      input {
        width: 100%;
        font-family: var(--font-fira-code), var(--font-m-plus-1-code), monospace;
        height: 40px;
        font-size: 16px;
        display: flex;
        align-items: center;
      }
      button {
        position: absolute;
        top: 0;
        right: 0;
        border: none;
        height: 40px;
        background: transparent;
      }
    }
    .search-output {
      .ステータス {
        text-align: center;
      }
    }
  }
</style>