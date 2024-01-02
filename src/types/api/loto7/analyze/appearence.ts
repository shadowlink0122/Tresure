import z from 'zod';
import { Loto7NumberValidator } from '@/types/loto7';
import { NextApiRequest, NextApiResponse } from 'next';
import { TresureResponseBase } from '../../tresure_response_base';
import { LOTO7Validator } from '@/types/loto7';

// リクエスト型
export const SearchAppearenceRequestBooleanParamsValidator = z.boolean();
export const SearchAppearenceRequestParamsValidator = Loto7NumberValidator.array().refine(item => {
  // 要素はユニークである必要がある
  const numSet = new Set(item);
  return numSet.size === item.length;
});

export type SearchAppearenceRequestBooleanParams = z.input<typeof SearchAppearenceRequestBooleanParamsValidator>;
export type SearchAppearenceRequestParams = z.input<typeof SearchAppearenceRequestParamsValidator>;
export interface SearchAppearenceRequest extends NextApiRequest {
  main_number: SearchAppearenceRequestBooleanParams,
  numbers: SearchAppearenceRequestParams
};

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
