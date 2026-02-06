import { useState, useEffect } from 'react';
import { Ingredient, STORAGE_KEY } from '../types/Ingredient';

/**
 * LocalStorage操作のカスタムフック
 * 入力検証: データの整合性チェック
 * 例外処理: LocalStorage未対応ブラウザや容量超過時のエラーハンドリング
 */
export function useLocalStorage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 初期化: LocalStorageから読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 入力検証: 配列であることを確認
        if (Array.isArray(parsed)) {
          setIngredients(parsed);
        } else {
          console.warn('Invalid data format in LocalStorage, resetting...');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (err) {
      // 例外処理: パースエラー時のフォールバック
      console.error('Failed to load from LocalStorage:', err);
      setError('データの読み込みに失敗しました');
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // 保存: LocalStorageに書き込み
  const saveIngredients = (newIngredients: Ingredient[]) => {
    try {
      // 入力検証: データ量チェック（簡易版）
      const jsonString = JSON.stringify(newIngredients);
      if (jsonString.length > 5 * 1024 * 1024) {
        // 5MB制限（LocalStorageの一般的な上限）
        throw new Error('データ量が上限を超えています');
      }
      localStorage.setItem(STORAGE_KEY, jsonString);
      setIngredients(newIngredients);
      setError(null);
    } catch (err) {
      // 例外処理: 容量超過や書き込みエラー
      console.error('Failed to save to LocalStorage:', err);
      setError(err instanceof Error ? err.message : 'データの保存に失敗しました');
    }
  };

  // 追加
  const addIngredient = (ingredient: Ingredient) => {
    // 入力検証: 必須フィールドチェック
    if (!ingredient.name.trim() || !ingredient.expiryDate) {
      setError('アイテム名と期限は必須です');
      return false;
    }
    const updated = [...ingredients, ingredient];
    saveIngredients(updated);
    return true;
  };

  // 削除
  const removeIngredient = (id: string) => {
    const updated = ingredients.filter((item) => item.id !== id);
    saveIngredients(updated);
  };

  // 更新
  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    const updated = ingredients.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    saveIngredients(updated);
  };

  return {
    ingredients,
    error,
    addIngredient,
    removeIngredient,
    updateIngredient,
  };
}
