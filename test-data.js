/**
 * 機能テストスクリプト
 * 複数選択検索機能の動作確認
 */

// テストデータを注入（localStorage へ）
const testIngredients = [
  {
    id: '1',
    name: 'トマト',
    expiryDate: '2026-02-15',
    createdAt: '2026-02-08T00:00:00.000Z',
    category: '食材'
  },
  {
    id: '2',
    name: 'きゅうり',
    expiryDate: '2026-02-14',
    createdAt: '2026-02-08T00:00:00.000Z',
    category: '食材'
  },
  {
    id: '3',
    name: 'キッチンペーパー',
    expiryDate: '2026-12-31',
    createdAt: '2026-02-08T00:00:00.000Z',
    category: '100均一買い物'
  },
  {
    id: '4',
    name: '牛肉',
    expiryDate: '2026-02-10',
    createdAt: '2026-02-08T00:00:00.000Z',
    category: '食材'
  },
  {
    id: '5',
    name: '買い物リスト更新',
    expiryDate: '2026-02-20',
    createdAt: '2026-02-08T00:00:00.000Z',
    category: 'TODO'
  }
];

localStorage.setItem('fridge-ingredients', JSON.stringify(testIngredients));
console.log('テストデータを localStorage に登録しました');
console.log('ページをリロードしてください');
