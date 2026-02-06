## ゴール
冷蔵庫の食材管理アプリにカテゴリ選択機能（「食材」「100均一買い物」「TODO」）を実装し、ユーザーがアイテムをカテゴリ別に管理できるようにする。

## 前提（仮/確定）
*   既存のReact開発環境（Vite, TypeScript, Tailwind CSS）は正常に機能している。
*   `useLocalStorage` フックは、`Ingredient` データの永続化と取得を正しく行っている。
*   `App.tsx` 内の `IngredientForm` の `onSubmit` 関数は、`category` プロパティを含む `Ingredient` オブジェクトを受け入れる準備ができている。

## タスク分解（詳細）
1.  **`src/types/Ingredient.ts` の修正**:
    *   `Ingredient` インターフェースに `category: string;` を追加する。
    *   許容されるカテゴリ文字列のための `Category` 型ユニオン (`'食材' | '100均一買い物' | 'TODO'`) を定義する。
2.  **`src/components/IngredientForm.tsx` の修正**:
    *   `Category` 型を `../types/Ingredient` からインポートする。
    *   新しいステート変数 `category` を `useState<Category>('食材');` を使用して追加する。
    *   「食材名」入力フィールドの上に、カテゴリ選択用の `<label>` と `<select>` HTML構造を挿入する。
        *   `<select>` には `id="category"`, `value={category}`, `onChange={(e) => setCategory(e.target.value as Category)}` を設定する。
        *   「食材」「100均一買い物」「TODO」の `<option>` タグを含める。
    *   `handleSubmit` 内の `newIngredient` オブジェクトを `category: category,` を含むように更新する。
    *   フォーム送信成功後、`category` ステートを `'食材'` にリセットする。
3.  **`src/App.tsx` の修正**:
    *   `addIngredient` 関数（または同等の関数）のシグネチャまたは内部ロジックを更新し、`newIngredient` オブジェクトからの `category` プロパティを正しく受け取り、状態に保存できるようにする。`setIngredients` の呼び出しが新しいカテゴリで状態を正しく更新することを確認する。
4.  **`src/components/IngredientList.tsx` の修正 (必要に応じて)**:
    *   リストにカテゴリを表示する必要がある場合、`IngredientList` が各 `IngredientItem` の `category` を受け取り、レンダリングするように更新する。
5.  **`src/components/IngredientItem.tsx` の修正 (必要に応じて)**:
    *   個々のアイテムにカテゴリを表示する必要がある場合、`IngredientItem` が `category` プロパティを受け取り、レンダリングするように更新する。

## 影響範囲（ディレクトリ/機能）
*   `src/types/Ingredient.ts`: 型定義の変更
*   `src/components/IngredientForm.tsx`: UIとフォームロジックの変更
*   `src/App.tsx`: グローバルステートとロジックの変更
*   `src/components/IngredientList.tsx`: (潜在的に) 表示ロジックの変更
*   `src/components/IngredientItem.tsx`: (潜在的に) 表示ロジックの変更

## リスクと対策（表）
| リスク                                     | 対策                                                                     |
| :--------------------------------------- | :----------------------------------------------------------------------- |
| `category` 追加後の型エラー              | `Ingredient` 型のすべての使用箇所が更新されていることを確認する。        |
| 新しい選択要素によるUIレイアウトの問題   | 既存のTailwind CSSクラスを使用して、一貫したスタイリングを維持する。     |
| データ永続化の問題                       | `useLocalStorage` が新しい `category` フィールドを正しく処理するか検証する。|
| 既存機能の回帰                           | 変更後に既存のテスト（あれば）と手動テストを実行する。                   |

## Done条件（箇条書き）
*   `npm run dev` がエラーなくアプリケーションを起動する。
*   食材フォームに「食材名」入力の上にカテゴリ選択ドロップダウンが表示される。
*   カテゴリドロップダウンに「食材」「100均一買い物」「TODO」のオプションが含まれる。
*   カテゴリを選択してアイテムを追加すると、選択されたカテゴリが正しくアイテムに関連付けられて保存される。
*   既存の食材名と賞味期限の機能は以前と同じように動作する。
*   新しいコンソールエラーや警告が表示されない。

## 実行手順（ローカル手順チェックリスト：[ ]）
- [ ] `src/types/Ingredient.ts` に `category: string;` と `type Category = '食材' | '100均一買い物' | 'TODO';` を追加する。
- [ ] `src/components/IngredientForm.tsx` で `Category` 型をインポートする。
- [ ] `src/components/IngredientForm.tsx` で `const [category, setCategory] = useState<Category>('食材');` を追加する。
- [ ] `src/components/IngredientForm.tsx` で、「食材名」入力の上に、適切なラベルとオプションを持つカテゴリ選択入力（`<select>`）を挿入する。
- [ ] `src/components/IngredientForm.tsx` で、`handleSubmit` 内の `newIngredient` に `category: category,` を含めるように更新する。
- [ ] `src/components/IngredientForm.tsx` で、フォーム送信成功後、`category` を `'食材'` にリセットする。
- [ ] `src/App.tsx` で、`addIngredient` 関数が `category` プロパティを受け取り、状態を正しく更新できるようにする。
- [ ] 新機能と既存の機能を確認するために、アプリケーションを手動で素早くチェックする。

## ローカルで必要なコマンド候補
```bash
# 依存関係をインストール（まだの場合）
npm install

# 変更をテストするために開発サーバーを起動
npm run dev

# コンパイルエラーをチェックするためにプロジェクトをビルド
npm run build
```
