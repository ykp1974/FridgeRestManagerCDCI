## 変更ファイル一覧
- `src/types/Ingredient.ts`:
  - **変更理由**: 食材カテゴリを定義し、フィルターオプション「すべて」を含めるために、`Ingredient` インターフェースに `category` プロパティを追加し、`Category` 型ユニオンを拡張しました。
- `src/components/IngredientForm.tsx`:
  - **変更理由**: 新しいカテゴリを食材に追加できるようにするため、`Category` 型のインポート、`category` ステートの追加、カテゴリ選択用ドロップダウンの設置、そしてフォーム送信時に `category` を含めてリセットするロジックを実装しました。
- `src/App.tsx`:
  - **変更理由**: ユーザーがリストをカテゴリで絞り込めるようにするため、`filterCategory` ステートの追加、フィルタリングUI（ドロップダウン）の設置、そしてこのステートに基づいて食材リストをフィルタリングするロジックを実装しました。
- `src/components/IngredientItem.tsx`:
  - **変更理由**: 各食材アイテムにそのカテゴリ情報を表示することで、ユーザーがどのカテゴリに属しているかを一目で確認できるようにしました。

## 実装方針
- ユーザーの要求（カテゴリによるリストの絞り込み）を満たすために、`App.tsx` に新しいフィルターメカニズムを導入しました。
- 既存の `IngredientForm` のカテゴリ選択は、アイテムの追加にのみ使用し、フィルタリングのためには別途 `App.tsx` にフィルターUIを設けました。
- `Ingredient` 型に `category` プロパティを追加し、アプリケーション全体で型安全性を維持しました。
- 各コンポーネントが自身の役割に集中できるよう、変更を局所化しました。

## 主要差分の説明

### `src/types/Ingredient.ts`
```diff
--- a/src/types/Ingredient.ts
+++ b/src/types/Ingredient.ts
@@ -3,11 +3,11 @@
 export interface Ingredient {
   id: string;
   name: string;
-  expiryDate: string; // ISO 8601形式 (YYYY-MM-DD)
-  createdAt: string; // ISO 8601形式 (YYYY-MM-DDTHH:mm:ss.sssZ)
+  expiryDate: string; // ISO 8601形式 (YYYY-MM-DD)
+  createdAt: string; // ISO 8601形式 (YYYY-MM-DDTHH:mm:ss.sssZ)
   category: Category;
 }
 
-export type Category = '食材' | '100均一買い物' | 'TODO';
+export type Category = '食材' | '100均一買い物' | 'TODO' | 'すべて';
 
 /**
  * LocalStorage用のキー
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

### `src/App.tsx`
```diff
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -1,13 +1,15 @@
-import { Layout } from './components/Layout';
+import { useState } from 'react';
+import { Layout } from './components/Layout';
 import { IngredientForm } from './components/IngredientForm';
 import { IngredientList } from './components/IngredientList';
 import { useLocalStorage } from './hooks/useLocalStorage';
-import { Ingredient } from './types/Ingredient';
+import { Ingredient, Category } from './types/Ingredient';
 
 /**
  * メインアプリケーションコンポーネント
  */
 function App() {
   const { ingredients, error, addIngredient, removeIngredient } = useLocalStorage();
+  const [filterCategory, setFilterCategory] = useState<Category>('食材');
 
   const handleAddIngredient = (ingredient: Ingredient): boolean => {
     return addIngredient(ingredient);
@@ -19,15 +21,34 @@
         </div>
       )}
 
       <div className="space-y-6">
         <IngredientForm onSubmit={handleAddIngredient} />
         <div>
-          <h2 className="text-xl font-semibold mb-4 text-gray-800">
-            食材一覧 ({ingredients.length}件)
-          </h2>
-          <IngredientList ingredients={ingredients} onRemove={removeIngredient} />
+          <div className="flex items-center justify-between mb-4">
+            <h2 className="text-xl font-semibold text-gray-800">
+              食材一覧 ({ingredients.length}件)
+            </h2>
+            <div className="flex items-center space-x-2">
+              <label htmlFor="filterCategory" className="text-sm font-medium text-gray-700">
+                カテゴリで絞り込み:
+              </label>
+              <select
+                id="filterCategory"
+                value={filterCategory}
+                onChange={(e) => setFilterCategory(e.target.value as Category)}
+                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
+              >
+                <option value="すべて">すべて</option>
+                <option value="食材">食材</option>
+                <option value="100均一買い物">100均一買い物</option>
+                <option value="TODO">TODO</option>
+              </select>
+            </div>
+          </div>
+          <IngredientList ingredients={filteredIngredients} onRemove={removeIngredient} />
         </div>
       </div>
     </Layout>
   );
 }
 
```
```diff
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -9,11 +9,15 @@
   const { ingredients, error, addIngredient, removeIngredient } = useLocalStorage();
   const [filterCategory, setFilterCategory] = useState<Category>('食材');
 
   const handleAddIngredient = (ingredient: Ingredient): boolean => {
     return addIngredient(ingredient);
   };
 
+  const filteredIngredients = ingredients.filter((ingredient) =>
+    filterCategory === 'すべて' ? true : ingredient.category === filterCategory
+  );
+
   return (
     <Layout>
       {error && (
         <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">

```

### `src/components/IngredientItem.tsx`
```diff
--- a/src/components/IngredientItem.tsx
+++ b/src/components/IngredientItem.tsx
@@ -31,10 +31,13 @@
           <div className="flex items-center gap-2 mb-2">
             <h3 className="text-lg font-semibold">{ingredient.name}</h3>
             <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/80">
               {badgeText}
             </span>
           </div>
-          <p className="text-sm opacity-80">
+          <p className="text-sm opacity-80 mb-1">
+            カテゴリ: {ingredient.category}
+          </p>
+          <p className="text-sm opacity-80">
             賞味期限: {formatDate(ingredient.expiryDate)}
           </p>
         </div>
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
    *   **食材追加フォーム**:
        *   「カテゴリ」ドロップダウンが表示されていること。
        *   ドロップダウンに「食材」「100均一買い物」「TODO」のオプションがあること。
        *   いずれかのカテゴリを選択し、食材名と賞味期限を入力して「追加」ボタンをクリックすると、アイテムがリストに追加され、正しいカテゴリが関連付けられていること。
        *   フォームがリセットされ、カテゴリ選択が「食材」に戻っていること。
        *   既存の「食材名」と「賞味期限」の入力機能が正常に動作していること。
    *   **食材一覧**:
        *   リストの上に「カテゴリで絞り込み:」という新しいドロップダウンが表示されていること。
        *   このドロップダウンに「すべて」「食材」「100均一買い物」「TODO」のオプションがあること。
        *   各アイテムの下に「カテゴリ: [選択されたカテゴリ]」が表示されていること。
        *   フィルタードロップダウンでカテゴリを選択すると、リストに表示されるアイテムがそのカテゴリに絞り込まれること。「すべて」を選択すると、すべてのアイテムが表示されること。

3.  **コンパイルエラーのチェック**
    ```bash
    npm run build
    ```
    このコマンドでビルドが成功し、コンパイルエラーがないことを確認してください。
