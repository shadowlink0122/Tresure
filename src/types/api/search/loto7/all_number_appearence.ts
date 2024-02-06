import { PositiveIntNumberValidator } from '@/types/common';
import { MAX_LOTO7_NUMBER } from '@/types/loto7';
import z from 'zod';

// リクエスト
export const SearchAllNumberAppearenceRequestParamsValidator = z.object({
  // 要素は増える予定
  is_main_number: z.boolean(),
  terms: PositiveIntNumberValidator.min(1),
});

export type SearchAllNumberAppearenceRequestParams = z.infer<
  typeof SearchAllNumberAppearenceRequestParamsValidator
>;

// レスポンス
export const AllNumberAppearenceStatusValidator = z
  .enum(['most', 'many', 'few', 'less'])
  .optional();
export type AllNumberAppearenceStatus = z.infer<
  typeof AllNumberAppearenceStatusValidator
>;
export const NumberCountParamsValidator = z.object({
  number: PositiveIntNumberValidator.max(MAX_LOTO7_NUMBER),
  count: PositiveIntNumberValidator,
  volume: AllNumberAppearenceStatusValidator.optional(),
});
export type NumberCountParams = z.infer<typeof NumberCountParamsValidator>;
export const SearchAllNumberAppearenceResponseParamsValidator =
  NumberCountParamsValidator.array();
export type SearchAllNumberAppearenceResponseParams = z.infer<
  typeof SearchAllNumberAppearenceResponseParamsValidator
>;
