import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Ingredient, Category } from '../types/Ingredient';

interface MultiSelectSearchButtonProps {
  selectedIngredients: Ingredient[];
}

/**
 * 複数選択アイテムの一括検索ボタンコンポーネント
 */
export function MultiSelectSearchButton({ selectedIngredients }: MultiSelectSearchButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  if (selectedIngredients.length === 0) {
    return null;
  }

  // 選択されたアイテムのカテゴリを取得
  const categories = new Set(selectedIngredients.map((ing) => ing.category));
  const hasMultipleCategories = categories.size > 1;

  // 末尾の語を取得
  const getSuffixWord = (category: Category): string => {
    if (category === 'TODO') {
      return '';
    } else if (category === '100均一買い物') {
      return '100均';
    } else {
      return 'レシピ';
    }
  };

  // 複数選択時の検索クエリを生成
  const buildSearchQuery = (includeSuffix: boolean): string => {
    const names = selectedIngredients.map((ing) => ing.name);

    if (!includeSuffix) {
      // Yesクリック：末尾の語は付加しない
      return names.join('　');
    }

    // Noクリック時や通常時：末尾の語を付加（重複なし）
    const suffixWords = new Set<string>();
    selectedIngredients.forEach((ing) => {
      const suffix = getSuffixWord(ing.category);
      if (suffix) {
        suffixWords.add(suffix);
      }
    });

    const query = names.join('　');
    const suffixes = Array.from(suffixWords).join('　');

    return suffixes ? `${query}　${suffixes}` : query;
  };

  const handleSearch = (includeSuffix: boolean = true) => {
    const rawQuery = buildSearchQuery(includeSuffix);
    const searchQuery = encodeURIComponent(rawQuery);
    const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;

    window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
    setShowDialog(false);
  };

  const handleClick = () => {
    if (hasMultipleCategories) {
      setShowDialog(true);
    } else {
      handleSearch(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
        aria-label="選択したアイテムをまとめて検索"
      >
        <ExternalLink className="w-4 h-4" />
        一括検索
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              複数カテゴリが選択されています
            </h3>
            <p className="text-gray-700 mb-6">
              以下の複数カテゴリが含まれています：
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              {Array.from(categories).map((cat) => (
                <span
                  key={cat}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                >
                  {cat}
                </span>
              ))}
            </div>
            <p className="text-gray-700 mb-6">
              検索しますか？
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleSearch(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                検索する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
