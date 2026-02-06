/**
 * 食材エンティティの型定義
 */
export interface Ingredient {
  id: string;
  name: string;
  expiryDate: string; // ISO 8601形式 (YYYY-MM-DD)
  createdAt: string; // ISO 8601形式 (YYYY-MM-DDTHH:mm:ss.sssZ)
  category: Category;
}

export type Category = '食材' | '100均一買い物' | 'TODO' | 'すべて';

export const ALL_CATEGORIES = ['食材', '100均一買い物', 'TODO'] as const;
export const FILTER_CATEGORIES = ['すべて', ...ALL_CATEGORIES] as const;

/**
 * LocalStorage用のキー
 */
export const STORAGE_KEY = 'fridge-ingredients';
