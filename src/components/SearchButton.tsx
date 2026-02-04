import { ExternalLink } from 'lucide-react';

interface SearchButtonProps {
  ingredientName: string;
}

/**
 * Google検索ボタンコンポーネント
 * 外部リンクのため、新しいタブで開く
 */
export function SearchButton({ ingredientName }: SearchButtonProps) {
  // 入力検証: 空文字チェック
  if (!ingredientName.trim()) {
    return null;
  }

  const searchQuery = encodeURIComponent(`${ingredientName} レシピ`);
  const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;

  const handleClick = () => {
    // 外部サイトへの遷移を明示的に開く
    window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
      aria-label={`${ingredientName}のレシピをGoogleで検索`}
    >
      <ExternalLink className="w-4 h-4" />
      レシピ検索
    </button>
  );
}
