/**
 * 期限に応じた色判定ユーティリティ
 */

/**
 * 残り日数に基づいて色クラスを返す
 * @param daysUntilExpiry 残り日数
 * @returns Tailwind CSSの色クラス
 */
export function getExpiryColorClass(daysUntilExpiry: number): string {
  if (daysUntilExpiry < 0) {
    // 期限切れ: 赤
    return 'bg-red-100 border-red-400 text-red-800';
  } else if (daysUntilExpiry <= 2) {
    // 2日以内: オレンジ
    return 'bg-orange-100 border-orange-400 text-orange-800';
  } else if (daysUntilExpiry <= 7) {
    // 1週間以内: 黄色
    return 'bg-yellow-100 border-yellow-400 text-yellow-800';
  } else {
    // 余裕あり: 緑
    return 'bg-green-100 border-green-400 text-green-800';
  }
}

/**
 * 残り日数に基づいてバッジテキストを返す
 */
export function getExpiryBadgeText(daysUntilExpiry: number): string {
  if (daysUntilExpiry < 0) {
    return `期限切れ（${Math.abs(daysUntilExpiry)}日経過）`;
  } else if (daysUntilExpiry === 0) {
    return '今日期限';
  } else if (daysUntilExpiry === 1) {
    return '明日期限';
  } else {
    return `あと${daysUntilExpiry}日`;
  }
}
