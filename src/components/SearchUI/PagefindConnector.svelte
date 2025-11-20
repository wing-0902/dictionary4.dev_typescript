<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  /** 検索クエリを保持する変数 */
  let query = '';
  /** 検索結果を保持する配列 (Pagefindの結果データを含む) */
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
    // highlightParam: "q" はハイライト機能がないため削除しました。
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
      // PagefindコアAPIで検索を実行
      const search = await pagefind.search(trimmedVal);
      
      // 結果をデシリアライズして表示用に整形
      if (search.results.length > 0) {
        // search.resultsは非同期のdata()関数を持つオブジェクトの配列です。
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
    } else {
      // クエリが空ならパラメータを削除
      newUrl.searchParams.delete('q');
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
      
      // 4. ハイライト機能は削除したため、pagefind-highlight.jsのインポートと初期化は不要です。

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

<section class="custom-search-root">
  <div class="pgSearch">
    <input 
      type="search" 
      placeholder="サイト内検索..." 
      value={query} 
      on:input={handleInput}
      aria-label="サイト内検索"
    />
  </div>

  <div class="search-output">
    {#if loading}
      <p>検索中...</p>
    {:else if query && searchResults.length > 0}
      <h3>{searchResults.length}件の結果を表示</h3>
      <ul class="results-list">
        {#each searchResults as result}
          <li class="result-item">
            <a href="{PAGEFIND_OPTIONS.baseUrl}{result.url}">
              <h4>{result.meta.title || result.url}</h4>
              <p class="excerpt">{@html result.excerpt}</p>
            </a>

            {#if result.sub_results && result.sub_results.length > 0}
              <ul class="sub-results-list">
                {#each result.sub_results as subResult, index}
                  {#if index > 0} 
                    <li class="sub-result-item">
                      <a href="{PAGEFIND_OPTIONS.baseUrl}{subResult.url}">
                        <span class="sub-result-title">{subResult.title}</span>
                        <span class="sub-result-excerpt"> — {@html subResult.excerpt}</span>
                      </a>
                    </li>
                  {/if}
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    {:else if query && !loading}
      <p class="no-results">"{query}" に一致する結果は見つかりませんでした。</p>
    {:else}
      {/if}
  </div>
</section>

<style lang="scss">
  .custom-search-root {
    margin-top: 11px;
    padding: 10px;
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .pgSearch input {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .search-output {
    margin-top: 15px;
  }
  .results-list {
    list-style: none;
    padding: 0;
  }
  .result-item {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px dotted #eee;
  }
  .result-item a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .result-item h4 {
    margin: 0 0 5px 0;
    color: #007bff;
  }
  .excerpt {
    font-size: 0.9em;
    color: #555;
  }
  /* サブ結果のスタイル */
  .sub-results-list {
    list-style: none;
    padding-left: 15px;
    margin-top: 5px;
    font-size: 0.9em;
  }
  .sub-result-item a {
    color: #333;
    padding: 2px 0;
    &:hover {
        text-decoration: underline;
    }
  }
  .sub-result-title {
    font-weight: bold;
  }
  .sub-result-excerpt {
    color: #666;
  }
  .no-results {
    color: #888;
  }
</style>