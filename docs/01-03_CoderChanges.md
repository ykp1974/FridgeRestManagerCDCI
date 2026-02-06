## 変更ファイル一覧
- `src/types/Ingredient.ts`: `Ingredient` インターフェースに `category` プロパティを追加し、`Category` 型を定義しました。これは、食材だけでなく、「100均一買い物」や「TODO」といった新しいカテゴリを扱うために必要です。
- `src/components/IngredientForm.tsx`:
  - `Category` 型をインポートし、`useState` を使って `category` ステートを管理するようにしました。
  - 「食材名」入力フィールドの上に、カテゴリ選択用の `<select>` ドロップダウンを追加しました。
  - フォームの `handleSubmit` 関数内で、新しい `Ingredient` オブジェクトに選択された `category` を含めるように変更しました。
  - フォーム送信成功後、`category` ステートを初期値である「食材」にリセットするようにしました。
  これらの変更により、ユーザーは新しいカテゴリを選択してアイテムを追加できるようになります。

## 実装方針
- 最小限の差分でコードを変更し、既存の機能を損なわないように努めました。
- 型定義を更新し、それに応じて関連コンポーネントのロジックを修正しました。
- `useLocalStorage` フックは、`Ingredient` オブジェクトの構造変更（`category` の追加）を透過的に処理できるため、変更は不要でした。
- `App.tsx` は、既に `Ingredient` 型のオブジェクトを `handleAddIngredient` に渡しているため、追加の変更は不要でした。

## 主要差分の説明

### `src/types/Ingredient.ts`
```diff
--- a/src/types/Ingredient.ts
+++ b/src/types/Ingredient.ts
@@ -3,8 +3,11 @@
 export interface Ingredient {
   id: string;
   name: string;
-  expiryDate: string; // ISO 8601形式 (YYYY-MM-DD)
-  createdAt: string; // ISO 8601形式 (YYYY-MM-DDTHH:mm:ss.sssZ)
+  expiryDate: string; // ISO 8601形式 (YYYY-MM-DD)
+  createdAt: string; // ISO 8601形式 (YYYY-MM-DDTHH:mm:ss.sssZ)
+  category: Category;
 }
 
+export type Category = '食材' | '100均一買い物' | 'TODO';
+
 /**
  * LocalStorage用のキー
  */

```

### `src/components/IngredientForm.tsx`
```diff
--- a/src/components/IngredientForm.tsx
+++ b/src/components/IngredientForm.tsx
@@ -1,16 +1,18 @@
 import { useState, FormEvent } from 'react';
 import { Plus } from 'lucide-react';
-import { Ingredient } from '../types/Ingredient';
+import { Ingredient, Category } from '../types/Ingredient';
 
 interface IngredientFormProps {
   onSubmit: (ingredient: Ingredient) => boolean;
 }
 
 /**
  * 食材追加フォームコンポーネント
  * 入力検証: 必須フィールドチェック、日付フォーマット検証
  */
 export function IngredientForm({ onSubmit }: IngredientFormProps) {
   const [name, setName] = useState('');
   const [expiryDate, setExpiryDate] = useState('');
+  const [category, setCategory] = useState<Category>('食材');
   const [error, setError] = useState<string | null>(null);
 
   // 入力検証: 日付フォーマットチェック
@@ -51,6 +53,7 @@
       id: crypto.randomUUID(),
       name: name.trim(),
       expiryDate,
       createdAt: new Date().toISOString(),
+      category: category,
     };
 
     // 親コンポーネントに通知
@@ -58,6 +61,7 @@
     if (success) {
       // 成功時はフォームをリセット
       setName('');
       setExpiryDate('');
+      setCategory('食材');
     } else {
       setError('食材の追加に失敗しました');
     }
@@ -79,6 +83,23 @@
       )}
 
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
+        <div>
+          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
+            カテゴリ *
+          </label>
+          <select
+            id="category"
+            value={category}
+            onChange={(e) => setCategory(e.target.value as Category)}
+            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
+            required
+          >
+            <option value="食材">食材</option>
+            <option value="100均一買い物">100均一買い物</option>
+            <option value="TODO">TODO</option>
+          </select>
+        </div>
         <div>
           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
             食材名 *

```

## ローカル検証コマンド
以下のコマンドを実行して、変更が正しく機能することを確認してください。

1.  **依存関係のインストール (初回または変更があった場合)**
    ```bash
    npm install
    ```
2.  **開発サーバーの起動**
    ```bash
    npm run dev
    ```
    ブラウザでアプリケーションを開き、以下の点を確認してください。
    *   食材追加フォームに「カテゴリ」のドロップダウンが表示されていること。
    *   ドロップダウンに「食材」「100均一買い物」「TODO」のオプションがあること。
    *   いずれかのカテゴリを選択し、食材名と賞味期限を入力して「追加」ボタンをクリックすると、アイテムがリストに追加され、正しいカテゴリが関連付けられていること。
    *   フォームがリセットされ、カテゴリ選択が「食材」に戻っていること。
    *   既存の「食材名」と「賞味期限」の入力機能が正常に動作していること。

3.  **コンパイルエラーのチェック**
    ```bash
    npm run build
    ```
    このコマンドでビルドが成功し、コンパイルエラーがないことを確認してください。
