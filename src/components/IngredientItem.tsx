import { Trash2 } from 'lucide-react';
import { Ingredient } from '../types/Ingredient';
import { getDaysUntilExpiry, formatDate } from '../utils/dateUtils';
import { getExpiryColorClass, getExpiryBadgeText } from '../utils/colorUtils';
import { SearchButton } from './SearchButton';

interface IngredientItemProps {
  ingredient: Ingredient;
  onRemove: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

// 背景色を決定する関数
const getCardStyle = (category: string, isNew?: boolean) => {
  // ① 新しく追加されたアイテム（最優先）
  if (isNew) {
    return "bg-pink-500 text-white border-pink-600"; // 濃いピンク
  }

  // ② カテゴリ別の色分け
  switch (category) {
    case '食材':
      return "bg-orange-100 border-orange-200 text-orange-900";
    case 'TODO':
      return "bg-yellow-100 border-yellow-200 text-yellow-900";
    case '100均一買い物':
      return "bg-pink-100 border-pink-200 text-pink-900"; // ピンク
    case '伝言':
      return "bg-blue-50 border-blue-200 text-blue-900"; // 薄いブルー
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
};

/**
 * 食材アイテムコンポーネント
 * 期限に応じた色分け表示
 */
export function IngredientItem({ ingredient, onRemove, isSelected, onToggleSelect }: IngredientItemProps) {
  const daysUntilExpiry = getDaysUntilExpiry(ingredient.expiryDate);
  // const colorClass = getExpiryColorClass(daysUntilExpiry);
  getExpiryColorClass(daysUntilExpiry);
  const badgeText = getExpiryBadgeText(daysUntilExpiry);

  const handleRemove = () => {
    // 確認ダイアログ（簡易版）
    if (window.confirm(`「${ingredient.name}」を削除しますか？`)) {
      onRemove(ingredient.id);
    }
  };

  // スタイルを取得
  const cardStyle = getCardStyle(ingredient.category, ingredient.isNew);

  return (
    <div className={`relative p-4 rounded-lg border-2 shadow-sm transition-all ${cardStyle}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={isSelected || false}
              onChange={() => onToggleSelect(ingredient.id)}
              className="mt-1 w-5 h-5 text-blue-600 rounded cursor-pointer"
              aria-label={`${ingredient.name}を選択`}
            />
          )}
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
