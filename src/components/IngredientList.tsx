import { Ingredient } from '../types/Ingredient';
import { getDaysUntilExpiry } from '../utils/dateUtils';
import { IngredientItem } from './IngredientItem';

interface IngredientListProps {
  ingredients: Ingredient[];
  onRemove: (id: string) => void;
}

/**
 * 食材一覧コンポーネント
 * 賞味期限が近い順にソートして表示
 */
export function IngredientList({ ingredients, onRemove }: IngredientListProps) {
  // 賞味期限が近い順にソート
  const sortedIngredients = [...ingredients].sort((a, b) => {
    const daysA = getDaysUntilExpiry(a.expiryDate);
    const daysB = getDaysUntilExpiry(b.expiryDate);
    return daysA - daysB;
  });

  if (sortedIngredients.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">まだアイテムが登録されていません</p>
        <p className="text-sm">下のフォームからアイテムを追加してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedIngredients.map((ingredient) => (
        <IngredientItem
          key={ingredient.id}
          ingredient={ingredient}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
