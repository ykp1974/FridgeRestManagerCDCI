import { useState, useMemo } from 'react';
import { Ingredient } from '../types/Ingredient';
import { getDaysUntilExpiry } from '../utils/dateUtils';
import { IngredientItem } from './IngredientItem';
import { MultiSelectSearchButton } from './MultiSelectSearchButton';

interface IngredientListProps {
  ingredients: Ingredient[];
  onRemove: (id: string) => void;
}

/**
 * 食材一覧コンポーネント
 * 賞味期限が近い順にソートして表示
 */
export function IngredientList({ ingredients, onRemove }: IngredientListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 賞味期限が近い順にソート
  const sortedIngredients = [...ingredients].sort((a, b) => {
    const daysA = getDaysUntilExpiry(a.expiryDate);
    const daysB = getDaysUntilExpiry(b.expiryDate);
    return daysA - daysB;
  });

  const selectedIngredients = useMemo(() => {
    return sortedIngredients.filter((ing) => selectedIds.has(ing.id));
  }, [sortedIngredients, selectedIds]);

  const handleToggleSelect = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  if (sortedIngredients.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">まだアイテムが登録されていません</p>
        <p className="text-sm">下のフォームからアイテムを追加してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-2">
                {selectedIds.size}個のアイテムが選択されています
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ing) => (
                  <span
                    key={ing.id}
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {ing.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <MultiSelectSearchButton selectedIngredients={selectedIngredients} />
              <button
                onClick={handleClearSelection}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                クリア
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {sortedIngredients.map((ingredient) => (
          <IngredientItem
            key={ingredient.id}
            ingredient={ingredient}
            onRemove={onRemove}
            isSelected={selectedIds.has(ingredient.id)}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>
    </div>
  );
}
