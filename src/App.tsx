import { useState, useMemo, useCallback } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Layout } from './components/Layout';
import { IngredientForm } from './components/IngredientForm';
import { IngredientList } from './components/IngredientList';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Ingredient, Category, FetchedCategory } from './types/Ingredient';
import { fetchIngredientsFromSpreadsheet } from './api/spreadsheet';
import { CategoryList } from './components/CategoryList';

function App() {
  const { ingredients, error, addIngredient, removeIngredient, setIngredients } = useLocalStorage();
  const [filterCategory, setFilterCategory] = useState<Category>('すべて'); 
  const [fetchedCategories, setFetchedCategories] = useState<FetchedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(false); // 読み込み中フラグ

  const [msg, setMsg] = useState('');
    const showMsg = (text: string) => {
      setMsg(text);
      setTimeout(() => setMsg(''), 3000);
  };

  const handleCategoriesFetched = useCallback((categories: FetchedCategory[]) => {
    setFetchedCategories(categories);
    setIsLoading(false);
  }, []);
  

  // 1. 起動済みかどうかを管理するフラグ（useRefを使用）
  const isInitialMount = useRef(true);

  useEffect(() => {
    // すでに一度実行されていたら何もしない
    if (!isInitialMount.current) return;

    const initData = async () => {
      setIsInitialLoading(true); // モーダル表示開始      
      try {
        const data = await fetchIngredientsFromSpreadsheet();
        if (data && data.length > 0) {
          setIngredients(data);
          showMsg('最新データを読み込みました');
        }
      } catch (err) {
        console.error("起動時の同期失敗:", err);
        showMsg('最新データ読み込みに失敗しました');
      } finally {
        setIsInitialLoading(false); // モーダル非表示
        isInitialMount.current = false; // 処理が終わったらフラグを倒す
      }
    };
    initData();
  }, [setIngredients]);

  const handleAddIngredient = (ingredient: Ingredient): boolean => {
    const newIngredient = {
      ...ingredient,
      isNew: true
    };
    const addedIngredient = addIngredient(newIngredient);
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
    return fetchedCategories.length > 0 ? fetchedCategories.map(cat => cat.name) : ['伝言'];
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
            showMsg={showMsg}
          />
        </div>
        <IngredientForm 
          onSubmit={handleAddIngredient} 
          availableCategories={ingredientFormCategories} 
          defaultCategory={filterCategory}
        />
        {/* --- 猫のローディングモーダル --- */}
        {isInitialLoading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
              {/* ここに既存の猫画像コンポーネント、または <img> タグ */}
              <img 
                src="/cat_loading.gif" 
                alt="Loading..." 
                className="w-32 h-32 mb-4"
              />
              <p className="text-gray-600 font-bold animate-pulse">
                スプレッドシートから最新情報を取得中...
              </p>
            </div>
          </div>
        )}
      </div>
      {msg && (
        <div className="fixed bottom-5 right-5 z-[100] bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-600">
          {msg}
        </div>
      )}      
    </Layout>
  );
}

export default App;