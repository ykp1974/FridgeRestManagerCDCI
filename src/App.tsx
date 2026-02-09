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
      </div>
    </Layout>
  );
}

export default App;
