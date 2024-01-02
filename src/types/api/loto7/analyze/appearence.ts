import z from 'zod';
import { Loto7NumberValidator } from '@/types/loto7';
import { NextApiRequest, NextApiResponse } from 'next';
import { TresureResponseBase } from '../../tresure_response_base';
import { LOTO7Validator } from '@/types/loto7';

// リクエスト型
export const SearchAppearenceRequestBooleanParamsValidator = z.boolean();
export const SearchAppearenceRequestNumberParamsValidator = Loto7NumberValidator.array().min(1).refine(item => {
  // 要素はユニークである必要がある
  const numSet = new Set(item);
  return numSet.size === item.length;
});

export const SearchAppearenceRequestParamsValidator = z.object({
  is_main_number: SearchAppearenceRequestBooleanParamsValidator,
  numbers: SearchAppearenceRequestNumberParamsValidator
});
export type SearchAppearenceRequestParams = z.infer<typeof SearchAppearenceRequestParamsValidator>;
export interface SearchAppearenceRequest extends NextApiRequest {
  body: SearchAppearenceRequestParams,
}

// レスポンス型
export const SearchAppearenceResponseParamsValidator = z.array(
  z.object({
    number: Loto7NumberValidator,
    result: LOTO7Validator.array(),
  })
);
export type SearchAppearenceResponseParams = z.infer<typeof SearchAppearenceResponseParamsValidator>;
export interface SearchAppearenceResponse extends TresureResponseBase {
  result: z.infer<typeof SearchAppearenceResponseParamsValidator>
};
