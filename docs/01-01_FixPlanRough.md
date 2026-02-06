## Summary
冷蔵庫の食材管理アプリに「TODO」カテゴリを追加し、食材入力フォームにカテゴリ選択のドロップダウンを実装します。これにより、ユーザーは食材だけでなく、「100均一買い物」や「TODO」といった項目も管理できるようになります。

## Plan（チェックリスト）
- [ ] `src/types/Ingredient.ts` に `category` フィールドを `Ingredient` インターフェースに追加。
- [ ] `src/components/IngredientForm.tsx` にカテゴリ選択の `<select>` 要素を追加し、選択されたカテゴリを新しい食材オブジェクトに含めるように修正。
  - [ ] 新しいカテゴリの状態変数を追加。
  - [ ] `<select>` 要素を「食材」「100均一買い物」「TODO」のオプションと共に実装。
  - [ ] フォーム送信時に選択されたカテゴリを `newIngredient` オブジェクトに設定。
- [ ] `src/App.tsx` の `onSubmit` 関数を更新し、新しい `category` フィールドを処理できるように修正。
- [ ] `src/components/IngredientList.tsx` および `src/components/IngredientItem.tsx` を確認し、必要に応じてカテゴリの表示またはフィルタリングに対応できるよう修正（優先度低）。

## Next Handoff
```markdown
### Handoff to: Coder Agent
#### Objective:
Implement the plan to add a new category field and a category selection dropdown in the ingredient management application.

#### Context:
The user wants to extend the functionality of the fridge ingredient management app to include "TODO" as a category, alongside "食材" and "100均一買い物". This requires modifying the `Ingredient` type, the `IngredientForm` component, and potentially other related components to handle and display the new category information.

#### Specific Instructions:
1.  **Update `src/types/Ingredient.ts`**: Add `category: string;` to the `Ingredient` interface.
2.  **Update `src/components/IngredientForm.tsx`**:
    *   Add `category` to the component's state, initialized to "食材".
    *   Insert a `<label>` and `<select>` element above the "食材名" input field. The `<select>` should have `id="category"`, `value={category}`, `onChange={(e) => setCategory(e.target.value)}`, and options for "食材", "100均一買い物", "TODO".
    *   Modify the `handleSubmit` function to include the selected `category` in the `newIngredient` object.
3.  **Update `src/App.tsx`**: Ensure that the `addIngredient` function (or equivalent) correctly handles the new `category` field when an ingredient is submitted from the form.

#### Acceptance Criteria:
- The application compiles successfully without errors.
- The ingredient form displays a category dropdown with the specified options.
- When a new item is added, the selected category is correctly associated with it.
- Existing functionality remains intact.
```

## Local Commands
```bash
# Verify file changes after implementation
git status
git diff
```
