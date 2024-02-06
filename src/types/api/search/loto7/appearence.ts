import z from 'zod';
import { Loto7NumberValidator, Loto7Validator } from '@/types/loto7';
import { isUniqueArray } from '@/types/common';

// リクエスト型
export const SearchAppearenceRequestParamsValidator = z.object({
  is_main_number: z.boolean(),
  numbers: Loto7NumberValidator.array().min(1).refine(isUniqueArray),
});
export type SearchAppearenceRequestParams = z.infer<
  typeof SearchAppearenceRequestParamsValidator
>;

// レスポンス型
export const SearchAppearenceResponseParamsValidator = z.array(
  z.object({
    number: Loto7NumberValidator,
    appearences: Loto7Validator.array(),
  }),
);
export type SearchAppearenceResponseParams = z.infer<
  typeof SearchAppearenceResponseParamsValidator
>;
