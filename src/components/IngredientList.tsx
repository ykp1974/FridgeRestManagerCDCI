import { useState, useMemo } from 'react';
import { Ingredient } from '../types/Ingredient';
// import { useLocalStorage } from '../hooks/useLocalStorage';
import { syncIngredientsToSpreadsheet, fetchIngredientsFromSpreadsheet } from '../api/spreadsheet';
import { getDaysUntilExpiry } from '../utils/dateUtils';
import { IngredientItem } from './IngredientItem';
import { MultiSelectSearchButton } from './MultiSelectSearchButton';

// interface を確実に修正
interface IngredientListProps {
  ingredients: Ingredient[];
  onRemove: (id: string) => void;
  // ここを (data: Ingredient[]) => void にして、フックの関数と型を合わせます
  setIngredients: (ingredients: Ingredient[]) => void;
}

export function IngredientList({ ingredients, onRemove, setIngredients }: IngredientListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // useLocalStorage から同期用のデータを取得
  // const { ingredients: storedIngredients } = useLocalStorage();

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      // await syncIngredientsToSpreadsheet(storedIngredients);
      await syncIngredientsToSpreadsheet(ingredients);

      alert('アイテムがスプレッドシートに正常に同期されました。');
    } catch (error) {
      console.error('同期エラー:', error);
      setSyncError('アイテムのスプレッドシートへの同期に失敗しました。');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoad = async () => {
    if (!confirm('スプレッドシートから最新データを読み込みますか？\n現在のリストは上書きされます。')) {
      return;
    }

    setIsLoading(true);
    setSyncError(null);
    try {
      const data = await fetchIngredientsFromSpreadsheet();
      
      // 親から渡された関数を実行（これで App 側のステートと LocalStorage が更新される）
      setIngredients(data);
      
      alert('スプレッドシートからデータを読み込みました。');
    } catch (error) {
      console.error('読み込みエラー:', error);
      setSyncError('スプレッドシートからの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

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

  const renderEmptyState = () => (
    <div className="text-center py-12 text-gray-500">
      <p className="text-lg mb-2">まだアイテムが登録されていません</p>
      <p className="text-sm">下のフォームからアイテムを追加するか、スプレッドシートから読み込んでください</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={handleLoad}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors border
            ${isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-green-600 border-green-600 hover:bg-green-50'}
          `}
          disabled={isLoading || isSyncing}
        >
          {isLoading ? '読み込み中...' : 'スプレッドシートから読込'}
        </button>

        <button
          onClick={handleSync}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
            ${isSyncing
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'}
          `}
          disabled={isSyncing || isLoading}
        >
          {isSyncing ? '同期中...' : 'スプレッドシートに保存'}
        </button>
      </div>

      {syncError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">エラー: </strong>
          <span className="block sm:inline">{syncError}</span>
        </div>
      )}

      {sortedIngredients.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}