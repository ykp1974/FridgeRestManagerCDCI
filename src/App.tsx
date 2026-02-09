import { useState, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';
import { IngredientForm } from './components/IngredientForm';
import { IngredientList } from './components/IngredientList';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Ingredient, Category, FetchedCategory } from './types/Ingredient'; // Import FetchedCategory
import { CategoryList } from './components/CategoryList';
/**
 * メインアプリケーションコンポーネント
 */
function App() {
  const { ingredients, error, addIngredient, removeIngredient } = useLocalStorage();
  const [filterCategory, setFilterCategory] = useState<Category>('食材');
  const [fetchedCategories, setFetchedCategories] = useState<FetchedCategory[]>([]); // State for fetched categories

  const handleCategoriesFetched = useCallback((categories: FetchedCategory[]) => {
    setFetchedCategories(categories);
  }, []);

  const handleAddIngredient = (ingredient: Ingredient): boolean => {
    const addedIngredient = addIngredient(ingredient);
    if (addedIngredient) {
      setFilterCategory(addedIngredient.category);
      return true;
    }
    return false;
  };

  const filterOptions = useMemo(() => {
    const dynamicCategories = fetchedCategories.map(cat => cat.name);
    return ['すべて', ...dynamicCategories];
  }, [fetchedCategories]);

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ingredient) =>
      filterCategory === 'すべて' ? true : ingredient.category === filterCategory
    );
  }, [ingredients, filterCategory]);

  const ingredientFormCategories = useMemo(() => {
    return fetchedCategories.length > 0 ? fetchedCategories.map(cat => cat.name) : ['食材'];
  }, [fetchedCategories]);

  // 1. 保存用関数を定義
  const saveToSpreadsheet = async () => {
    const GAS_URL = "https://script.google.com/macros/s/AKfycbz8OTAlrVLKILXZv01DkmeOpQa0-nLlP7XfEwZk_cNDgPb4DSRAhaOTqyY0gKKBNOU/exec"; // 末尾が /exec であることを確認
    const testData = { message: "テスト成功", value: 123 };

    try {
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors", // これによりブラウザのCORSチェックをスキップします
        cache: "no-cache",
        headers: {
          // 重要：ここをあえて空にするか、Content-Typeを指定しない
        },
        body: JSON.stringify(testData),
      });

      // no-corsモードではレスポンスの中身は読めませんが、
      // ここまで来れば送信処理自体はブラウザから投げられています。
      alert("送信処理を投げました。スプシを確認してください。");
    } catch (e) {
      console.error("ネットワークエラー:", e);
    }
  };

  return (
    <Layout>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* CategoryList component is now responsible for fetching data, not rendering */}
      <CategoryList onCategoriesFetched={handleCategoriesFetched} />

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              アイテム一覧 ({ingredients.length}件)
            </h2>
            <div className="flex items-center space-x-2">
              <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700">
                カテゴリで絞り込み:
              </label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as Category)} // Cast to Category
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filterOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <IngredientList ingredients={filteredIngredients} onRemove={removeIngredient} />
        </div>
        <IngredientForm onSubmit={handleAddIngredient} availableCategories={ingredientFormCategories} />

        {/* 2. テスト用ボタンを配置 */}
        <button 
          onClick={saveToSpreadsheet}
          style={{ marginTop: '20px', padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}
        >
          スプシにテストデータを保存
        </button>
      </div>
    </Layout>
  );
}

export default App;
