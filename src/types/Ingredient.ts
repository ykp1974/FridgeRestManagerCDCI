export interface FetchedCategory {
  id: number;
  name: string;
}

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

export type Category = string;

export const STORAGE_KEY = 'fridge-ingredients';
