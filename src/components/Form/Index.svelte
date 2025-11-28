<script lang="ts">
  // インポート
  import Required from './Required.svelte';
  import Star from './Star.svelte';
  import { Turnstile } from 'svelte-turnstile';

  // 型を定義
  type IntegerFrom0To5 = 0 | 1 | 2 | 3 | 4 | 5;

  // フォーム内で使用する変数
  let username: string = '';
  let email: string = '';
  let comment: string = '';
  let rate: IntegerFrom0To5 = 0;

  // handleSubmit関数
  async function handleSubmit(event: Event) {
    event?.preventDefault();

    // フォームの要素を取得し、FormDataオブジェクトを生成
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // エラーを監視
    let hasError = false;

    // 評価
    const rateValue = formData.get('rate');
    if (!rateValue || parseInt(rateValue as string, 10) < 1 || parseInt(rateValue as string, 10) > 5) {
      alert('評価は必須項目です．1から5の星を選択してください．');
      hasError = true;
    }

    const token = formData.get('cf-turnstile-response');
    if (!token) {
      alert ('Turnstileトークンがありません．ロボットでないことの検証を完了してください．')
      hasError = true;
    }

    if (hasError) {
      return;
    }

    formData.append('host', 'wave.graphics');

    try {
      // fetch APIを使ってサーバーにPOSTリクエストを送信
      const response = await fetch('/form/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert(`送信失敗：${result.error}`);
      }
    } catch (e) {
      alert('通信エラーが発生しました．');
      console.error('Error:', e);
    }
  }
</script>

<div>
  <form on:submit={handleSubmit}>
    <fieldset>
      <legend>あなたについて</legend>
      <div class='spacer'>
        <label for='name'>お名前</label>
        <input name='name' placeholder='ニックネームもOKです．' type='text' id='name' bind:value={username} />
      </div>
      <br />
      <div class='spacer'>
        <label for='email'>メールアドレス</label>
        <input name='email' placeholder='contact@wave.graphics' type='text' id='email' bind:value={email} />
      </div>
    </fieldset>
    <fieldset>
      <legend>評価とコメント</legend>
      <p><Required />この記事を5段階で評価すると？</p>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={1} />
        <Star currentRate={rate} rateStar={1} />
      </label>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={2} />
        <Star currentRate={rate} rateStar={2} />
      </label>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={3} />
        <Star currentRate={rate} rateStar={3} />
      </label>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={4} />
        <Star currentRate={rate} rateStar={4} />
      </label>
      <label>
        <input bind:group={rate} type='radio' name='rate' value={5} />
        <Star currentRate={rate} rateStar={5} />
      </label>
      <br /><br />
      <label for='comment'>編集部へのメッセージ，ご意見など，ご自由にお書きください．</label><br />
      <textarea placeholder='ここにコメントを入力' id='comment' name='comment' bind:value={comment}></textarea>
    </fieldset>
    <Turnstile siteKey='0x4AAAAAACDaRh_Fzk8DXhP1' />
    <div class='submitBtnBox'>
      <button type='submit'>
        送信
      </button>
    </div>
  </form>
</div>

<style lang="scss">
  
</style>