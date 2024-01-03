import z from 'zod';
import { PositiveIntNumberValidator } from '@/types/common';
import { Loto7Validator } from '@/types/loto7';
import { NextApiRequest } from 'next';
import { TresureResponseBase } from '../tresure_response_base';

// N回目~M個指定で撮る場合
export const Loto7HistoryNumberParamsValidator = z.object({
  from: PositiveIntNumberValidator.optional(),// 1以上
  times: PositiveIntNumberValidator.optional(),
}).optional();
export type NumberParams = z.infer<typeof Loto7HistoryNumberParamsValidator>

// 期間で撮る場合
const Loto7HistoryTermParamsValidator = z.object({
  since: z.string().datetime().optional(),
  until: z.string().datetime().optional(),
}).optional();
export type TermParams = z.infer<typeof Loto7HistoryTermParamsValidator>

// リクエスト型
export const GetLoto7HistoryRequestParamsValidator = z.object({
  type_number: Loto7HistoryNumberParamsValidator,
  type_term: Loto7HistoryTermParamsValidator
});
export type GetLoto7HistoryRequestParams = z.infer<typeof GetLoto7HistoryRequestParamsValidator>;
export interface GetLoto7HistoryRequest extends NextApiRequest {
  body: GetLoto7HistoryRequestParams,
}

// レスポンス型
export const GetLoto7HistoryResponseParamsValidator = Loto7Validator.array();
export type GetLoto7HistoryResponseParams = z.infer<typeof GetLoto7HistoryResponseParamsValidator>;
export interface GetLoto7HistoryResponse extends TresureResponseBase {
  result: z.infer<typeof GetLoto7HistoryResponseParamsValidator>
};
