/**
 * 日付計算ユーティリティ
 * 入力検証: 日付フォーマットの検証
 * 例外処理: 無効な日付のハンドリング
 */

/**
 * 日付文字列からDateオブジェクトに変換（ローカル時間基準）
 */
export function parseDate(dateString: string): Date {
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date;
}

/**
 * 今日の日付を取得（時刻は00:00:00）
 */
export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * 賞味期限までの日数を計算
 * @param expiryDate 賞味期限（YYYY-MM-DD形式）
 * @returns 残り日数（負の値は期限切れ）
 */
export function getDaysUntilExpiry(expiryDate: string): number {
  try {
    const expiry = parseDate(expiryDate);
    const today = getToday();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (err) {
    console.error('Failed to calculate days until expiry:', err);
    return 0;
  }
}

/**
 * 日付を表示用フォーマットに変換（YYYY年MM月DD日）
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseDate(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  } catch (err) {
    console.error('Failed to format date:', err);
    return dateString;
  }
}
