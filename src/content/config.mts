// 1. `astro:content`からユーティリティをインポート
import { z, defineCollection } from 'astro:content';

// 2. コレクションを定義
const dictionaryCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    品詞: z.string(),
    jsInclude: z.boolean(),
    tsInclude: z.boolean(),
  }),
});

// 3. コレクションを登録するために、単一の`collections`オブジェクトをエクスポート
//    このキーは、"src/content"のコレクションのディレクトリ名と一致する必要があります。
export const collections = {
  'dictionary': dictionaryCollection,
};