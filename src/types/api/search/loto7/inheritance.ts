import z from 'zod';
import { LOTO7_ARRAY_LENGTH } from '@/types/loto7';
import { PositiveIntNumberValidator } from '@/types/common';
import { Loto7NumberValidator } from '@/types/loto7';

// リクエスト型
const SearchInheritanceInheritValidator = PositiveIntNumberValidator.min(1).max(LOTO7_ARRAY_LENGTH);
const SearchInheritanceConditionValidator = z.enum([
  'over', 'more', 'equal', 'less', 'under'
]);
export type SearchInheritanceInherit = z.infer<typeof SearchInheritanceInheritValidator>;
export type SearchInheritanceCondition = z.infer<typeof SearchInheritanceConditionValidator>;
export const SearchInheritanceRequestParamsValidator = z.object({
  inherit_count: SearchInheritanceInheritValidator,
  condition: SearchInheritanceConditionValidator,
  is_main_number: z.boolean(),
}).refine(item => {
  if (item.condition === 'over' && item.inherit_count === 7) return false;
  if (item.condition === 'under' && item.inherit_count === 0) return false;
  if (item.is_main_number === false && item.inherit_count > 2) return false;
  return true;
});
export type SearchInheritanceRequestParams =
  z.infer<typeof SearchInheritanceRequestParamsValidator>;

// レスポンス型
// 引き継がれる番号を探す
export const SearchInheritanceParamsValidator = z.object({
  implemention: z.array(z.string().min(3)),
  date: z.string(), // TODO: Date型(yyyy/mm/dd)に変換する
  sameMainNumber: z.array(Loto7NumberValidator).max(7),
  sameBonusNumber: z.array(Loto7NumberValidator).max(2),
});
export const SearchInheritanceResponseParamsValidator = SearchInheritanceParamsValidator.array();

export type SearchInheritanceParams = z.infer<typeof SearchInheritanceParamsValidator>;
export type SearchInheritanceResponseParams = z.infer<typeof SearchInheritanceResponseParamsValidator>;
