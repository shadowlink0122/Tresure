import z from 'zod';

// 共通
export const PositiveIntNumberValidator = z.number().int().positive();
export const NonNegativeIntNumberValidator = z.number().int().nonnegative();

// 配列がユニークかを確認する
export function isUniqueArray<T>(item: T[]): boolean {
  // 要素はユニークである必要がある
  const numSet = new Set(item);
  return numSet.size === item.length;
}
