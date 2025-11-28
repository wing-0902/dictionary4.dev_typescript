// uuidライブラリをインポート
import { v4 as uuidv4 } from 'uuid';
import type { APIRoute } from 'astro';
import type { KVNamespace } from '@cloudflare/workers-types';

// --- 型定義（Workersから流用） ---
// Cloudflare KVとTurnstile Secret Keyの型定義
// Astroでは、envはランタイムで提供されるため、ここでは型を定義するのみ。
interface RuntimeEnv {
  SURVEY_ANSWERS: KVNamespace;
  TURNSTILE_SECRET_KEY: string;
}

// アンケートのデータ構造を定義
interface SurveyData {
  host: string;
  username?: string;
  email?: string;
  rate: number;
  comment?: string;
  timestamp: number;
}
// ---------------------------------

// AstroでCORSヘッダーを設定するヘルパー
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 1. OPTIONSメソッドハンドラー
// CORSプリフライトリクエストに対応
export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 204, // No Content
    headers: corsHeaders,
  });
};

// 2. POSTメソッドハンドラー
// フォームデータの処理、Turnstile検証、KV保存を実行
export const POST: APIRoute = async ({ request, locals }) => {
  // Astroでは、環境変数（Cloudflare KVなど）は `Astro.locals` または
  // `context.locals.runtime.env` (Astro v4.4以降、Cloudflareアダプターの場合)
  // を通じてアクセスできます。
  // Cloudflare Pages/Workersアダプターを使用していることを前提としています。
  const env: RuntimeEnv = locals.runtime.env as RuntimeEnv;

  try {
    // フォームデータとしてリクエストをパース
    const formData = await request.formData();
    const token = formData.get('cf-turnstile-response');

    // Turnstileトークンがない場合はエラー
    if (!token) {
      return new Response(JSON.stringify({ error: 'Turnstile認証してから出直してください．' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Cloudflareの検証エンドポイントにリクエスト
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: `secret=${encodeURIComponent(env.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(token as string)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const verificationResult = await verificationResponse.json();

    // 検証失敗
    if (!verificationResult.success) {
      console.error('Turnstile検証失敗:', verificationResult['error-codes']);
      return new Response(JSON.stringify({ error: 'あなたはロボットです．' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    // 検証成功。ここからアンケートデータを処理
    const data: SurveyData = {
      host: formData.get('host') as string,
      username: formData.get('username') as string || undefined,
      email: formData.get('email') as string || undefined,
      // parseIntの処理もWorkersからそのまま流用
      rate: parseInt(formData.get('rate') as string, 10), 
      comment: formData.get('comment') as string || undefined,
      timestamp: Date.now(),
    };

    // 必須項目である host と rate のバリデーション
    if (!data.host || typeof data.rate !== 'number' || data.rate < 1 || data.rate > 5) {
      return new Response(JSON.stringify({ error: 'ちゃんと評価してや〜！' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // ユニークなID（UUID）をキーとして生成
    const key = uuidv4();
    
    // データをJSON文字列に変換してKVに保存
    // `env.SURVEY_ANSWERS` は `SURVEY_ANSWERS` KVバインディングを指します
    await env.SURVEY_ANSWERS.put(key, JSON.stringify(data));
    
    return new Response(JSON.stringify({ message: 'たぶんアンケート回答を保存できました．', key: key }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (e) {
    // try/catchブロックでエラーを捕捉し、適切なエラーレスポンスを返す
    console.error('エラー:', e);
    return new Response(JSON.stringify({ error: 'リクエストの形式が間違うてる気がするかもしれません．' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

// 3. その他のメソッドハンドラー
// POSTとOPTIONS以外のHTTPメソッドは許可しない
// Workersのデフォルトエクスポートの代わりに、ここではHTTPメソッドごとのエクスポートを使用
// （このエクスポートがない場合、Astroはデフォルトで404を返します）
export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ error: 'こんなHTTPメソッドは許可してへんぞ！' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
};