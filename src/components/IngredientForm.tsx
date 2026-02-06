import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Ingredient, Category, ALL_CATEGORIES } from '../types/Ingredient';

interface IngredientFormProps {
  onSubmit: (ingredient: Ingredient) => boolean;
}

/**
 * 食材追加フォームコンポーネント
 * 入力検証: 必須フィールドチェック、日付フォーマット検証
 */
export function IngredientForm({ onSubmit }: IngredientFormProps) {
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState<Category>('食材');
  const [error, setError] = useState<string | null>(null);

  // 入力検証: 日付フォーマットチェック
  const validateDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }
    const date = new Date(dateString + 'T00:00:00');
    return !isNaN(date.getTime());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // 入力検証
    if (!name.trim()) {
      setError('アイテム名を入力してください');
      return;
    }

    if (!expiryDate) {
      setError('期限を選択してください');
      return;
    }

    if (!validateDate(expiryDate)) {
      setError('有効な日付を選択してください');
      return;
    }

    // 新しい食材を作成
    const newIngredient: Ingredient = {
      id: crypto.randomUUID(),
      name: name.trim(),
      expiryDate,
      createdAt: new Date().toISOString(),
      category: category,
    };

    // 親コンポーネントに通知
    const success = onSubmit(newIngredient);
    if (success) {
      // 成功時はフォームをリセット
      setName('');
      setExpiryDate('');
      setCategory('食材');
    } else {
      setError('アイテムの追加に失敗しました');
    }
  };

  // 今日の日付を取得（デフォルト値用）
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">アイテムを追加</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            アイテム名 *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: トマト"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            期限 *
          </label>
          <input
            type="date"
            id="expiryDate"
            value={expiryDate}
            min={today}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        追加
      </button>
    </form>
  );
}
