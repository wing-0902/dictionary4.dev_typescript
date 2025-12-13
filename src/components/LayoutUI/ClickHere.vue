<script lang='ts' setup>
  import { ref } from 'vue';
  import SeeMore from '../Icons/SeeMore.vue';
</script>

<script lang='ts'>
  const hidden = ref(true)

  function changeStatus() {
    hidden.value = !hidden.value;
  }

  const copyScheme: string = 'js.dictionary4.dev/?q=<文字列>'

  function URLスキームをコピー() {
    event.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(copyScheme)
        .then(() => {
          alert(`URLスキームをコピーしました．\nURLスキーム：${copyScheme}`);
        })
        .catch(err => {
          console.error("コピーに失敗しました: ", err);
        });
    } else {
      alert('この環境では利用できません．')
    }
  }
</script>

<template>
  <div class='root'>
    <button
      @click='changeStatus'
      aria-label='メニューを開閉'
    >
      <SeeMore />
    </button>
  </div>
  <div
    :class="{ hidden: hidden }"
    class='menuSlot'>
    <div class='rowGr'>
      <a href='/license/app/'>このアプリについて</a>
      <a href="/license/contents/">コンテンツの著作権</a>
      <a href='/license/'>その他のライセンス</a>
    </div>
    <div class='rowGr'>
      <a @click='URLスキームをコピー'>URLスキームをコピー</a>
    </div>
  </div>
  <div
    @click='changeStatus'
    class='back'
    role='button'
    aria-label='メニューを閉じる'
    v-if="!hidden">
  </div>
</template>

<style scoped lang='scss'>
  .root {
    button {
      border: none;
      background: transparent;
      color: var(--foreground);
    }
    position: relative;
  }
  .menuSlot {
    background: color-mix(in srgb, var(--codeBack) 80%);
    border: 1px solid var(--codeBack);
    width: 300px;
    height: 400px;
    max-height: calc(100dvh - 30px);
    max-width: calc(--100dvh - 30px);
    position: absolute;
    right: 7px;
    top: 50px;
    z-index: 1000;
    backdrop-filter: brightness(85%) blur(8px);
    transition: all 0.25s ease;
    border-radius: 20px;
    &.hidden {
      transform: translate3d(155px, -230px, 0) scale(0);
    }
    .rowGr {
      color: var(--foreground);
      margin: 21px 10px;
      display: flex;
      flex-direction: column;
      a, button {
        color: var(--foreground);
        font-size: 15px;
        padding: 7px 15px;
        height: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-decoration: none;
        &:hover {
          border-radius: 30px;
          background: var(--codeBack);
        }
      }
    }
  }
  .back {
    position: fixed;
    top: 0;
    left: 0;
    background: transparent;
    width: 100vw;
    height: 100dvh;
    z-index: 800;
  }
</style>