import { Trash2 } from 'lucide-react';
import { Ingredient } from '../types/Ingredient';
import { getDaysUntilExpiry, formatDate } from '../utils/dateUtils';
import { getExpiryColorClass, getExpiryBadgeText } from '../utils/colorUtils';
import { SearchButton } from './SearchButton';

interface IngredientItemProps {
  ingredient: Ingredient;
  onRemove: (id: string) => void;
}

/**
 * 食材アイテムコンポーネント
 * 期限に応じた色分け表示
 */
export function IngredientItem({ ingredient, onRemove }: IngredientItemProps) {
  const daysUntilExpiry = getDaysUntilExpiry(ingredient.expiryDate);
  const colorClass = getExpiryColorClass(daysUntilExpiry);
  const badgeText = getExpiryBadgeText(daysUntilExpiry);

  const handleRemove = () => {
    // 確認ダイアログ（簡易版）
    if (window.confirm(`「${ingredient.name}」を削除しますか？`)) {
      onRemove(ingredient.id);
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClass} transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{ingredient.name}</h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/80">
              {badgeText}
            </span>
          </div>
          <p className="text-sm opacity-80 mb-1">
            カテゴリ: {ingredient.category}
          </p>
          <p className="text-sm opacity-80">
            期限: {formatDate(ingredient.expiryDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SearchButton ingredientName={ingredient.name} category={ingredient.category} />
          <button
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label={`${ingredient.name}を削除`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
