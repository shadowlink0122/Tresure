import z from 'zod';
import { PositiveIntNumberValidator } from '@/types/common';
import { Loto7Validator } from '@/types/loto7';
import { NextApiRequest } from 'next';
import { TresureResponseBase } from '../tresure_response_base';

// N回目~M個指定で撮る場合
export const NumberParamsValidator = z.object({
  from: PositiveIntNumberValidator.optional(),// 1以上
  times: PositiveIntNumberValidator.optional(),
}).optional();
export type NumberParams = z.infer<typeof NumberParamsValidator>

// 期間で撮る場合
const TermParamsValidator = z.object({
  since: z.string().datetime().optional(),
  until: z.string().datetime().optional(),
}).optional();
export type TermParams = z.infer<typeof TermParamsValidator>

// リクエスト型
export const InfoRequestParamsValidator = z.object({
  type_number: NumberParamsValidator,
  type_term: TermParamsValidator
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
