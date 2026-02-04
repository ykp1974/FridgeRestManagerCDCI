import { describe, expect, it } from 'vitest';
import { getExpiryBadgeText, getExpiryColorClass } from './colorUtils';

describe('colorUtils', () => {
  describe('getExpiryColorClass', () => {
    it('期限切れは赤', () => {
      expect(getExpiryColorClass(-1)).toContain('bg-red-100');
    });

    it('2日以内はオレンジ', () => {
      expect(getExpiryColorClass(2)).toContain('bg-orange-100');
      expect(getExpiryColorClass(1)).toContain('bg-orange-100');
      expect(getExpiryColorClass(0)).toContain('bg-orange-100');
    });

    it('1週間以内は黄色', () => {
      expect(getExpiryColorClass(7)).toContain('bg-yellow-100');
      expect(getExpiryColorClass(3)).toContain('bg-yellow-100');
    });

    it('それ以外は緑', () => {
      expect(getExpiryColorClass(8)).toContain('bg-green-100');
    });
  });

  describe('getExpiryBadgeText', () => {
    it('期限切れ', () => {
      expect(getExpiryBadgeText(-3)).toBe('期限切れ（3日経過）');
    });
    it('今日期限', () => {
      expect(getExpiryBadgeText(0)).toBe('今日期限');
    });
    it('明日期限', () => {
      expect(getExpiryBadgeText(1)).toBe('明日期限');
    });
    it('あとN日', () => {
      expect(getExpiryBadgeText(5)).toBe('あと5日');
    });
  });
});

