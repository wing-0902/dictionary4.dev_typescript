<script lang="ts">
  import './searchUi.scss';
  import { onMount, onDestroy } from 'svelte';
  import { addQuery } from './addQuery.mts';

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
    } else {
      // クエリが空なら両方のパラメータを削除
      newUrl.searchParams.delete('q');
    }
    // ページをリロードせずにURLを更新
    window.history.replaceState({}, '', newUrl.toString());
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
      // ハイライトはややこいので削除
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

  import {結果なし, 検索中, 表示中} from './message.mts';
</script>

<section class="root">
  <div class="pgSearch">
    <input 
      type="search" 
      placeholder="検索語句を入力" 
      value={query} 
      on:input={handleInput}
      aria-label="検索語句を入力"
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

  <slot />

  <div class="search-output">
    {#if loading}
      <p class='ステータス'>{検索中}</p>
    {:else if query && searchResults.length > 0}
      <p class='ステータス'>{searchResults.length}{表示中}</p>
      <ul class="結果一覧">
        {#each searchResults as result}
          <hr />
          <li class="項目">
            <a
              class='項目リンク'
              href={addQuery(result.url, {
                'q': query,
                'm': '全文'
              })}
            >
              <h2>{result.meta.title || result.url}</h2>
              <p class="詳細">{@html result.excerpt}</p>
            </a>
          </li>
          {#if result.sub_results && result.sub_results.length > 0}
            <ul class="サブ結果">
              {#each result.sub_results as subResult, index}
                {#if index > 0} 
                  <li class="中身">
                    <a
                      href={addQuery(subResult.url, {
                        'q': query,
                        'm': '全文'
                      })}
                    >
                      <h3 class="タイトル">{subResult.title}</h3>
                    </a>
                  </li>
                {/if}
              {/each}
            </ul>
          {/if}
        {/each}
        <hr class='endHr'/>
        <div class='spacer'></div>
      </ul>
    {:else if query && !loading}
      <p class="ステータス">{結果なし}</p>
    {:else}
      <p class='ステータス'>入力して検索</p>
      <p class='helpMessage'>このモードでは，コンテンツの全文を検索できます．</p>
    {/if}
  </div>
</section>