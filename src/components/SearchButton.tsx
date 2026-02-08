import { ExternalLink } from 'lucide-react';

import { Category } from '../types/Ingredient';

interface SearchButtonProps {
  ingredientName: string;
  category: Category;
}

/**
 * Google検索ボタンコンポーネント
 * 外部リンクのため、新しいタブで開く
 */
export function SearchButton({ ingredientName, category }: SearchButtonProps) {
  // 入力検証: 空文字チェック
  if (!ingredientName.trim()) {
    return null;
  }
  // カテゴリに応じたボタン表記と検索語を決定
  let label = 'レシピ検索';
  let rawQuery = `${ingredientName} レシピ`;

  if (category === 'TODO') {
    label = '検索';
    rawQuery = ingredientName;
  } else if (category === '100均一買い物') {
    label = '100均検索';
    rawQuery = `${ingredientName} 100均`;
  }

  const searchQuery = encodeURIComponent(rawQuery);
  const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;

  const handleClick = () => {
    // 外部サイトへの遷移を明示的に開く
    window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
      aria-label={`${ingredientName}をGoogleで検索 (${label})`}
    >
      <ExternalLink className="w-4 h-4" />
      {label}
    </button>
  );
}
