import { useState, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';
import { IngredientForm } from './components/IngredientForm';
import { IngredientList } from './components/IngredientList';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Ingredient, Category, FetchedCategory } from './types/Ingredient';
import { CategoryList } from './components/CategoryList';

function App() {
  // useLocalStorage から setIngredients も取り出す
  const { ingredients, error, addIngredient, removeIngredient, setIngredients } = useLocalStorage();
  const [filterCategory, setFilterCategory] = useState<Category>('すべて'); 
  const [fetchedCategories, setFetchedCategories] = useState<FetchedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCategoriesFetched = useCallback((categories: FetchedCategory[]) => {
    setFetchedCategories(categories);
    setIsLoading(false);
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

      <CategoryList onCategoriesFetched={handleCategoriesFetched} />

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              アイテム一覧 ({ingredients.length}件)
            </h2>
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <img src="/cat_loading.gif" alt="Loading categories..." width="60" height="60" />
              ) : (
                <>
                  <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700">
                    カテゴリで絞り込み:
                  </label>
                  <select
                    id="filterCategory"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as Category)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
          {/* ここで確実に渡す */}
          <IngredientList 
            ingredients={filteredIngredients} 
            onRemove={removeIngredient} 
            setIngredients={setIngredients} 
          />
        </div>
        <IngredientForm 
          onSubmit={handleAddIngredient} 
          availableCategories={ingredientFormCategories} 
          defaultCategory={filterCategory}
        />
      </div>
    </Layout>
  );
}

export default App;