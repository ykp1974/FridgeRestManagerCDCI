import { Layout } from './components/Layout';
import { IngredientForm } from './components/IngredientForm';
import { IngredientList } from './components/IngredientList';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Ingredient } from './types/Ingredient';

/**
 * メインアプリケーションコンポーネント
 */
function App() {
  const { ingredients, error, addIngredient, removeIngredient } = useLocalStorage();

  const handleAddIngredient = (ingredient: Ingredient): boolean => {
    return addIngredient(ingredient);
  };

  return (
    <Layout>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <IngredientForm onSubmit={handleAddIngredient} />
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            食材一覧 ({ingredients.length}件)
          </h2>
          <IngredientList ingredients={ingredients} onRemove={removeIngredient} />
        </div>
      </div>
    </Layout>
  );
}

export default App;
