---
title: const
品詞: 変数宣言
jsInclude: true
tsInclude: true
---

## 1. 変数を宣言

```js
// JavaScript
const userName = '太郎';
// 変数「userName」を「太郎」にする
```

```js
// TypeScript
const userName: string = '太郎';
// 変数「userName（文字列型）」を「太郎」にする
// この場合，
```

- `const`で宣言された変数は，宣言時に代入（値を確定させること）が必要です．
- `const`で宣言された変数に再代入しようとすると，エラーになります．