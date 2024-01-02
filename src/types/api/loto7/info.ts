import z from 'zod';
import { PositiveIntNumberValidator } from '@/types/common';
import { Loto7Validator } from '@/types/loto7';
import { NextApiRequest } from 'next';
import { TresureResponseBase } from '../tresure_response_base';

// N回目~M個指定で撮る場合
export const ParamTypeNumberValidator = z.object({
  from: PositiveIntNumberValidator.optional(),
  times: PositiveIntNumberValidator.optional(),
}).optional();
export type ParamTypeNumber = z.infer<typeof ParamTypeNumberValidator>

// 期間で撮る場合
const ParamTypeTermValidator = z.object({
  since: z.string().datetime().optional(),
  until: z.string().datetime().optional(),
}).optional();
export type ParamTypeTerm = z.infer<typeof ParamTypeTermValidator>

// リクエスト型
export const InfoRequestParamsValidator = z.object({
  type_number: ParamTypeNumberValidator,
  type_term: ParamTypeTermValidator
});
export type InfoRequestParams = z.infer<typeof InfoRequestParamsValidator>;
export interface InfoRequest extends NextApiRequest {
  body: InfoRequestParams,
}

// レスポンス型
export const InfoResponseParamsValidator = Loto7Validator.array();
export type InfoResponseParams = z.infer<typeof InfoResponseParamsValidator>;
export interface InfoResponse extends TresureResponseBase {
  result: z.infer<typeof InfoResponseParamsValidator>
};
